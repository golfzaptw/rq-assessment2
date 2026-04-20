# ระบบคัดกรองสุขภาพจิตและคัดกรองซึมเศร้า

แบบประเมินพลังสุขภาพจิต (RQ) 20 ข้อ พร้อมคัดกรองโรคซึมเศร้า (2Q/9Q) สำหรับใช้งานผ่านเว็บ

## Features

- แบบประเมิน RQ 20 ข้อ (ด้านอารมณ์ / กำลังใจ / การจัดการปัญหา)
- แบบคัดกรองซึมเศร้า 2Q → 9Q (แสดง 9Q เฉพาะเมื่อมีความเสี่ยง)
- สรุปผลประเมินพร้อมแปรผลอัตโนมัติ
- ระบบ Admin สำหรับดูข้อมูลผู้ตอบทั้งหมด
- บันทึกข้อมูลผ่าน Firebase Firestore

## Tech Stack

- React 19 + Vite
- Tailwind CSS 4
- Firebase (Auth + Firestore)
- GitHub Pages (deploy)

## Getting Started

```bash
npm install
cp .env.example .env   # แก้ไขค่า Firebase config ใน .env
npm run dev
```

## Environment Variables

สร้างไฟล์ `.env` จาก `.env.example` แล้วใส่ค่า Firebase config:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

## Deploy

```bash
npm run deploy
```

จะ build แล้ว push ไปที่ GitHub Pages โดยอัตโนมัติ
