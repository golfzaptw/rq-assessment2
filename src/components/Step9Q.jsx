import { RefreshCw } from 'lucide-react';
import { QUESTIONS_9Q, OPTIONS_9Q } from '../data/questions';

export default function Step9Q({ answers9Q, errors, isSaving, onSelect, onNext, onBack }) {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-start gap-3">
        <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md shrink-0">ส่วนที่ 3</span>
        <div className="mt-0.5">
          <p className="font-bold text-orange-900">แบบประเมินโรคซึมเศร้า (9Q)</p>
          <p className="text-sm text-orange-800">เนื่องจากท่านมีความเสี่ยงเบื้องต้น โปรดทำแบบประเมินต่อ (9 ข้อ)</p>
        </div>
      </div>

      {QUESTIONS_9Q.map(q => (
        <div key={q.id} id={`question-9q-${q.id}`} className={`bg-white p-6 rounded-2xl shadow-sm border ${errors.includes(`9q-${q.id}`) ? 'border-red-400 bg-red-50/30' : 'border-gray-100'}`}>
          <h3 className="text-base font-medium text-gray-900 mb-4">{q.id}. {q.text}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {OPTIONS_9Q.map(opt => (
              <button key={opt.value} onClick={() => onSelect(q.id, opt.value)}
                className={`py-2 px-3 rounded-lg text-sm font-medium border text-center transition-all ${answers9Q[q.id] === opt.value ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:bg-indigo-50'}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="flex gap-4 sticky bottom-4 z-10 p-4 bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg">
        <button onClick={onBack} className="w-1/3 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50">กลับ</button>
        <button onClick={onNext} disabled={isSaving} className={`w-2/3 flex justify-center items-center gap-2 py-3 text-white rounded-xl font-bold shadow-sm ${isSaving ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
          {isSaving ? <><RefreshCw size={18} className="animate-spin" /> กำลังประมวลผล</> : 'ส่งแบบประเมิน'}
        </button>
      </div>
    </div>
  );
}
