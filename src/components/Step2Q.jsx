import { ArrowRight } from 'lucide-react';
import { QUESTIONS_2Q, OPTIONS_2Q } from '../data/questions';

export default function Step2Q({ answers2Q, errors, onSelect, onNext, onBack }) {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md shrink-0">ส่วนที่ 2</span>
        <div className="mt-0.5">
          <p className="font-bold text-blue-900">แบบคัดกรองโรคซึมเศร้าเบื้องต้น (2Q)</p>
          <p className="text-sm text-blue-800">โปรดตอบคำถามตามความรู้สึกที่เกิดขึ้นในช่วง 2 สัปดาห์ที่ผ่านมา</p>
        </div>
      </div>

      {QUESTIONS_2Q.map(q => (
        <div key={q.id} className={`bg-white p-6 rounded-2xl shadow-sm border ${errors.includes(`2q-${q.id}`) ? 'border-red-400 bg-red-50/30' : 'border-gray-100'}`}>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">{q.id}. {q.text}</h3>
          <div className="grid grid-cols-2 gap-3">
            {OPTIONS_2Q.map(opt => (
              <button key={opt.value} onClick={() => onSelect(q.id, opt.value)}
                className={`py-3 sm:py-4 rounded-xl text-sm sm:text-base font-bold border text-center transition-all ${answers2Q[q.id] === opt.value ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:bg-indigo-50'}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="flex gap-4 sticky bottom-4 z-10 p-4 bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg">
        <button onClick={onBack} className="w-1/3 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50">กลับ</button>
        <button onClick={onNext} className="w-2/3 flex justify-center items-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm">
          ถัดไป <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
