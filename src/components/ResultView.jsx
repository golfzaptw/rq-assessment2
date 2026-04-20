import { CheckCircle2, AlertCircle, RotateCcw, HeartPulse, Brain, ShieldCheck, FileWarning } from 'lucide-react';
import { getRQColor, getRQLabel, getDepColor } from '../utils/scoring';

export default function ResultView({ results, respondentName, onReset }) {
  return (
    <div className="space-y-6 animate-in zoom-in-95 duration-300">
      {/* Status Box */}
      <div className={`p-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold border ${results.isSaveSuccess ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
        {results.isSaveSuccess ? <><CheckCircle2 size={18} /> บันทึกข้อมูลลงระบบเรียบร้อยแล้ว</> : <><AlertCircle size={18} /> ไม่สามารถบันทึกข้อมูลลงระบบได้</>}
      </div>

      {/* Overall Summary */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">สรุปผลการประเมิน</h2>
        <p className="text-gray-500 font-medium mb-8">คุณ: {respondentName}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* RQ Result Card */}
          <div className="bg-blue-50/40 p-6 rounded-2xl border border-blue-100 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><HeartPulse size={20} /></div>
              <h3 className="font-bold text-gray-900 text-lg">พลังสุขภาพจิต (RQ)</h3>
            </div>

            <div className="mb-4 text-center">
              <div className="text-4xl font-extrabold text-blue-600 mb-2">{results.rq.scores.total}</div>
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border font-bold text-sm bg-white ${getRQColor(results.rq.evaluations.total)}`}>
                {getRQLabel(results.rq.evaluations.total)}
              </div>
            </div>

            <div className="space-y-2 mt-4 text-sm text-gray-600">
              <div className="flex justify-between border-b pb-1">
                <span>อารมณ์:</span>
                <span className="font-semibold text-gray-800">{results.rq.scores.emotion} ({getRQLabel(results.rq.evaluations.emotion)})</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span>กำลังใจ:</span>
                <span className="font-semibold text-gray-800">{results.rq.scores.morale} ({getRQLabel(results.rq.evaluations.morale)})</span>
              </div>
              <div className="flex justify-between">
                <span>การจัดการปัญหา:</span>
                <span className="font-semibold text-gray-800">{results.rq.scores.management} ({getRQLabel(results.rq.evaluations.management)})</span>
              </div>
            </div>
          </div>

          {/* Depression Result Card */}
          <div className={`${results.depression.severity === 'normal' ? 'bg-green-50/40 border-green-100' : 'bg-orange-50/40 border-orange-100'} p-6 rounded-2xl border flex flex-col h-full`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${results.depression.severity === 'normal' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                <Brain size={20} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">ภาวะซึมเศร้า</h3>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center text-center py-4">
              {results.depression.severity === 'normal' ? (
                <ShieldCheck size={48} className="text-green-500 mb-3" />
              ) : (
                <FileWarning size={48} className="text-orange-500 mb-3" />
              )}
              <div className={`text-lg font-bold px-4 py-2 rounded-xl bg-white border ${getDepColor(results.depression.severity)}`}>
                {results.depression.text}
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              * ผลลัพธ์นี้เป็นเพียงการคัดกรองเบื้องต้น หากมีความกังวลใจ แนะนำให้ปรึกษาผู้เชี่ยวชาญด้านสุขภาพจิตเพิ่มเติม
            </p>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <button onClick={onReset} className="inline-flex items-center gap-2 px-8 py-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-bold shadow-sm transition-all">
          <RotateCcw size={18} /> กลับไปหน้าแรก
        </button>
      </div>
    </div>
  );
}
