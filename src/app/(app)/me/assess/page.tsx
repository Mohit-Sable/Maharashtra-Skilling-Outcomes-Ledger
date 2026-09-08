'use client';

import React, { useState } from 'react';
import { useMSOLStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight, BrainCircuit, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { SkillAssessment } from '@/lib/types';

const questions = [
  {
    id: 1,
    target: 'Software Engineer',
    en: 'What is the worst-case time complexity of searching an element in a balanced Binary Search Tree (BST)?',
    mr: 'संतुलित बायनरी सर्च ट्री (BST) मध्ये घटक शोधण्यासाठी वेळ जटिलता (Time Complexity) काय आहे?',
    options: [
      { text: 'O(log n)', score: 100 },
      { text: 'O(n)', score: 30 },
      { text: 'O(1)', score: 10 },
      { text: 'O(n log n)', score: 0 }
    ],
    skill: 'Data Structures & Algorithms'
  },
  {
    id: 2,
    target: 'Software Engineer',
    en: 'Which SQL clause is strictly used to filter rows AFTER an aggregate function with GROUP BY?',
    mr: 'GROUP BY सह ॲग्रीगेट फंक्शन नंतर पंक्ती फिल्टर करण्यासाठी कोणता SQL क्लॉज वापरला जातो?',
    options: [
      { text: 'HAVING', score: 100 },
      { text: 'WHERE', score: 20 },
      { text: 'ORDER BY', score: 0 },
      { text: 'FILTER', score: 0 }
    ],
    skill: 'SQL'
  },
  {
    id: 3,
    target: 'Mechanical Engineer',
    en: 'In Geometric Dimensioning & Tolerancing (GD&T), what does the "True Position" tolerance feature symbol control?',
    mr: 'GD&T मध्ये, "ट्रू पोझिशन" टॉलरन्स चिन्ह प्रामुख्याने काय नियंत्रित करते?',
    options: [
      { text: 'Exact location of a feature relative to datum references', score: 100 },
      { text: 'Surface roughness only', score: 20 },
      { text: 'Material tensile strength', score: 0 },
      { text: 'Thermal expansion coefficient', score: 0 }
    ],
    skill: 'GD&T'
  },
  {
    id: 4,
    target: 'Mechanical Engineer',
    en: 'In SolidWorks parametric modeling, which constraint ensures a sketch cannot accidentally change dimensions during assembly?',
    mr: 'SolidWorks पॅरामेट्रिक मॉडेलिंगमध्ये, स्केचचे परिमाण बदलू नयेत यासाठी काय आवश्यक आहे?',
    options: [
      { text: 'Fully Defined sketch with geometric relations & dimensions', score: 100 },
      { text: 'Under Defined sketch left floating', score: 0 },
      { text: 'Suppressed feature state', score: 20 },
      { text: 'Extrude thin feature', score: 0 }
    ],
    skill: 'SolidWorks'
  },
  {
    id: 5,
    target: 'Embedded Engineer',
    en: 'In Embedded C firmware programming, why is the "volatile" keyword applied to a hardware register variable?',
    mr: 'Embedded C प्रोग्रामिंगमध्ये हार्डवेअर रजिस्टरसाठी "volatile" कीवर्ड का वापरला जातो?',
    options: [
      { text: 'To prevent compiler optimizations from caching unexpected external hardware changes', score: 100 },
      { text: 'To allocate the variable in permanent ROM', score: 20 },
      { text: 'To encrypt register values', score: 0 },
      { text: 'To increase CPU clock cycle speed', score: 0 }
    ],
    skill: 'Embedded C'
  },
  {
    id: 6,
    target: 'Embedded Engineer',
    en: 'Which synchronous serial protocol uses two open-drain bidirectional bus lines: SDA (Data) and SCL (Clock)?',
    mr: 'कोणता सिंक्रोनस प्रोटोकॉल दोन लाइन्स (SDA आणि SCL) वापरतो?',
    options: [
      { text: 'I2C (Inter-Integrated Circuit)', score: 100 },
      { text: 'RS-232 Serial Port', score: 20 },
      { text: 'Ethernet RJ45', score: 0 },
      { text: 'CAN bus', score: 40 }
    ],
    skill: 'PLC'
  },
  {
    id: 7,
    target: 'Civil Engineer',
    en: 'In AutoCAD Civil & site quantity surveying, what is the nominal concrete batch mix proportion for M20 grade?',
    mr: 'AutoCAD Civil आणि साइट क्वांटिफायिंगनुसार, M20 ग्रेड काँक्रीटचे प्रमाण काय असते?',
    options: [
      { text: '1 : 1.5 : 3 (Cement : Sand : Coarse Aggregate)', score: 100 },
      { text: '1 : 3 : 6', score: 20 },
      { text: '1 : 2 : 4', score: 50 },
      { text: '1 : 1 : 2', score: 30 }
    ],
    skill: 'AutoCAD Civil'
  },
  {
    id: 8,
    target: 'Engineering General',
    en: 'In industrial manufacturing & plant operations, what does the Lockout/Tagout (LOTO) procedure ensure?',
    mr: 'औद्योगिक उत्पादन व प्लांटमध्ये, Lockout/Tagout (LOTO) प्रक्रिया काय सुनिश्चित करते?',
    options: [
      { text: 'Zero energy state isolation before machinery maintenance', score: 100 },
      { text: 'Overtime attendance recording', score: 0 },
      { text: 'Inventory restocking', score: 0 },
      { text: 'Quality inspection clearance', score: 20 }
    ],
    skill: 'Industrial Safety'
  }
];

export default function AssessPage() {
  const router = useRouter();
  const { currentUser, language, submitAssessment, assessments, skillPassports } = useMSOLStore();
  const traineeId = currentUser?.traineeId || 'MSOL-MH-0001';
  
  const passport = skillPassports.find(p => p.traineeId === traineeId);
  const targetCareer = passport?.careerGoal?.targetOccupation || 'Software Engineer';

  const existingAssessment = assessments.find(a => a.traineeId === traineeId);
  const [step, setStep] = useState(existingAssessment ? 'result' : 'intro');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<{question: string, answer: string, score: number, skill: string}[]>([]);

  const handleStart = () => setStep('quiz');

  const handleAnswer = (option: {text: string, score: number}, q: typeof questions[0]) => {
    const newAnswers = [...answers, { question: q.en, answer: option.text, score: option.score, skill: q.skill }];
    setAnswers(newAnswers);

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Calculate results
      const scores: Record<string, number> = {};
      const weaknesses: string[] = [];
      const strengths: string[] = [];

      newAnswers.forEach(a => {
        scores[a.skill] = a.score;
        if (a.score < 60) weaknesses.push(a.skill);
        else strengths.push(a.skill);
      });

      const newAssessment: SkillAssessment = {
        id: `ASS-${Date.now()}`,
        traineeId,
        takenAt: new Date().toISOString().split('T')[0],
        targetCareer,
        responses: newAnswers.map(a => ({ question: a.question, answer: a.answer, score: a.score })),
        scores,
        strengths,
        weaknesses,
        missingForTarget: weaknesses,
        reportSummary: { 
          en: weaknesses.length > 0 ? `Target readiness assessment complete. Found skill gaps in: ${weaknesses.join(', ')}. Remedial learning recommended.` : 'Strong engineering competency demonstrated across core subjects.',
          mr: weaknesses.length > 0 ? `मूल्यांकन पूर्ण झाले. ${weaknesses.join(', ')} मध्ये कौशल्य अंतर आढळले. उपचारात्मक अभ्यासक्रम सुचवले आहेत.` : 'मुख्य अभियांत्रिकी विषयात उत्तम तयारी दिसून आली.'
        }
      };

      submitAssessment(newAssessment);
      setStep('result');
    }
  };

  const activeAssessment = existingAssessment || assessments.find(a => a.traineeId === traineeId);

  if (step === 'intro') {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-navy-50 rounded-full flex items-center justify-center mx-auto mb-4 text-navy-600">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-navy-900 mb-2">AI Skill Assessment</h1>
          <p className="text-gray-600 mb-8">Take a short quiz to identify your current skill levels and gaps for your target career.</p>
          <button onClick={handleStart} className="btn-primary w-full max-w-sm mx-auto justify-center">
            Start Assessment <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    );
  }

  if (step === 'quiz') {
    const q = questions[currentQIndex];
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <div className="card p-8">
          <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Question {currentQIndex + 1} of {questions.length}</div>
          <h2 className="text-xl font-medium text-navy-900 mb-6">{language === 'mr' ? q.mr : q.en}</h2>
          
          <div className="space-y-3">
            {q.options.map((opt, idx) => (
              <button 
                key={idx}
                onClick={() => handleAnswer(opt, q)}
                className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-navy-500 hover:bg-navy-50 transition-colors"
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-navy-900 mb-6">Assessment Results</h1>
      
      {activeAssessment && (
        <div className="space-y-6">
          <div className="card p-6 bg-navy-900 text-white">
            <h2 className="text-lg font-medium opacity-90">Target Career: {activeAssessment.targetCareer}</h2>
            <p className="mt-2 text-navy-100">{language === 'mr' ? activeAssessment.reportSummary.mr : activeAssessment.reportSummary.en}</p>
            <p className="text-xs text-navy-300 mt-4">Taken on {formatDate(activeAssessment.takenAt)}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6 border-l-4 border-l-red-500">
              <h3 className="font-semibold text-red-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" /> Skill Gaps Identified
              </h3>
              <ul className="space-y-2">
                {activeAssessment.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> {w}
                  </li>
                ))}
                {activeAssessment.weaknesses.length === 0 && <p className="text-sm text-gray-500">No major gaps identified.</p>}
              </ul>
              {activeAssessment.weaknesses.length > 0 && (
                <button 
                  onClick={() => router.push('/me/roadmap')}
                  className="mt-6 w-full py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  View Learning Roadmap &rarr;
                </button>
              )}
            </div>

            <div className="card p-6 border-l-4 border-l-emerald-500">
              <h3 className="font-semibold text-emerald-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Verified Strengths
              </h3>
              <ul className="space-y-2">
                {activeAssessment.strengths.map((s, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
