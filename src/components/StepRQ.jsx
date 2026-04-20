import { AlertCircle, ArrowRight } from 'lucide-react';
import { QUESTIONS_RQ, OPTIONS_RQ } from '../data/questions';

export default function StepRQ({ respondentName, setRespondentName, nameError, setNameError, answersRQ, errors, onSelect, onNext }) {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className={`bg-white p-6 rounded-2xl shadow-sm border ${nameError ? 'border-red-400' : 'border-gray-100'}`}>
        <label className="block text-gray-900 font-bold mb-3 text-lg">
          ชื่อ-สกุล <span className="text-red-500">*</span>
        </label>
        <input type="text" value={respondentName} onChange={(e) => { setRespondentName(e.target.value); setNameError(''); }}
          placeholder="กรุณาระบุชื่อ-สกุลของคุณ..."
          className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg" />
        {nameError && <p className="text-red-500 text-sm mt-3 flex items-center gap-1"><AlertCircle size={14} /> {nameError}</p>}
      </div>

      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
        <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-md shrink-0">ส่วนที่ 1</span>
        <div className="mt-0.5">
          <p className="font-bold text-indigo-900">แบบประเมินพลังสุขภาพจิต (RQ)</p>
          <p className="text-sm text-indigo-800">เลือกคำตอบที่ตรงกับความเป็นจริงมากที่สุด ในช่วง 3 เดือนที่ผ่านมา</p>
        </div>
      </div>

      <div className="space-y-4">
        {QUESTIONS_RQ.map(q => (
          <div key={q.id} id={`question-rq-${q.id}`} className={`bg-white p-6 rounded-2xl shadow-sm border transition-colors ${errors.includes(`rq-${q.id}`) ? 'border-red-400 bg-red-50/30 ring-1 ring-red-400' : 'border-gray-100 hover:border-indigo-100'}`}>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
              <span className="text-indigo-600 font-bold mr-2">{q.id}.</span>{q.text}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {OPTIONS_RQ.map(opt => (
                <button key={opt.value} onClick={() => onSelect(q.id, opt.value)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border text-center ${answersRQ[q.id] === opt.value ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-gray-200 text-gray-700 hover:bg-indigo-50'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-4 z-10 p-4 bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg flex justify-between items-center">
        <div className="text-sm text-gray-500 font-medium">
          ตอบแล้ว <span className="text-indigo-600 font-bold text-lg">{Object.keys(answersRQ).length}</span>/20
        </div>
        <button onClick={onNext} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm transition-all">
          ถัดไป <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
