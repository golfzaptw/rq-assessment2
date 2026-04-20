// --- RQ 20 ข้อ ---
export const QUESTIONS_RQ = [
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

export const OPTIONS_RQ = [
  { value: 1, label: 'ไม่จริง' },
  { value: 2, label: 'จริงบางครั้ง' },
  { value: 3, label: 'ค่อนข้างจริง' },
  { value: 4, label: 'จริงมาก' },
];

// --- 2Q ---
export const QUESTIONS_2Q = [
  { id: 1, text: 'ใน 2 สัปดาห์ที่ผ่านมา รวมวันนี้ ท่านรู้สึก หดหู่ เศร้า หรือท้อแท้สิ้นหวัง หรือไม่' },
  { id: 2, text: 'ใน 2 สัปดาห์ที่ผ่านมา รวมวันนี้ท่านรู้สึก เบื่อ ทำอะไรก็ไม่เพลิดเพลิน หรือไม่' },
];

export const OPTIONS_2Q = [
  { value: 0, label: 'ไม่มี' },
  { value: 1, label: 'มี' },
];

// --- 9Q ---
export const QUESTIONS_9Q = [
  { id: 1, text: 'เบื่อ ไม่สนใจอยากทำอะไร' },
  { id: 2, text: 'ไม่สบายใจ ซึมเศร้า ท้อแท้' },
  { id: 3, text: 'หลับยากหรือหลับๆตื่นๆหรือหลับมากไป' },
  { id: 4, text: 'เหนื่อยง่ายหรือไม่ค่อยมีแรง' },
  { id: 5, text: 'เบื่ออาหารหรือกินมากเกินไป' },
  { id: 6, text: 'รู้สึกไม่ดีกับตัวเอง คิดว่าตัวเองล้มเหลวหรือครอบครัวผิดหวัง' },
  { id: 7, text: 'สมาธิไม่ดี เวลาทำอะไร เช่น ดูโทรทัศน์ ฟังวิทยุ หรือทำงานที่ต้องใช้ความตั้งใจ' },
  { id: 8, text: 'พูดช้า ทำอะไรช้าลงจนคนอื่นสังเกตเห็นได้ หรือกระสับกระส่ายไม่สามารถอยู่นิ่งได้เหมือนที่เคยเป็น' },
  { id: 9, text: 'คิดทำร้ายตนเอง หรือคิดว่าถ้าตายไปคงจะดี' },
];

export const OPTIONS_9Q = [
  { value: 0, label: 'ไม่มีเลย' },
  { value: 1, label: 'เป็นบางวัน (1-7 วัน)' },
  { value: 2, label: 'เป็นบ่อย (> 7 วัน)' },
  { value: 3, label: 'เป็นทุกวัน' },
];
