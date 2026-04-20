import { useState, useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, addDoc, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { Brain } from 'lucide-react';
import { auth, db } from './lib/firebase';
import { QUESTIONS_RQ, QUESTIONS_2Q, QUESTIONS_9Q } from './data/questions';
import { calculateResults } from './utils/scoring';
import Navbar from './components/Navbar';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import StepRQ from './components/StepRQ';
import Step2Q from './components/Step2Q';
import Step9Q from './components/Step9Q';
import ResultView from './components/ResultView';

const COLLECTION_NAME = 'assessment_full_submissions';

export default function App() {
  const [view, setView] = useState('form');
  const [step, setStep] = useState(1);

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

  // Login State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Auth listener
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

  // Admin data listener
  useEffect(() => {
    if (!user || !user.email || view !== 'admin' || !db) return;
    const q = collection(db, COLLECTION_NAME);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setSubmissions(docs);
    }, (error) => {
      console.error("Error fetching admin data:", error);
    });
    return () => unsubscribe();
  }, [user, view]);

  // === Handlers ===
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

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleNextRQ = () => {
    if (!respondentName.trim()) {
      setNameError('กรุณาระบุชื่อ-สกุล ก่อนดำเนินการต่อ');
      scrollToTop();
      return;
    }
    setNameError('');

    const unanswered = QUESTIONS_RQ.filter(q => !answersRQ[q.id]).map(q => `rq-${q.id}`);
    if (unanswered.length > 0) {
      setErrors(unanswered);
      const el = document.getElementById(`question-rq-${unanswered[0].split('-')[1]}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setStep(2);
    scrollToTop();
  };

  const handleNext2Q = () => {
    const unanswered = QUESTIONS_2Q.filter(q => answers2Q[q.id] === undefined).map(q => `2q-${q.id}`);
    if (unanswered.length > 0) {
      setErrors(unanswered);
      return;
    }

    const hasRisk = answers2Q[1] === 1 || answers2Q[2] === 1;
    if (!hasRisk) {
      submitFinalData(false);
    } else {
      setStep(3);
      scrollToTop();
    }
  };

  const handleNext9Q = () => {
    const unanswered = QUESTIONS_9Q.filter(q => answers9Q[q.id] === undefined).map(q => `9q-${q.id}`);
    if (unanswered.length > 0) {
      setErrors(unanswered);
      const el = document.getElementById(`question-9q-${unanswered[0].split('-')[1]}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    submitFinalData(true);
  };

  const submitFinalData = async (took9Q) => {
    const finalResults = calculateResults(answersRQ, answers2Q, answers9Q, took9Q);
    let isSuccess = false;
    setResults(finalResults);

    if (db) {
      setIsSaving(true);
      try {
        const docData = {
          name: respondentName.trim() || 'ไม่ระบุชื่อ',
          answersRQ,
          answers2Q,
          answers9Q: took9Q ? answers9Q : null,
          results: finalResults,
          timestamp: new Date().toISOString(),
          userId: user ? user.uid : 'anonymous',
        };
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 8000));
        await Promise.race([addDoc(collection(db, COLLECTION_NAME), docData), timeout]);
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
    scrollToTop();
  };

  const resetForm = () => {
    if (window.confirm('คุณต้องการเริ่มทำแบบประเมินใหม่ใช่หรือไม่?')) {
      setAnswersRQ({});
      setAnswers2Q({});
      setAnswers9Q({});
      setStep(1);
      setResults(null);
      setErrors([]);
      setRespondentName('');
      setNameError('');
      scrollToTop();
    }
  };

  // === Admin handlers ===
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminLoginError('');
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    } catch {
      setAdminLoginError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await signOut(auth);
      setAdminEmail('');
      setAdminPassword('');
      setView('form');
    } catch { /* ignore */ }
  };

  const handleDelete = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูลการประเมินนี้? (ลบแล้วกู้คืนไม่ได้)')) {
      try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
      } catch (error) {
        alert("ลบข้อมูลไม่สำเร็จ: " + error.message);
      }
    }
  };

  // === Render ===
  const isAdminLogged = user && user.email;

  const renderAdminView = () => {
    if (!isAdminLogged) {
      return (
        <AdminLogin
          adminEmail={adminEmail} setAdminEmail={setAdminEmail}
          adminPassword={adminPassword} setAdminPassword={setAdminPassword}
          adminLoginError={adminLoginError} isLoggingIn={isLoggingIn}
          onSubmit={handleAdminLogin}
        />
      );
    }
    return <AdminDashboard submissions={submissions} onLogout={handleAdminLogout} onDelete={handleDelete} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Navbar view={view} setView={setView} setStep={setStep} />

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        {view === 'admin' ? renderAdminView() : (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">

            {/* Header */}
            {step !== 4 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                  <Brain size={32} />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">แบบประเมินสุขภาพจิตและคัดกรองซึมเศร้า</h1>
                <div className="flex items-center justify-center gap-2 mt-6">
                  <div className={`h-2.5 w-16 rounded-full transition-colors ${step >= 1 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                  <div className={`h-2.5 w-16 rounded-full transition-colors ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                  <div className={`h-2.5 w-16 rounded-full transition-colors ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                </div>
              </div>
            )}

            {step === 1 && (
              <StepRQ
                respondentName={respondentName} setRespondentName={setRespondentName}
                nameError={nameError} setNameError={setNameError}
                answersRQ={answersRQ} errors={errors}
                onSelect={handleSelectRQ} onNext={handleNextRQ}
              />
            )}

            {step === 2 && (
              <Step2Q
                answers2Q={answers2Q} errors={errors}
                onSelect={handleSelect2Q} onNext={handleNext2Q}
                onBack={() => { setStep(1); scrollToTop(); }}
              />
            )}

            {step === 3 && (
              <Step9Q
                answers9Q={answers9Q} errors={errors} isSaving={isSaving}
                onSelect={handleSelect9Q} onNext={handleNext9Q}
                onBack={() => { setStep(2); scrollToTop(); }}
              />
            )}

            {step === 4 && results && (
              <ResultView results={results} respondentName={respondentName} onReset={resetForm} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
