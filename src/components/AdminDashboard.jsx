import { useState } from 'react';
import { Users, LogOut, Trash2, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { getRQColor, getRQLabel, getDepColor } from '../utils/scoring';

export default function AdminDashboard({ submissions, onLogout, onDelete }) {
  const [showCriteria, setShowCriteria] = useState(false);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><Users size={28} /></div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">ข้อมูลการประเมินทั้งหมด</h2>
            <p className="text-sm text-gray-500">จำนวนทั้งหมด {submissions.length} รายการ</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowCriteria(prev => !prev)} className="px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-xl font-medium flex items-center gap-2 hover:bg-indigo-100">
            <Info size={16} /> เกณฑ์การประเมิน {showCriteria ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button onClick={onLogout} className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl font-medium flex items-center gap-2 hover:bg-red-100">
            <LogOut size={16} /> ออกจากระบบ
          </button>
        </div>
      </div>

      {/* เกณฑ์การประเมิน */}
      {showCriteria && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6 animate-in fade-in duration-200">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Info size={20} className="text-indigo-600" /> เกณฑ์การแปรผลคะแนน</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* RQ */}
            <div className="space-y-4">
              <h4 className="font-bold text-blue-700 border-b border-blue-100 pb-2">พลังสุขภาพจิต (RQ) — คะแนนเต็ม 80</h4>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="pb-2 font-medium">ด้าน</th>
                    <th className="pb-2 font-medium text-center">ต่ำกว่าปกติ</th>
                    <th className="pb-2 font-medium text-center">ปกติ</th>
                    <th className="pb-2 font-medium text-center">สูงกว่าปกติ</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-t border-gray-50">
                    <td className="py-2">อารมณ์ (40)</td>
                    <td className="py-2 text-center"><span className="px-2 py-0.5 rounded bg-orange-50 text-orange-600 text-xs font-medium">&lt; 27</span></td>
                    <td className="py-2 text-center"><span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-xs font-medium">27 – 34</span></td>
                    <td className="py-2 text-center"><span className="px-2 py-0.5 rounded bg-green-50 text-green-600 text-xs font-medium">&gt; 34</span></td>
                  </tr>
                  <tr className="border-t border-gray-50">
                    <td className="py-2">กำลังใจ (20)</td>
                    <td className="py-2 text-center"><span className="px-2 py-0.5 rounded bg-orange-50 text-orange-600 text-xs font-medium">&lt; 14</span></td>
                    <td className="py-2 text-center"><span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-xs font-medium">14 – 19</span></td>
                    <td className="py-2 text-center"><span className="px-2 py-0.5 rounded bg-green-50 text-green-600 text-xs font-medium">&gt; 19</span></td>
                  </tr>
                  <tr className="border-t border-gray-50">
                    <td className="py-2">การจัดการปัญหา (20)</td>
                    <td className="py-2 text-center"><span className="px-2 py-0.5 rounded bg-orange-50 text-orange-600 text-xs font-medium">&lt; 13</span></td>
                    <td className="py-2 text-center"><span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-xs font-medium">13 – 18</span></td>
                    <td className="py-2 text-center"><span className="px-2 py-0.5 rounded bg-green-50 text-green-600 text-xs font-medium">&gt; 18</span></td>
                  </tr>
                  <tr className="border-t border-gray-100 font-bold">
                    <td className="py-2">คะแนนรวม (80)</td>
                    <td className="py-2 text-center"><span className="px-2 py-0.5 rounded bg-orange-50 text-orange-600 text-xs font-bold">&lt; 55</span></td>
                    <td className="py-2 text-center"><span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-xs font-bold">55 – 69</span></td>
                    <td className="py-2 text-center"><span className="px-2 py-0.5 rounded bg-green-50 text-green-600 text-xs font-bold">&gt; 69</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Depression */}
            <div className="space-y-4">
              <h4 className="font-bold text-orange-700 border-b border-orange-100 pb-2">คัดกรองโรคซึมเศร้า (2Q / 9Q)</h4>

              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">แบบคัดกรอง 2Q</p>
                  <p>ถ้าตอบ "มี" อย่างน้อย 1 ข้อ → มีความเสี่ยง → ทำแบบประเมิน 9Q ต่อ</p>
                  <p>ถ้าตอบ "ไม่มี" ทั้ง 2 ข้อ → ปกติ (ไม่ต้องทำ 9Q)</p>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 mb-2">แบบประเมิน 9Q — คะแนนเต็ม 27</p>
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-500">
                        <th className="pb-1 font-medium">คะแนน</th>
                        <th className="pb-1 font-medium">แปรผล</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-50">
                        <td className="py-1.5">0 – 6</td>
                        <td className="py-1.5"><span className="px-2 py-0.5 rounded bg-green-50 text-green-600 text-xs font-medium">ไม่มี หรือน้อยมาก</span></td>
                      </tr>
                      <tr className="border-t border-gray-50">
                        <td className="py-1.5">7 – 12</td>
                        <td className="py-1.5"><span className="px-2 py-0.5 rounded bg-yellow-50 text-yellow-600 text-xs font-medium">ระดับน้อย</span></td>
                      </tr>
                      <tr className="border-t border-gray-50">
                        <td className="py-1.5">13 – 18</td>
                        <td className="py-1.5"><span className="px-2 py-0.5 rounded bg-orange-50 text-orange-600 text-xs font-medium">ระดับปานกลาง</span></td>
                      </tr>
                      <tr className="border-t border-gray-50">
                        <td className="py-1.5">19 – 27</td>
                        <td className="py-1.5"><span className="px-2 py-0.5 rounded bg-red-50 text-red-600 text-xs font-medium">ระดับรุนแรง</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="py-3 px-3 font-medium border-b border-gray-100 whitespace-nowrap">เวลาที่ตอบ</th>
                <th className="py-3 px-3 font-medium border-b border-gray-100 whitespace-nowrap">ชื่อ-สกุล</th>
                <th className="py-3 px-2 font-medium border-b border-gray-100 text-center bg-blue-50/50 whitespace-nowrap">อารมณ์ (40)</th>
                <th className="py-3 px-2 font-medium border-b border-gray-100 text-center bg-blue-50/50 whitespace-nowrap">กำลังใจ (20)</th>
                <th className="py-3 px-2 font-medium border-b border-gray-100 text-center bg-blue-50/50 whitespace-nowrap">แก้ปัญหา (20)</th>
                <th className="py-3 px-2 font-bold border-b border-gray-100 text-center bg-blue-50/50 whitespace-nowrap">คะแนนรวม (80)</th>
                <th className="py-3 px-2 font-medium border-b border-gray-100 text-center bg-orange-50/50 whitespace-nowrap">เสี่ยง (2Q)</th>
                <th className="py-3 px-2 font-bold border-b border-gray-100 text-center bg-orange-50/50 whitespace-nowrap">คะแนน 9Q</th>
                <th className="py-3 px-3 font-medium border-b border-gray-100 text-center bg-orange-50/50 whitespace-nowrap">แปรผล 9Q</th>
                <th className="py-3 px-2 font-medium border-b border-gray-100 text-center whitespace-nowrap">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {submissions.map((sub) => {
                const res = sub.results;
                if (!res) return null;

                const rqTotal = res.rq.scores.total;
                const rqEval = res.rq.evaluations.total;
                const hasRisk = res.depression.took9Q;
                const score9Q = res.depression.score9Q;
                const score9QClass = score9Q >= 7 ? 'text-red-600 font-bold text-base' : 'text-gray-700 font-semibold text-base';

                return (
                  <tr key={sub.id} className="hover:bg-indigo-50/30">
                    <td className="py-2 px-3 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(sub.timestamp).toLocaleString('th-TH')}
                    </td>
                    <td className="py-2 px-3 font-semibold text-gray-900 min-w-[120px]">{sub.name}</td>

                    {/* RQ ย่อยแต่ละด้าน */}
                    {['emotion', 'morale', 'management'].map((cat) => (
                      <td key={cat} className="py-2 px-2 text-center bg-blue-50/10">
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-bold text-gray-800">{res.rq.scores[cat]}</span>
                          <span className={`px-1.5 py-0.5 rounded border text-[10px] leading-tight ${getRQColor(res.rq.evaluations[cat])}`}>
                            {getRQLabel(res.rq.evaluations[cat])}
                          </span>
                        </div>
                      </td>
                    ))}

                    {/* RQ รวม */}
                    <td className="py-2 px-2 text-center bg-blue-50/10">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-bold text-blue-700 text-base">{rqTotal}</span>
                        <span className={`px-2 py-0.5 rounded border text-[11px] font-bold leading-tight ${getRQColor(rqEval)}`}>
                          {getRQLabel(rqEval)}
                        </span>
                      </div>
                    </td>

                    {/* ซึมเศร้า */}
                    <td className="py-2 px-2 text-center bg-orange-50/20">
                      <span className={`px-2 py-1 rounded-md text-[11px] font-medium border whitespace-nowrap ${hasRisk ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-green-50 text-green-600 border-green-200'}`}>
                        {hasRisk ? 'มีความเสี่ยง' : 'ปกติ'}
                      </span>
                    </td>
                    <td className={`py-2 px-2 text-center bg-orange-50/20 ${score9QClass}`}>
                      {score9Q !== null ? score9Q : '-'}
                    </td>
                    <td className="py-2 px-3 text-center bg-orange-50/20 min-w-[140px]">
                      <span className={`inline-block px-2 py-1 rounded-md text-[11px] font-medium border leading-snug break-words ${getDepColor(res.depression.severity)}`}>
                        {res.depression.text}
                      </span>
                    </td>

                    {/* ลบ */}
                    <td className="py-2 px-2 text-center">
                      <button onClick={() => onDelete(sub.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="ลบข้อมูล">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {submissions.length === 0 && (
                <tr><td colSpan="10" className="py-8 text-center text-gray-500">ยังไม่มีข้อมูลการประเมิน</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
