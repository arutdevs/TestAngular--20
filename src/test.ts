// ============================================
// 1. Import Zone.js Core ก่อน (สำคัญมาก!)
// ============================================
// ต้อง import zone.js ก่อน zone.js/testing
import 'zone.js';
import 'zone.js/testing';

// ============================================
// 2. Import Angular Testing Utilities
// ============================================
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// ============================================
// 3. Declare require.context (สำหรับ Webpack)
// ============================================
// TypeScript type definition สำหรับ webpack's require.context
// ใช้ในการค้นหาไฟล์ .spec.ts ทั้งหมด
declare const require: {
  context(
    path: string,
    deep?: boolean,
    filter?: RegExp
  ): {
    <T>(id: string): T;
    keys(): string[];
  };
};

// ============================================
// 4. ตั้งค่า Angular Testing Environment
// ============================================
// เริ่มต้น Angular testing environment
// ต้องเรียกก่อนที่จะรัน test cases ใดๆ
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule, // Module สำหรับ browser testing
  platformBrowserDynamicTesting() // Platform สำหรับ dynamic testing
);

// ============================================
// 5. ค้นหาและโหลดไฟล์ test ทั้งหมด
// ============================================
// ค้นหาไฟล์ที่ลงท้ายด้วย .spec.ts ใน src/ และ subfolder ทั้งหมด
const context = require.context('./', true, /\.spec\.ts$/);

// โหลดไฟล์ test ทั้งหมดที่ค้นพบ
context.keys().forEach(context);

// ============================================
// การเปลี่ยนแปลง:
// ============================================
// เพิ่ม import 'zone.js'; ก่อน import 'zone.js/testing';
// เพื่อให้ Zone.js core ถูกโหลดก่อน testing utilities