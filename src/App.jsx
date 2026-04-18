import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, ArrowRight, RotateCcw, HeartPulse, Brain, Target, ShieldCheck, Users, Activity, RefreshCw, Lock, LogOut, Trash2, FileWarning } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, doc, deleteDoc } from 'firebase/firestore';

// ==========================================
// 1. FIREBASE CONFIG
// ==========================================
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

let app, auth, db;
try {
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (e) {
  console.error("Firebase init error", e);
}

// ==========================================
// 2. ข้อมูลชุดคำถาม
// ==========================================
// --- RQ 20 ข้อ ---
const QUESTIONS_RQ = [
  { id: 1, text: 'เรื่องไม่สบายใจเล็กน้อยทำให้ฉันว้าวุ่นใจนั่งไม่ติด', category: 'emotion', reverse: true },
  { id: 2, text: 'ฉันไม่ใส่ใจคนที่หัวเราะเยาะฉัน', category: 'emotion', reverse: false },
  { id: 3, text: 'เมื่อฉันทำผิดพลาดหรือเสียหายฉันยอมรับผิดหรือผลที่ตามมา', category: 'emotion', reverse: false },
  { id: 4, text: 'ฉันเคยยอมทนลำบากเพื่ออนาคตที่ดีขึ้น', category: 'emotion', reverse: false },
  { id: 5, text: 'เวลาทุกข์ใจมาก ๆ ฉันเจ็บป่วยไม่สบาย', category: 'emotion', reverse: true },
  { id: 6, text: 'ฉันสอนและเตือนตัวเอง', category: 'emotion', reverse: false },
  { id: 7, text: 'ความยากลำบากทำให้ฉันแกร่งขึ้น', category: 'emotion', reverse: false },
  { id: 8, text: 'ฉันไม่จดจำเรื่องเลวร้ายในอดีต', category: 'emotion', reverse: false },
  { id: 9, text: 'ถึงแม้ปัญหาจะหนักหนาเพียงใดชีวิตฉันก็ไม่เลวร้ายไปหมด', category: 'emotion', reverse: false },
  { id: 10, text: 'เมื่อมีเรื่องหนักใจ ฉันมีคนปรับทุกข์ด้วย', category: 'emotion', reverse: false },
  { id: 11, text: 'จากประสบการณ์ที่ผ่านมาทำให้ฉันมั่นใจว่าจะแก้ปัญหาต่าง ๆ ที่ผ่านเข้ามาในชีวิตได้', category: 'morale', reverse: false },
  { id: 12, text: 'ฉันมีครอบครัวและคนใกล้ชิดเป็นกำลังใจ', category: 'morale', reverse: false },
  { id: 13, text: 'ฉันมีแผนการที่จะทำให้ชีวิตก้าวไปข้างหน้า', category: 'morale', reverse: false },
  { id: 14, text: 'เมื่อมีปัญหาวิกฤตเกิดขึ้น ฉันรู้สึกว่าตัวเองไร้ความสามารถ', category: 'morale', reverse: true },
  { id: 15, text: 'เป็นเรื่องยากสำหรับฉันที่จะทำให้ชีวิตดีขึ้น', category: 'morale', reverse: true },
  { id: 16, text: 'ฉันอยากหนีไปให้พ้น หากมีปัญหาหนักหนาต้องรับผิดชอบ', category: 'management', reverse: true },
  { id: 17, text: 'การแก้ไขปัญหาทำให้ฉันมีประสบการณ์มากขึ้น', category: 'management', reverse: false },
  { id: 18, text: 'ในการพูดคุย ฉันหาเหตุผลที่ทุกคนยอมรับหรือเห็นด้วยกับฉันได้', category: 'management', reverse: false },
  { id: 19, text: 'ฉันเตรียมหาทางออกไว้ หากปัญหาร้ายแรงกว่าที่คิด', category: 'management', reverse: false },
  { id: 20, text: 'ฉันชอบฟังความคิดเห็นที่แตกต่างจากฉัน', category: 'management', reverse: false },
];
const OPTIONS_RQ = [
  { value: 1, label: 'ไม่จริง' }, { value: 2, label: 'จริงบางครั้ง' },
  { value: 3, label: 'ค่อนข้างจริง' }, { value: 4, label: 'จริงมาก' },
];

// --- 2Q ---
const QUESTIONS_2Q = [
  { id: 1, text: 'ใน 2 สัปดาห์ที่ผ่านมา รวมวันนี้ ท่านรู้สึก หดหู่ เศร้า หรือท้อแท้สิ้นหวัง หรือไม่' },
  { id: 2, text: 'ใน 2 สัปดาห์ที่ผ่านมา รวมวันนี้ท่านรู้สึก เบื่อ ทำอะไรก็ไม่เพลิดเพลิน หรือไม่' }
];
const OPTIONS_2Q = [
  { value: 0, label: 'ไม่มี' }, { value: 1, label: 'มี' }
];

// --- 9Q ---
const QUESTIONS_9Q = [
  { id: 1, text: 'เบื่อ ไม่สนใจอยากทำอะไร' },
  { id: 2, text: 'ไม่สบายใจ ซึมเศร้า ท้อแท้' },
  { id: 3, text: 'หลับยากหรือหลับๆตื่นๆหรือหลับมากไป' },
  { id: 4, text: 'เหนื่อยง่ายหรือไม่ค่อยมีแรง' },
  { id: 5, text: 'เบื่ออาหารหรือกินมากเกินไป' },
  { id: 6, text: 'รู้สึกไม่ดีกับตัวเอง คิดว่าตัวเองล้มเหลวหรือครอบครัวผิดหวัง' },
  { id: 7, text: 'สมาธิไม่ดี เวลาทำอะไร เช่น ดูโทรทัศน์ ฟังวิทยุ หรือทำงานที่ต้องใช้ความตั้งใจ' },
  { id: 8, text: 'พูดช้า ทำอะไรช้าลงจนคนอื่นสังเกตเห็นได้ หรือกระสับกระส่ายไม่สามารถอยู่นิ่งได้เหมือนที่เคยเป็น' },
  { id: 9, text: 'คิดทำร้ายตนเอง หรือคิดว่าถ้าตายไปคงจะดี' }
];
const OPTIONS_9Q = [
  { value: 0, label: 'ไม่มีเลย' }, { value: 1, label: 'เป็นบางวัน (1-7 วัน)' },
  { value: 2, label: 'เป็นบ่อย (> 7 วัน)' }, { value: 3, label: 'เป็นทุกวัน' }
];

export default function App() {
  const [view, setView] = useState('form'); 
  const [step, setStep] = useState(1); // 1: RQ, 2: 2Q, 3: 9Q, 4: Result

  // ฟอร์ม State
  const [respondentName, setRespondentName] = useState('');
  const [nameError, setNameError] = useState('');
  const [answersRQ, setAnswersRQ] = useState({});
  const [answers2Q, setAnswers2Q] = useState({});
  const [answers9Q, setAnswers9Q] = useState({});
  const [errors, setErrors] = useState([]);
  const [results, setResults] = useState(null);
  
  // ระบบหลังบ้าน State
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [fetchErrorMsg, setFetchErrorMsg] = useState('');

  // Login State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // 1. จัดการ Login/Anonymous
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        try { await signInAnonymously(auth); } catch (e) { console.error("Auth error:", e); }
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. ดึงข้อมูล Admin
  useEffect(() => {
    if (!user || !user.email || view !== 'admin' || !db) return;
    
    // ใช้ Collection ใหม่เพื่อป้องกันพังเวลาเจอข้อมูลเก่าของ RQ เดิม
    const q = collection(db, 'assessment_full_submissions');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      docs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); 
      setSubmissions(docs);
      setFetchErrorMsg('');
    }, (error) => {
      console.error("Error fetching admin data:", error);
      setFetchErrorMsg("ไม่สามารถดึงข้อมูลได้ กรุณาตรวจสอบสิทธิ์ Firebase");
    });
    
    return () => unsubscribe();
  }, [user, view]);

  // ==========================================
  // Handlers การตอบคำถาม
  // ==========================================
  const handleSelectRQ = (qId, value) => {
    setAnswersRQ(prev => ({ ...prev, [qId]: value }));
    setErrors(prev => prev.filter(id => id !== `rq-${qId}`));
  };
  const handleSelect2Q = (qId, value) => {
    setAnswers2Q(prev => ({ ...prev, [qId]: value }));
    setErrors(prev => prev.filter(id => id !== `2q-${qId}`));
  };
  const handleSelect9Q = (qId, value) => {
    setAnswers9Q(prev => ({ ...prev, [qId]: value }));
    setErrors(prev => prev.filter(id => id !== `9q-${qId}`));
  };

  // ==========================================
  // Navigation Steps
  // ==========================================
  const handleNextRQ = () => {
    if (!respondentName.trim()) {
      setNameError('กรุณาระบุชื่อ-สกุล ก่อนดำเนินการต่อ');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setNameError('');

    const unanswered = QUESTIONS_RQ.filter(q => !answersRQ[q.id]).map(q => `rq-${q.id}`);
    if (unanswered.length > 0) {
      setErrors(unanswered);
      const firstUnanswered = document.getElementById(`question-rq-${unanswered[0].split('-')[1]}`);
      if (firstUnanswered) firstUnanswered.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext2Q = () => {
    const unanswered = QUESTIONS_2Q.filter(q => answers2Q[q.id] === undefined).map(q => `2q-${q.id}`);
    if (unanswered.length > 0) {
      setErrors(unanswered);
      return;
    }

    // ถ้ามีข้อใดข้อหนึ่งตอบว่า "มี" (ค่าเป็น 1) แสดงว่ามีความเสี่ยง
    const hasRisk = answers2Q[1] === 1 || answers2Q[2] === 1;

    if (!hasRisk) {
      // ข้าม 9Q ไปบันทึกผล
      submitFinalData(false);
    } else {
      // ไปทำ 9Q
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext9Q = () => {
    const unanswered = QUESTIONS_9Q.filter(q => answers9Q[q.id] === undefined).map(q => `9q-${q.id}`);
    if (unanswered.length > 0) {
      setErrors(unanswered);
      const firstUnanswered = document.getElementById(`question-9q-${unanswered[0].split('-')[1]}`);
      if (firstUnanswered) firstUnanswered.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    submitFinalData(true);
  };

  // ==========================================
  // คำนวณผลและบันทึก
  // ==========================================
  const evaluateDepression = (score) => {
    if (score < 7) return { text: 'ไม่มีอาการของโรคซึมเศร้า หรือมีอาการระดับน้อยมาก', severity: 'normal' };
    if (score <= 12) return { text: 'มีอาการของโรคซึมเศร้า ระดับน้อย', severity: 'mild' };
    if (score <= 18) return { text: 'มีอาการของโรคซึมเศร้า ระดับปานกลาง', severity: 'moderate' };
    return { text: 'มีอาการของโรคซึมเศร้า ระดับรุนแรง', severity: 'severe' };
  };

  const submitFinalData = async (took9Q) => {
    // 1. คำนวณ RQ
    let rqScores = { emotion: 0, morale: 0, management: 0, total: 0 };
    QUESTIONS_RQ.forEach(q => {
      const rawValue = answersRQ[q.id];
      const finalValue = q.reverse ? (5 - rawValue) : rawValue; 
      rqScores[q.category] += finalValue;
      rqScores.total += finalValue;
    });

    const evaluateRQ = (score, minNormal, maxNormal) => {
      if (score < minNormal) return 'low';
      if (score > maxNormal) return 'high';
      return 'normal';
    };

    const rqEvaluations = {
      emotion: evaluateRQ(rqScores.emotion, 27, 34),
      morale: evaluateRQ(rqScores.morale, 14, 19),
      management: evaluateRQ(rqScores.management, 13, 18),
      total: evaluateRQ(rqScores.total, 55, 69)
    };

    // 2. คำนวณซึมเศร้า (ถ้าทำ)
    let score9Q = null;
    let depEval = { text: 'ปกติ ไม่เป็นโรคซึมเศร้า', severity: 'normal' };

    if (took9Q) {
      score9Q = Object.values(answers9Q).reduce((acc, val) => acc + val, 0);
      depEval = evaluateDepression(score9Q);
    }

    const finalResults = {
      rq: { scores: rqScores, evaluations: rqEvaluations },
      depression: { took9Q, score9Q, text: depEval.text, severity: depEval.severity }
    };

    let isSuccess = false;
    setResults(finalResults);

    // 3. บันทึก
    if (db) {
      setIsSaving(true);
      try {
        const docData = {
          name: respondentName.trim() ? respondentName : 'ไม่ระบุชื่อ',
          answersRQ, answers2Q,
          answers9Q: took9Q ? answers9Q : null,
          results: finalResults,
          timestamp: new Date().toISOString(),
          userId: user ? user.uid : 'anonymous'
        };

        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 8000));
        await Promise.race([ addDoc(collection(db, 'assessment_full_submissions'), docData), timeout ]);
        isSuccess = true;
      } catch (e) {
        console.error("Error saving doc", e);
        alert(`พบปัญหาในการบันทึกข้อมูลลงระบบ: ${e.message}`);
      } finally {
        setIsSaving(false);
      }
    }

    setResults({ ...finalResults, isSaveSuccess: isSuccess });
    setStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    if (window.confirm('คุณต้องการเริ่มทำแบบประเมินใหม่ใช่หรือไม่?')) {
      setAnswersRQ({}); setAnswers2Q({}); setAnswers9Q({});
      setStep(1); setResults(null); setErrors([]); setRespondentName(''); setNameError('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ==========================================
  // Admin Functions
  // ==========================================
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminLoginError('');
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    } catch (error) {
      setAdminLoginError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminLogout = async () => {
    try { await signOut(auth); setAdminEmail(''); setAdminPassword(''); setView('form'); } catch (error) {}
  };

  const handleDelete = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูลการประเมินนี้? (ลบแล้วกู้คืนไม่ได้)')) {
      try {
        await deleteDoc(doc(db, 'assessment_full_submissions', id));
      } catch (error) {
        alert("ลบข้อมูลไม่สำเร็จ: " + error.message);
      }
    }
  };

  // ==========================================
  // Styles Helpers
  // ==========================================
  const getRQColor = (status) => {
    switch (status) {
      case 'high': return 'text-green-600 bg-green-50 border-green-200';
      case 'normal': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  const getRQLabel = (status) => {
    switch (status) {
      case 'high': return 'สูงกว่าเกณฑ์ปกติ';
      case 'normal': return 'เกณฑ์ปกติ';
      case 'low': return 'ต่ำกว่าเกณฑ์ปกติ';
      default: return '-';
    }
  };
  const getDepColor = (severity) => {
    switch (severity) {
      case 'normal': return 'text-green-600 bg-green-50 border-green-200';
      case 'mild': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'moderate': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'severe': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // ==========================================
  // Render Admin View
  // ==========================================
  const renderAdminView = () => {
    const isAdminLogged = user && user.email;

    if (!isAdminLogged) {
      return (
        <div className="max-w-md mx-auto space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <Lock size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">ผู้ดูแลระบบ</h2>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-5">
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
          <button onClick={handleAdminLogout} className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl font-medium flex items-center gap-2 hover:bg-red-100">
            <LogOut size={16} /> ออกจากระบบ
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            {/* เอาคลาส whitespace-nowrap ออกจาก table เพื่อให้ตัดข้อความได้ */}
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
                  if(!res) return null; // ป้องกันข้อมูลตกหล่น

                  const rqTotal = res.rq.scores.total;
                  const rqEval = res.rq.evaluations.total;
                  const hasRisk = res.depression.took9Q;
                  const score9Q = res.depression.score9Q;
                  // คะแนน 9Q >= 7 ให้แสดงสีแดง
                  const score9QClass = score9Q >= 7 ? 'text-red-600 font-bold text-base' : 'text-gray-700 font-semibold text-base';

                  return (
                    <tr key={sub.id} className="hover:bg-indigo-50/30">
                      <td className="py-2 px-3 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(sub.timestamp).toLocaleString('th-TH')}
                      </td>
                      <td className="py-2 px-3 font-semibold text-gray-900 min-w-[120px]">
                        {sub.name}
                      </td>
                      
                      {/* ส่วน RQ ย่อยแต่ละด้าน - ปรับเป็น Stack บนล่างเพื่อประหยัดพื้นที่ */}
                      <td className="py-2 px-2 text-center bg-blue-50/10">
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-bold text-gray-800">{res.rq.scores.emotion}</span>
                          <span className={`px-1.5 py-0.5 rounded border text-[10px] leading-tight ${getRQColor(res.rq.evaluations.emotion)}`}>
                            {getRQLabel(res.rq.evaluations.emotion)}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-2 text-center bg-blue-50/10">
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-bold text-gray-800">{res.rq.scores.morale}</span>
                          <span className={`px-1.5 py-0.5 rounded border text-[10px] leading-tight ${getRQColor(res.rq.evaluations.morale)}`}>
                            {getRQLabel(res.rq.evaluations.morale)}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-2 text-center bg-blue-50/10">
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-bold text-gray-800">{res.rq.scores.management}</span>
                          <span className={`px-1.5 py-0.5 rounded border text-[10px] leading-tight ${getRQColor(res.rq.evaluations.management)}`}>
                            {getRQLabel(res.rq.evaluations.management)}
                          </span>
                        </div>
                      </td>
                      
                      {/* RQ รวม */}
                      <td className="py-2 px-2 text-center bg-blue-50/10">
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-bold text-blue-700 text-base">{rqTotal}</span>
                          <span className={`px-2 py-0.5 rounded border text-[11px] font-bold leading-tight ${getRQColor(rqEval)}`}>
                            {getRQLabel(rqEval)}
                          </span>
                        </div>
                      </td>

                      {/* ส่วนซึมเศร้า */}
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

                      {/* ส่วนลบ */}
                      <td className="py-2 px-2 text-center">
                        <button onClick={() => handleDelete(sub.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="ลบข้อมูล">
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
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Navigation */}
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

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        {view === 'admin' ? renderAdminView() : (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
            
            {/* Header (แสดงเฉพาะตอนที่ยังทำไม่เสร็จ) */}
            {step !== 4 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                  <Brain size={32} />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">แบบประเมินสุขภาพจิตและคัดกรองซึมเศร้า</h1>
                
                {/* Progress Bar */}
                <div className="flex items-center justify-center gap-2 mt-6">
                  <div className={`h-2.5 w-16 rounded-full transition-colors ${step >= 1 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                  <div className={`h-2.5 w-16 rounded-full transition-colors ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                  <div className={`h-2.5 w-16 rounded-full transition-colors ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                </div>
              </div>
            )}

            {/* Step 1: RQ 20 ข้อ */}
            {step === 1 && (
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
                          <button key={opt.value} onClick={() => handleSelectRQ(q.id, opt.value)}
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
                  <button onClick={handleNextRQ} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm transition-all">
                    ถัดไป <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: 2Q */}
            {step === 2 && (
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
                        <button key={opt.value} onClick={() => handleSelect2Q(q.id, opt.value)}
                          className={`py-3 sm:py-4 rounded-xl text-sm sm:text-base font-bold border text-center transition-all ${answers2Q[q.id] === opt.value ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:bg-indigo-50'}`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex gap-4 sticky bottom-4 z-10 p-4 bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg">
                  <button onClick={() => { setStep(1); window.scrollTo({ top: 0 }); }} className="w-1/3 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50">กลับ</button>
                  <button onClick={handleNext2Q} className="w-2/3 flex justify-center items-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm">
                    ถัดไป <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: 9Q */}
            {step === 3 && (
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
                        <button key={opt.value} onClick={() => handleSelect9Q(q.id, opt.value)}
                          className={`py-2 px-3 rounded-lg text-sm font-medium border text-center transition-all ${answers9Q[q.id] === opt.value ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:bg-indigo-50'}`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex gap-4 sticky bottom-4 z-10 p-4 bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg">
                  <button onClick={() => { setStep(2); window.scrollTo({ top: 0 }); }} className="w-1/3 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50">กลับ</button>
                  <button onClick={handleNext9Q} disabled={isSaving} className={`w-2/3 flex justify-center items-center gap-2 py-3 text-white rounded-xl font-bold shadow-sm ${isSaving ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                    {isSaving ? <><RefreshCw size={18} className="animate-spin" /> กำลังประมวลผล</> : 'ส่งแบบประเมิน'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Results */}
            {step === 4 && results && (
              <div className="space-y-6 animate-in zoom-in-95 duration-300">
                
                {/* Status Box */}
                <div className={`p-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold border ${results.isSaveSuccess ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  {results.isSaveSuccess ? <><CheckCircle2 size={18}/> บันทึกข้อมูลลงระบบเรียบร้อยแล้ว</> : <><AlertCircle size={18}/> ไม่สามารถบันทึกข้อมูลลงระบบได้</>}
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
                          <span>อารมณ์:</span> <span className="font-semibold text-gray-800">{results.rq.scores.emotion} ({getRQLabel(results.rq.evaluations.emotion)})</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span>กำลังใจ:</span> <span className="font-semibold text-gray-800">{results.rq.scores.morale} ({getRQLabel(results.rq.evaluations.morale)})</span>
                        </div>
                        <div className="flex justify-between">
                          <span>การจัดการปัญหา:</span> <span className="font-semibold text-gray-800">{results.rq.scores.management} ({getRQLabel(results.rq.evaluations.management)})</span>
                        </div>
                      </div>
                    </div>

                    {/* Depression Result Card (No Scores Displayed) */}
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
                  <button onClick={resetForm} className="inline-flex items-center gap-2 px-8 py-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-bold shadow-sm transition-all">
                    <RotateCcw size={18} /> กลับไปหน้าแรก
                  </button>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}