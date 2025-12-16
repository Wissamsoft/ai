import { useState } from 'react';
import { Header } from './components/Header';
import { PatientForm } from './components/PatientForm';
import { ResultsCard } from './components/ResultsCard';
import { DatasetExplorer } from './components/DatasetExplorer';
import { Analytics } from './components/Analytics';
import { predictHeartDisease } from './lib/predictionModel';
import { supabase } from './lib/supabase';
import type { PatientData, PredictionResult } from './types';

type TabType = 'diagnosis' | 'dataset' | 'analytics';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('diagnosis');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [patientName, setPatientName] = useState('');

  const handleSubmit = async (data: PatientData, name: string) => {
    setIsLoading(true);
    setPatientName(name);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const predictionResult = predictHeartDisease(data);
    setResult(predictionResult);

    await supabase.from('predictions').insert({
      patient_name: name,
      ...data,
      prediction_result: predictionResult.prediction,
      probability: predictionResult.probability,
    });

    setIsLoading(false);
  };

  const handleNewPrediction = () => {
    setResult(null);
    setPatientName('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'diagnosis' && (
          <div className="max-w-4xl mx-auto">
            {!result ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    تشخيص أمراض القلب
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    أدخل بيانات المريض الطبية للتنبؤ بخطر الإصابة بأمراض القلب باستخدام
                    نظام التشخيص بالذكاء الاصطناعي المبني على بيانات UCI Heart Disease.
                  </p>
                </div>
                <PatientForm onSubmit={handleSubmit} isLoading={isLoading} />
              </>
            ) : (
              <ResultsCard
                result={result}
                patientName={patientName}
                onNewPrediction={handleNewPrediction}
              />
            )}
          </div>
        )}

        {activeTab === 'dataset' && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">استعراض البيانات</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                استعرض بيانات UCI Heart Disease المستخدمة في تدريب نموذج التنبؤ.
              </p>
            </div>
            <DatasetExplorer />
          </>
        )}

        {activeTab === 'analytics' && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">لوحة الإحصائيات</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                عرض إحصائيات شاملة وتحليلات من البيانات وسجل التنبؤات.
              </p>
            </div>
            <Analytics />
          </>
        )}
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>نظام تشخيص أمراض القلب بالذكاء الاصطناعي</p>
            <p className="mt-1">
              البيانات: UCI Heart Disease Dataset | للأغراض التعليمية فقط
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
