import { Activity, Lock } from 'lucide-react';

export default function Navbar({ view, setView, setStep }) {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer text-indigo-600" onClick={() => { setView('form'); setStep(1); }}>
          <Activity size={24} />
          <span className="font-bold text-lg hidden sm:block">ระบบคัดกรองสุขภาพจิต</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('form')} className={`px-4 py-2 rounded-xl text-sm font-medium ${view === 'form' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
            หน้าแรก
          </button>
          <button onClick={() => setView('admin')} className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border transition-colors ${view === 'admin' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}>
            <Lock size={16} /> <span className="hidden sm:inline">Admin</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
