import { useState, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp, Clock, Users, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { HeartDiseaseRecord, PredictionRecord } from '../types';

interface ChartBarProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}

function ChartBar({ label, value, maxValue, color }: ChartBarProps) {
  const percentage = (value / maxValue) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-sm text-gray-600 text-right">{label}</span>
      <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-12 text-sm font-medium text-gray-700">{value}</span>
    </div>
  );
}

export function Analytics() {
  const [datasetStats, setDatasetStats] = useState<HeartDiseaseRecord[]>([]);
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [datasetRes, predictionsRes] = await Promise.all([
      supabase.from('heart_disease_data').select('*'),
      supabase.from('predictions').select('*').order('created_at', { ascending: false }),
    ]);

    if (datasetRes.data) setDatasetStats(datasetRes.data);
    if (predictionsRes.data) setPredictions(predictionsRes.data);
    setLoading(false);
  };

  const ageGroups = {
    '29-39': datasetStats.filter(d => d.age >= 29 && d.age < 40).length,
    '40-49': datasetStats.filter(d => d.age >= 40 && d.age < 50).length,
    '50-59': datasetStats.filter(d => d.age >= 50 && d.age < 60).length,
    '60-69': datasetStats.filter(d => d.age >= 60 && d.age < 70).length,
    '+70': datasetStats.filter(d => d.age >= 70).length,
  };

  const maxAgeGroup = Math.max(...Object.values(ageGroups));

  const diseaseByGender = {
    malePositive: datasetStats.filter(d => d.sex === 1 && d.target === 1).length,
    maleNegative: datasetStats.filter(d => d.sex === 1 && d.target === 0).length,
    femalePositive: datasetStats.filter(d => d.sex === 0 && d.target === 1).length,
    femaleNegative: datasetStats.filter(d => d.sex === 0 && d.target === 0).length,
  };

  const chestPainDist = {
    'ذبحة نموذجية': datasetStats.filter(d => d.cp === 0).length,
    'ذبحة غير نموذجية': datasetStats.filter(d => d.cp === 1).length,
    'ألم غير ذبحي': datasetStats.filter(d => d.cp === 2).length,
    'بدون أعراض': datasetStats.filter(d => d.cp === 3).length,
  };

  const maxChestPain = Math.max(...Object.values(chestPainDist));

  const totalPositive = datasetStats.filter(d => d.target === 1).length;
  const positivePercent = datasetStats.length > 0 ? (totalPositive / datasetStats.length) * 100 : 0;

  const predictionStats = {
    total: predictions.length,
    highRisk: predictions.filter(p => p.probability >= 60).length,
    mediumRisk: predictions.filter(p => p.probability >= 30 && p.probability < 60).length,
    lowRisk: predictions.filter(p => p.probability < 30).length,
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
              <BarChart3 className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">حجم البيانات</p>
              <p className="text-2xl font-bold text-gray-800">{datasetStats.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-100 rounded-lg">
              <Heart className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">نسبة الإصابة</p>
              <p className="text-2xl font-bold text-gray-800">{positivePercent.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">إجمالي التنبؤات</p>
              <p className="text-2xl font-bold text-gray-800">{predictionStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">حالات خطر عالي</p>
              <p className="text-2xl font-bold text-gray-800">{predictionStats.highRisk}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">توزيع الأعمار</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(ageGroups).map(([label, value]) => (
              <ChartBar
                key={label}
                label={label}
                value={value}
                maxValue={maxAgeGroup}
                color="bg-teal-500"
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">المرض حسب الجنس</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-3xl font-bold text-blue-600">
                {diseaseByGender.malePositive + diseaseByGender.maleNegative}
              </p>
              <p className="text-sm text-gray-600 mt-1">الذكور</p>
              <div className="mt-3 flex justify-center gap-2">
                <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs rounded-full">
                  {diseaseByGender.malePositive} مصاب
                </span>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                  {diseaseByGender.maleNegative} سليم
                </span>
              </div>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-xl">
              <p className="text-3xl font-bold text-pink-600">
                {diseaseByGender.femalePositive + diseaseByGender.femaleNegative}
              </p>
              <p className="text-sm text-gray-600 mt-1">الإناث</p>
              <div className="mt-3 flex justify-center gap-2">
                <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs rounded-full">
                  {diseaseByGender.femalePositive} مصاب
                </span>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                  {diseaseByGender.femaleNegative} سليم
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <Heart className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">توزيع أنواع ألم الصدر</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(chestPainDist).map(([label, value]) => (
              <ChartBar
                key={label}
                label={label}
                value={value}
                maxValue={maxChestPain}
                color="bg-rose-500"
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">تصنيف التنبؤات</h3>
          </div>
          {predictionStats.total > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-rose-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-rose-500 rounded-full" />
                  <span className="font-medium text-gray-700">خطر عالي</span>
                </div>
                <div className="text-left">
                  <span className="text-2xl font-bold text-rose-600">
                    {predictionStats.highRisk}
                  </span>
                  <span className="text-sm text-gray-500 mr-2">
                    ({((predictionStats.highRisk / predictionStats.total) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-amber-500 rounded-full" />
                  <span className="font-medium text-gray-700">خطر متوسط</span>
                </div>
                <div className="text-left">
                  <span className="text-2xl font-bold text-amber-600">
                    {predictionStats.mediumRisk}
                  </span>
                  <span className="text-sm text-gray-500 mr-2">
                    ({((predictionStats.mediumRisk / predictionStats.total) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full" />
                  <span className="font-medium text-gray-700">خطر منخفض</span>
                </div>
                <div className="text-left">
                  <span className="text-2xl font-bold text-emerald-600">
                    {predictionStats.lowRisk}
                  </span>
                  <span className="text-sm text-gray-500 mr-2">
                    ({((predictionStats.lowRisk / predictionStats.total) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              لم يتم إجراء أي تنبؤات بعد. ابدأ بتحليل مريض.
            </div>
          )}
        </div>
      </div>

      {predictions.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">آخر التنبؤات</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                    التاريخ
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                    المريض
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                    العمر
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                    الجنس
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                    الاحتمالية
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                    النتيجة
                  </th>
                </tr>
              </thead>
              <tbody>
                {predictions.slice(0, 10).map((pred, index) => (
                  <tr
                    key={pred.id}
                    className={`border-b border-gray-100 ${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {new Date(pred.created_at).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {pred.patient_name || 'مجهول'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{pred.age}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {pred.sex === 1 ? 'ذكر' : 'أنثى'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{pred.probability}%</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          pred.probability >= 60
                            ? 'bg-rose-100 text-rose-700'
                            : pred.probability >= 30
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {pred.probability >= 60
                          ? 'خطر عالي'
                          : pred.probability >= 30
                          ? 'خطر متوسط'
                          : 'خطر منخفض'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
