# 😃TypeScript-CRUD
โปรเจกต์นี้เป็นแอปพลิเคชันบนเว็บที่พัฒนาด้วย React และ TypeScript โดยนำเสนอฟังก์ชันพื้นฐานของ CRUD Operations (Create, Read, Update, Delete) สำหรับการจัดการข้อมูล ผู้ใช้สามารถเพิ่ม, ดู, แก้ไข และลบข้อมูลได้แบบไดนามิกผ่านอินเทอร์เฟซที่ใช้งานง่าย โดยยังคำนึงถึงความถูกต้องของข้อมูลด้วยพลังของ TypeScript

## 💻 Client
✨ โค้ดหลักในฝั่ง Client จะถูกแปลงเป็น TypeScript (.tsx) และยังคงจัดเก็บอยู่ในโฟลเดอร์ react-crud-app/client/src/App.tsx รูปแบบและโครงสร้างเดิมจะถูกปรับให้รองรับ TypeScript โดยเฉพาะ เพื่อเพิ่มความแม่นยำในการตรวจสอบชนิดข้อมูล (type checking) และลดข้อผิดพลาดระหว่างการพัฒนา

## 💻 Server
✨ โค้ดหลักในฝั่ง Server (index.js) ยังคงอยู่ในโฟลเดอร์ react-crud-app/server โดยจัดการการเชื่อมต่อกับฐานข้อมูล การตั้งค่า API และจัดการ CRUD Operations อย่างครบถ้วน

## 🎉Database

✨คำสั่งสร้าง database ( Mysql )

```bash
  CREATE DATABASE crud;
  
  USE crud;
  
  CREATE TABLE students (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      firstname VARCHAR(255) NOT NULL,      
      lastname VARCHAR(255) NOT NULL,    
      email VARCHAR(255) NOT NULL,                  
      portfolio VARCHAR(255) NOT NULL     
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

```

