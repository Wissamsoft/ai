export interface PatientData {
  age: number;
  sex: number;
  cp: number;
  trestbps: number;
  chol: number;
  fbs: number;
  restecg: number;
  thalach: number;
  exang: number;
  oldpeak: number;
  slope: number;
  ca: number;
  thal: number;
}

export interface HeartDiseaseRecord extends PatientData {
  id: string;
  target: number;
  created_at: string;
}

export interface PredictionRecord extends PatientData {
  id: string;
  patient_name: string;
  prediction_result: number;
  probability: number;
  created_at: string;
}

export interface PredictionResult {
  prediction: number;
  probability: number;
  riskLevel: 'low' | 'medium' | 'high';
  factors: RiskFactor[];
}

export interface RiskFactor {
  name: string;
  value: number | string;
  status: 'normal' | 'warning' | 'danger';
  normalRange: string;
}

export const CHEST_PAIN_TYPES = [
  { value: 0, label: 'ذبحة صدرية نموذجية' },
  { value: 1, label: 'ذبحة صدرية غير نموذجية' },
  { value: 2, label: 'ألم غير ذبحي' },
  { value: 3, label: 'بدون أعراض' },
];

export const ECG_RESULTS = [
  { value: 0, label: 'طبيعي' },
  { value: 1, label: 'خلل في موجة ST-T' },
  { value: 2, label: 'تضخم البطين الأيسر' },
];

export const SLOPE_TYPES = [
  { value: 0, label: 'صاعد' },
  { value: 1, label: 'مستوي' },
  { value: 2, label: 'هابط' },
];

export const THAL_TYPES = [
  { value: 0, label: 'غير معروف' },
  { value: 1, label: 'طبيعي' },
  { value: 2, label: 'عيب ثابت' },
  { value: 3, label: 'عيب قابل للعكس' },
];
