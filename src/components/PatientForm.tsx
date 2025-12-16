import { useState } from 'react';
import { User, Heart, Activity, Droplets, Zap } from 'lucide-react';
import type { PatientData } from '../types';
import { CHEST_PAIN_TYPES, ECG_RESULTS, SLOPE_TYPES, THAL_TYPES } from '../types';

interface PatientFormProps {
  onSubmit: (data: PatientData, patientName: string) => void;
  isLoading: boolean;
}

export function PatientForm({ onSubmit, isLoading }: PatientFormProps) {
  const [patientName, setPatientName] = useState('');
  const [formData, setFormData] = useState<PatientData>({
    age: 50,
    sex: 1,
    cp: 0,
    trestbps: 120,
    chol: 200,
    fbs: 0,
    restecg: 0,
    thalach: 150,
    exang: 0,
    oldpeak: 0,
    slope: 1,
    ca: 0,
    thal: 1,
  });

  const handleChange = (field: keyof PatientData, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, patientName);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-teal-100 rounded-xl">
          <User className="w-6 h-6 text-teal-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">بيانات المريض</h2>
          <p className="text-gray-500">أدخل البيانات الطبية للتشخيص</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم المريض (اختياري)
            </label>
            <input
              type="text"
              value={patientName}
              onChange={e => setPatientName(e.target.value)}
              placeholder="أدخل اسم المريض"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              العمر (سنة)
            </label>
            <input
              type="number"
              min={1}
              max={120}
              value={formData.age}
              onChange={e => handleChange('age', Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الجنس</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleChange('sex', 1)}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                  formData.sex === 1
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                ذكر
              </button>
              <button
                type="button"
                onClick={() => handleChange('sex', 0)}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                  formData.sex === 0
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                أنثى
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع ألم الصدر
            </label>
            <select
              value={formData.cp}
              onChange={e => handleChange('cp', Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            >
              {CHEST_PAIN_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-rose-500" />
            <h3 className="font-semibold text-gray-800">مؤشرات القلب والأوعية الدموية</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ضغط الدم الانقباضي (مم زئبق)
              </label>
              <input
                type="number"
                min={80}
                max={220}
                value={formData.trestbps}
                onChange={e => handleChange('trestbps', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الكوليسترول (مجم/دل)
              </label>
              <input
                type="number"
                min={100}
                max={600}
                value={formData.chol}
                onChange={e => handleChange('chol', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                أقصى معدل لضربات القلب
              </label>
              <input
                type="number"
                min={60}
                max={220}
                value={formData.thalach}
                onChange={e => handleChange('thalach', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Droplets className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-800">تحاليل الدم</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                سكر الدم الصيامي &gt; 120 مجم/دل
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleChange('fbs', 1)}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                    formData.fbs === 1
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  نعم
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('fbs', 0)}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                    formData.fbs === 0
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  لا
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نتائج تخطيط القلب الكهربائي
              </label>
              <select
                value={formData.restecg}
                onChange={e => handleChange('restecg', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              >
                {ECG_RESULTS.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-800">نتائج اختبار الجهد</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الذبحة الصدرية أثناء التمرين
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleChange('exang', 1)}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                    formData.exang === 1
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  نعم
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('exang', 0)}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                    formData.exang === 0
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  لا
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                انخفاض مقطع ST
              </label>
              <input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={formData.oldpeak}
                onChange={e => handleChange('oldpeak', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ميل مقطع ST
              </label>
              <select
                value={formData.slope}
                onChange={e => handleChange('slope', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              >
                {SLOPE_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-gray-800">فحوصات إضافية</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عدد الأوعية الرئيسية (0-4)
              </label>
              <input
                type="number"
                min={0}
                max={4}
                value={formData.ca}
                onChange={e => handleChange('ca', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الثلاسيميا
              </label>
              <select
                value={formData.thal}
                onChange={e => handleChange('thal', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              >
                {THAL_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'جاري التحليل...' : 'تحليل خطر أمراض القلب'}
        </button>
      </div>
    </form>
  );
}
