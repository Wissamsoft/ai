import type { PatientData, PredictionResult, RiskFactor } from '../types';

const FEATURE_WEIGHTS = {
  age: 0.08,
  sex: 0.06,
  cp: 0.15,
  trestbps: 0.07,
  chol: 0.06,
  fbs: 0.04,
  restecg: 0.05,
  thalach: 0.10,
  exang: 0.12,
  oldpeak: 0.11,
  slope: 0.06,
  ca: 0.08,
  thal: 0.02,
};

function normalize(value: number, min: number, max: number): number {
  return (value - min) / (max - min);
}

function calculateRiskScore(data: PatientData): number {
  let score = 0;

  const ageNorm = normalize(data.age, 29, 77);
  score += ageNorm * FEATURE_WEIGHTS.age;

  score += data.sex * FEATURE_WEIGHTS.sex;

  const cpRisk = data.cp === 0 ? 0.8 : data.cp === 1 ? 0.5 : data.cp === 2 ? 0.3 : 0.1;
  score += cpRisk * FEATURE_WEIGHTS.cp;

  const bpNorm = normalize(data.trestbps, 94, 200);
  score += bpNorm * FEATURE_WEIGHTS.trestbps;

  const cholNorm = normalize(data.chol, 126, 564);
  score += cholNorm * FEATURE_WEIGHTS.chol;

  score += data.fbs * FEATURE_WEIGHTS.fbs;

  const ecgRisk = data.restecg === 0 ? 0 : data.restecg === 1 ? 0.5 : 1;
  score += ecgRisk * FEATURE_WEIGHTS.restecg;

  const thalachNorm = 1 - normalize(data.thalach, 71, 202);
  score += thalachNorm * FEATURE_WEIGHTS.thalach;

  score += data.exang * FEATURE_WEIGHTS.exang;

  const oldpeakNorm = normalize(data.oldpeak, 0, 6.2);
  score += oldpeakNorm * FEATURE_WEIGHTS.oldpeak;

  const slopeRisk = data.slope === 0 ? 0.2 : data.slope === 1 ? 0.5 : 0.8;
  score += slopeRisk * FEATURE_WEIGHTS.slope;

  const caNorm = data.ca / 4;
  score += caNorm * FEATURE_WEIGHTS.ca;

  const thalRisk = data.thal === 1 ? 0 : data.thal === 2 ? 0.6 : data.thal === 3 ? 0.8 : 0.3;
  score += thalRisk * FEATURE_WEIGHTS.thal;

  return Math.min(Math.max(score, 0), 1);
}

function analyzeRiskFactors(data: PatientData): RiskFactor[] {
  const factors: RiskFactor[] = [];

  factors.push({
    name: 'العمر',
    value: data.age,
    status: data.age > 55 ? 'danger' : data.age > 45 ? 'warning' : 'normal',
    normalRange: '< 45 سنة',
  });

  factors.push({
    name: 'ضغط الدم',
    value: `${data.trestbps} مم زئبق`,
    status: data.trestbps > 140 ? 'danger' : data.trestbps > 120 ? 'warning' : 'normal',
    normalRange: '< 120 مم زئبق',
  });

  factors.push({
    name: 'الكوليسترول',
    value: `${data.chol} مجم/دل`,
    status: data.chol > 240 ? 'danger' : data.chol > 200 ? 'warning' : 'normal',
    normalRange: '< 200 مجم/دل',
  });

  factors.push({
    name: 'معدل ضربات القلب',
    value: `${data.thalach} نبضة/د`,
    status: data.thalach < 100 ? 'danger' : data.thalach < 120 ? 'warning' : 'normal',
    normalRange: '> 120 نبضة/د',
  });

  factors.push({
    name: 'انخفاض ST',
    value: data.oldpeak,
    status: data.oldpeak > 2 ? 'danger' : data.oldpeak > 1 ? 'warning' : 'normal',
    normalRange: '< 1',
  });

  factors.push({
    name: 'ذبحة التمرين',
    value: data.exang === 1 ? 'نعم' : 'لا',
    status: data.exang === 1 ? 'danger' : 'normal',
    normalRange: 'لا',
  });

  factors.push({
    name: 'الأوعية الرئيسية',
    value: data.ca,
    status: data.ca > 2 ? 'danger' : data.ca > 0 ? 'warning' : 'normal',
    normalRange: '0',
  });

  factors.push({
    name: 'سكر الدم الصيامي',
    value: data.fbs === 1 ? '> 120 مجم/دل' : '< 120 مجم/دل',
    status: data.fbs === 1 ? 'warning' : 'normal',
    normalRange: '< 120 مجم/دل',
  });

  return factors;
}

export function predictHeartDisease(data: PatientData): PredictionResult {
  const riskScore = calculateRiskScore(data);
  const probability = Math.round(riskScore * 100);
  const prediction = probability >= 50 ? 1 : 0;

  let riskLevel: 'low' | 'medium' | 'high';
  if (probability < 30) {
    riskLevel = 'low';
  } else if (probability < 60) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'high';
  }

  const factors = analyzeRiskFactors(data);

  return {
    prediction,
    probability,
    riskLevel,
    factors,
  };
}
