import { useState, useEffect } from 'react';
import { Database, Search, Users, Heart, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { HeartDiseaseRecord } from '../types';
import { CHEST_PAIN_TYPES, THAL_TYPES } from '../types';

export function DatasetExplorer() {
  const [data, setData] = useState<HeartDiseaseRecord[]>([]);
  const [filteredData, setFilteredData] = useState<HeartDiseaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTarget, setFilterTarget] = useState<number | null>(null);
  const [filterSex, setFilterSex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...data];

    if (filterTarget !== null) {
      filtered = filtered.filter(item => item.target === filterTarget);
    }

    if (filterSex !== null) {
      filtered = filtered.filter(item => item.sex === filterSex);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        item =>
          item.age.toString().includes(searchTerm) ||
          item.chol.toString().includes(searchTerm) ||
          item.trestbps.toString().includes(searchTerm)
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [data, filterTarget, filterSex, searchTerm]);

  const fetchData = async () => {
    const { data: records, error } = await supabase
      .from('heart_disease_data')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && records) {
      setData(records);
      setFilteredData(records);
    }
    setLoading(false);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    total: data.length,
    positive: data.filter(d => d.target === 1).length,
    negative: data.filter(d => d.target === 0).length,
    male: data.filter(d => d.sex === 1).length,
    female: data.filter(d => d.sex === 0).length,
    avgAge: data.length > 0 ? Math.round(data.reduce((a, b) => a + b.age, 0) / data.length) : 0,
    avgChol: data.length > 0 ? Math.round(data.reduce((a, b) => a + b.chol, 0) / data.length) : 0,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-100 rounded-lg">
              <Database className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">إجمالي السجلات</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-100 rounded-lg">
              <Heart className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">حالات مرض القلب</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.positive}{' '}
                <span className="text-sm font-normal text-gray-500">
                  ({((stats.positive / stats.total) * 100).toFixed(1)}%)
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">توزيع الجنس</p>
              <p className="text-lg font-bold text-gray-800">
                ذ: {stats.male} / أ: {stats.female}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Filter className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">متوسط العمر / الكوليسترول</p>
              <p className="text-lg font-bold text-gray-800">
                {stats.avgAge} سنة / {stats.avgChol} مجم
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="البحث بالعمر أو الكوليسترول أو ضغط الدم..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterTarget === null ? '' : filterTarget}
            onChange={e =>
              setFilterTarget(e.target.value === '' ? null : Number(e.target.value))
            }
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">جميع التشخيصات</option>
            <option value="1">مصاب بمرض القلب</option>
            <option value="0">غير مصاب</option>
          </select>
          <select
            value={filterSex === null ? '' : filterSex}
            onChange={e =>
              setFilterSex(e.target.value === '' ? null : Number(e.target.value))
            }
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">جميع الأجناس</option>
            <option value="1">ذكر</option>
            <option value="0">أنثى</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">العمر</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">الجنس</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                  ألم الصدر
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">الضغط</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                  الكوليسترول
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                  النبض
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                  ST
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                  الثلاسيميا
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                  التشخيص
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((record, index) => (
                <tr
                  key={record.id}
                  className={`border-b border-gray-100 ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <td className="py-3 px-4 text-sm text-gray-700">{record.age}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {record.sex === 1 ? 'ذكر' : 'أنثى'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {CHEST_PAIN_TYPES[record.cp]?.label || record.cp}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">{record.trestbps}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{record.chol}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{record.thalach}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{record.oldpeak}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {THAL_TYPES[record.thal]?.label || record.thal}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        record.target === 1
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {record.target === 1 ? 'مصاب' : 'سليم'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-500">
              عرض {startIndex + 1} إلى {Math.min(startIndex + itemsPerPage, filteredData.length)}{' '}
              من {filteredData.length} سجل
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <span className="px-4 py-2 text-sm font-medium text-gray-700">
                صفحة {currentPage} من {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
