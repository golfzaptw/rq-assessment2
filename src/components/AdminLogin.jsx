import { Lock, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminLogin({ adminEmail, setAdminEmail, adminPassword, setAdminPassword, adminLoginError, isLoggingIn, onSubmit }) {
  return (
    <div className="max-w-md mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">ผู้ดูแลระบบ</h2>
        </div>
        <form onSubmit={onSubmit} className="space-y-5">
          {adminLoginError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2 border border-red-100">
              <AlertCircle size={16} /> {adminLoginError}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">อีเมลผู้ดูแลระบบ</label>
            <input type="email" required value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
            <input type="password" required value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <button type="submit" disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
            {isLoggingIn ? <RefreshCw size={20} className="animate-spin" /> : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  );
}
