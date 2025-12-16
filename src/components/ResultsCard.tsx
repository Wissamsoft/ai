import { Heart, AlertTriangle, CheckCircle, XCircle, TrendingUp, Printer } from 'lucide-react';
import type { PredictionResult } from '../types';

interface ResultsCardProps {
  result: PredictionResult;
  patientName: string;
  onNewPrediction: () => void;
}

const RISK_LABELS = {
  low: 'منخفض',
  medium: 'متوسط',
  high: 'مرتفع',
};

export function ResultsCard({ result, patientName, onNewPrediction }: ResultsCardProps) {
  const { probability, riskLevel, factors } = result;

  const riskColors = {
    low: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      gradient: 'from-emerald-500 to-green-500',
      icon: CheckCircle,
    },
    medium: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      gradient: 'from-amber-500 to-orange-500',
      icon: AlertTriangle,
    },
    high: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      gradient: 'from-rose-500 to-red-500',
      icon: XCircle,
    },
  };

  const colors = riskColors[riskLevel];
  const RiskIcon = colors.icon;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className={`bg-gradient-to-l ${colors.gradient} p-8 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Heart className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">نتائج التشخيص</h2>
              {patientName && <p className="text-white/80">المريض: {patientName}</p>}
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
          >
            <Printer className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="p-8">
        <div className={`${colors.bg} ${colors.border} border-2 rounded-2xl p-6 mb-8`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <RiskIcon className={`w-12 h-12 ${colors.text}`} />
              <div>
                <p className="text-gray-600 text-sm font-medium">مستوى الخطر</p>
                <p className={`text-3xl font-bold ${colors.text}`}>{RISK_LABELS[riskLevel]}</p>
              </div>
            </div>
            <div className="text-left">
              <p className="text-gray-600 text-sm font-medium">نسبة الاحتمالية</p>
              <p className={`text-4xl font-bold ${colors.text}`}>{probability}%</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">احتمالية الخطر</h3>
          </div>
          <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`absolute top-0 right-0 h-full bg-gradient-to-l ${colors.gradient} transition-all duration-1000 ease-out rounded-full`}
              style={{ width: `${probability}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-700">{probability}%</span>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>خطر منخفض</span>
            <span>خطر متوسط</span>
            <span>خطر مرتفع</span>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">تحليل عوامل الخطر</h3>
          <div className="grid gap-3">
            {factors.map((factor, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  factor.status === 'danger'
                    ? 'bg-rose-50 border-rose-200'
                    : factor.status === 'warning'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      factor.status === 'danger'
                        ? 'bg-rose-500'
                        : factor.status === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <span className="font-medium text-gray-700">{factor.name}</span>
                </div>
                <div className="text-left">
                  <p
                    className={`font-semibold ${
                      factor.status === 'danger'
                        ? 'text-rose-700'
                        : factor.status === 'warning'
                        ? 'text-amber-700'
                        : 'text-emerald-700'
                    }`}
                  >
                    {factor.value}
                  </p>
                  <p className="text-xs text-gray-500">الطبيعي: {factor.normalRange}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`p-6 rounded-xl ${
            riskLevel === 'high'
              ? 'bg-rose-50 border border-rose-200'
              : riskLevel === 'medium'
              ? 'bg-amber-50 border border-amber-200'
              : 'bg-emerald-50 border border-emerald-200'
          }`}
        >
          <h4 className="font-semibold text-gray-800 mb-2">التوصية</h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            {riskLevel === 'high'
              ? 'بناءً على التحليل، هناك خطر كبير للإصابة بأمراض القلب. ننصح بشدة بمراجعة طبيب القلب فوراً لإجراء تقييم شامل ووضع خطة علاجية.'
              : riskLevel === 'medium'
              ? 'يشير التحليل إلى وجود عوامل خطر متوسطة لأمراض القلب. ننصح بحجز موعد مع طبيبك لمزيد من التقييم وتعديل نمط الحياة.'
              : 'يُظهر التحليل خطراً منخفضاً للإصابة بأمراض القلب. استمر في الحفاظ على نمط حياة صحي مع ممارسة الرياضة والتغذية المتوازنة والفحوصات الدورية.'}
          </p>
        </div>

        <button
          onClick={onNewPrediction}
          className="w-full mt-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
        >
          تشخيص جديد
        </button>
      </div>
    </div>
  );
}
