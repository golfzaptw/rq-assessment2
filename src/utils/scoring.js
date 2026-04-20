import { QUESTIONS_RQ } from '../data/questions';

export const evaluateDepression = (score) => {
  if (score < 7) return { text: 'ไม่มีอาการของโรคซึมเศร้า หรือมีอาการระดับน้อยมาก', severity: 'normal' };
  if (score <= 12) return { text: 'มีอาการของโรคซึมเศร้า ระดับน้อย', severity: 'mild' };
  if (score <= 18) return { text: 'มีอาการของโรคซึมเศร้า ระดับปานกลาง', severity: 'moderate' };
  return { text: 'มีอาการของโรคซึมเศร้า ระดับรุนแรง', severity: 'severe' };
};

export const evaluateRQ = (score, minNormal, maxNormal) => {
  if (score < minNormal) return 'low';
  if (score > maxNormal) return 'high';
  return 'normal';
};

export const calculateResults = (answersRQ, answers2Q, answers9Q, took9Q) => {
  const rqScores = { emotion: 0, morale: 0, management: 0, total: 0 };
  QUESTIONS_RQ.forEach(q => {
    const rawValue = answersRQ[q.id];
    const finalValue = q.reverse ? (5 - rawValue) : rawValue;
    rqScores[q.category] += finalValue;
    rqScores.total += finalValue;
  });

  const rqEvaluations = {
    emotion: evaluateRQ(rqScores.emotion, 27, 34),
    morale: evaluateRQ(rqScores.morale, 14, 19),
    management: evaluateRQ(rqScores.management, 13, 18),
    total: evaluateRQ(rqScores.total, 55, 69),
  };

  let score9Q = null;
  let depEval = { text: 'ปกติ ไม่เป็นโรคซึมเศร้า', severity: 'normal' };
  if (took9Q) {
    score9Q = Object.values(answers9Q).reduce((acc, val) => acc + val, 0);
    depEval = evaluateDepression(score9Q);
  }

  return {
    rq: { scores: rqScores, evaluations: rqEvaluations },
    depression: { took9Q, score9Q, text: depEval.text, severity: depEval.severity },
  };
};

// Style helpers
export const getRQColor = (status) => {
  switch (status) {
    case 'high': return 'text-green-600 bg-green-50 border-green-200';
    case 'normal': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'low': return 'text-orange-600 bg-orange-50 border-orange-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const getRQLabel = (status) => {
  switch (status) {
    case 'high': return 'สูงกว่าเกณฑ์ปกติ';
    case 'normal': return 'เกณฑ์ปกติ';
    case 'low': return 'ต่ำกว่าเกณฑ์ปกติ';
    default: return '-';
  }
};

export const getDepColor = (severity) => {
  switch (severity) {
    case 'normal': return 'text-green-600 bg-green-50 border-green-200';
    case 'mild': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'moderate': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'severe': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};
