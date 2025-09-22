// ============================================
// 1. Import Zone.js สำหรับ Testing
// ============================================
// Zone.js เป็นไลบรารีที่ Angular ใช้ในการจัดการ async operations
// ต้องมีใน testing environment เพื่อให้ signals และ effects ทำงานได้
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
// สิ่งที่ไฟล์นี้ทำ:
// ============================================
// 1. ตั้งค่า Zone.js เพื่อให้ Angular signals/effects ทำงานใน test
// 2. เริ่มต้น Angular testing framework
// 3. ค้นหาและรันไฟล์ .spec.ts ทั้งหมดใน project
// 4. ทำให้ Karma สามารถรัน test ได้
//
// ไฟล์นี้จะถูกเรียกโดย Karma ก่อนที่จะรัน test ใดๆ
// และเป็น entry point สำหรับการ testing ทั้งหมด
