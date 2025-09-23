import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Calculator } from './calculator';

describe('Calculator', () => {
  let component: Calculator;
  let fixture: ComponentFixture<Calculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Calculator],
    }).compileComponents();

    fixture = TestBed.createComponent(Calculator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Reset component state completely
    component.clear();
    component.memoryClear();
    component.clearHistory();
    component.isScientificMode = false;
    fixture.detectChanges();
  });

  // ===== 1. การตั้งค่าและการเริ่มต้นคอมโพเนนต์ =====
  describe('การตั้งค่าและเริ่มต้นคอมโพเนนต์', () => {
    it('ควรสร้างคอมโพเนนต์สำเร็จ', () => {
      expect(component).toBeTruthy();
    });

    it('ควรเริ่มต้นด้วยค่าเริ่มต้นที่ถูกต้อง', () => {
      expect(component.display).toBe('0');
      expect(component.previousValue).toBe(0);
      expect(component.currentValue).toBe(0);
      expect(component.operator).toBeNull();
      expect(component.waitingForNewValue).toBeFalsy();
      expect(component.isDecimalMode).toBeFalsy();
      expect(component.memory).toBe(0);
      expect(component.isScientificMode).toBeFalsy();
      expect(component.history).toEqual([]);
      expect(component.errorMessage).toBe('');
    });
  });

  // ===== 2. การรับ Input ตัวเลข =====
  describe('การรับ Input ตัวเลข', () => {
    it('ควรแสดงตัวเลขที่กดแทนที่ "0" เริ่มต้น', () => {
      component.inputNumber('5');
      expect(component.display).toBe('5');
      expect(component.currentValue).toBe(5);
    });

    it('ควรต่อตัวเลขเข้าด้วยกันได้', () => {
      component.inputNumber('1');
      component.inputNumber('2');
      component.inputNumber('3');

      expect(component.display).toBe('123');
      expect(component.currentValue).toBe(123);
    });

    it('ควรจัดการตัวเลขยาวได้', () => {
      const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      digits.forEach((digit) => component.inputNumber(digit));

      expect(component.display).toBe('123456789');
      expect(component.currentValue).toBe(123456789);
    });

    it('ควรแทนที่ display เมื่อ waitingForNewValue = true', () => {
      component.display = '123';
      component.waitingForNewValue = true;
      component.inputNumber('5');

      expect(component.display).toBe('5');
      expect(component.waitingForNewValue).toBeFalsy();
    });
  });

  // ===== 3. การจัดการทศนิยม =====
  describe('การจัดการทศนิยม', () => {
    it('ควรเพิ่มจุดทศนิยมได้', () => {
      component.inputNumber('5');
      component.inputDecimal();
      component.inputNumber('2');

      expect(component.display).toBe('5.2');
      expect(component.currentValue).toBe(5.2);
      expect(component.isDecimalMode).toBeTruthy();
    });

    it('ควรเริ่มด้วย "0." เมื่อกดจุดทศนิยมก่อน', () => {
      component.inputDecimal();
      expect(component.display).toBe('0.');
      expect(component.isDecimalMode).toBeTruthy();
    });

    it('ไม่ควรเพิ่มจุดทศนิยมซ้ำ', () => {
      component.inputNumber('3');
      component.inputDecimal();
      component.inputNumber('1');
      component.inputDecimal(); // ไม่ควรเพิ่ม

      expect(component.display).toBe('3.1');
      expect(component.display.split('.').length).toBe(2);
    });

    it('ควรจัดการทศนิยมหลังรอค่าใหม่', () => {
      component.waitingForNewValue = true;
      component.inputDecimal();

      expect(component.display).toBe('0.');
      expect(component.waitingForNewValue).toBeFalsy();
      expect(component.isDecimalMode).toBeTruthy();
    });
  });

  // ===== 4. การคำนวณพื้นฐาน =====
  describe('การคำนวณพื้นฐาน', () => {
    describe('การบวก', () => {
      it('ควรบวกสองจำนวนได้ถูกต้อง', () => {
        component.inputNumber('5');
        component.inputOperator('+');
        component.inputNumber('3');
        component.calculate();

        expect(component.currentValue).toBe(8);
        expect(component.display).toBe('8');
      });

      it('ควรบวกทศนิยมได้', () => {
        component.inputNumber('2');
        component.inputDecimal();
        component.inputNumber('5');
        component.inputOperator('+');
        component.inputNumber('1');
        component.inputDecimal();
        component.inputNumber('5');
        component.calculate();

        expect(component.currentValue).toBe(4);
      });

      it('ควรบวกจำนวนลบได้', () => {
        component.inputNumber('5');
        component.inputOperator('+');
        component.inputNumber('3');
        component.toggleSign();
        component.calculate();

        expect(component.currentValue).toBe(2);
      });
    });

    describe('การลบ', () => {
      it('ควรลบสองจำนวนได้ถูกต้อง', () => {
        component.inputNumber('1');
        component.inputNumber('0');
        component.inputOperator('-');
        component.inputNumber('3');
        component.calculate();

        expect(component.currentValue).toBe(7);
      });

      it('ควรจัดการผลลบได้', () => {
        component.inputNumber('3');
        component.inputOperator('-');
        component.inputNumber('8');
        component.calculate();

        expect(component.currentValue).toBe(-5);
      });

      it('ควรลบทศนิยมได้', () => {
        component.inputNumber('5');
        component.inputDecimal();
        component.inputNumber('7');
        component.inputOperator('-');
        component.inputNumber('2');
        component.inputDecimal();
        component.inputNumber('2');
        component.calculate();

        expect(component.currentValue).toBe(3.5);
      });
    });

    describe('การคูณ', () => {
      it('ควรคูณสองจำนวนได้ถูกต้อง', () => {
        component.inputNumber('6');
        component.inputOperator('*');
        component.inputNumber('7');
        component.calculate();

        expect(component.currentValue).toBe(42);
      });

      it('ควรคูณด้วยศูนย์ได้', () => {
        component.inputNumber('5');
        component.inputOperator('*');
        component.inputNumber('0');
        component.calculate();

        expect(component.currentValue).toBe(0);
      });

      it('ควรคูณจำนวนลบได้', () => {
        component.inputNumber('4');
        component.inputOperator('*');
        component.inputNumber('3');
        component.toggleSign();
        component.calculate();

        expect(component.currentValue).toBe(-12);
      });

      it('ควรคูณทศนิยมได้', () => {
        component.inputNumber('2');
        component.inputDecimal();
        component.inputNumber('5');
        component.inputOperator('*');
        component.inputNumber('4');
        component.calculate();

        expect(component.currentValue).toBe(10);
      });
    });

    describe('การหาร', () => {
      it('ควรหารสองจำนวนได้ถูกต้อง', () => {
        component.inputNumber('1');
        component.inputNumber('5');
        component.inputOperator('/');
        component.inputNumber('3');
        component.calculate();

        expect(component.currentValue).toBe(5);
      });

      it('ควรแสดงข้อผิดพลาดเมื่อหารด้วยศูนย์', () => {
        component.inputNumber('8');
        component.inputOperator('/');
        component.inputNumber('0');
        component.calculate();

        expect(component.errorMessage).toBe('Cannot divide by zero');
        expect(component.display).toBe('Error');
      });

      it('ควรจัดการผลหารที่เป็นทศนิยม', () => {
        component.inputNumber('7');
        component.inputOperator('/');
        component.inputNumber('2');
        component.calculate();

        expect(component.currentValue).toBe(3.5);
      });

      it('ควรหารทศนิยมได้', () => {
        component.inputNumber('8');
        component.inputDecimal();
        component.inputNumber('4');
        component.inputOperator('/');
        component.inputNumber('2');
        component.inputDecimal();
        component.inputNumber('1');
        component.calculate();

        expect(component.currentValue).toBe(4);
      });
    });

    describe('การคำนวณต่อเนื่อง', () => {
      it('ควรคำนวณหลายขั้นตอนได้', () => {
        component.inputNumber('5');
        component.inputOperator('+');
        component.inputNumber('3');
        component.inputOperator('*');
        component.inputNumber('2');
        component.calculate();

        // (5 + 3) * 2 = 16
        expect(component.currentValue).toBe(16);
      });

      it('ควรเปลี่ยน operator ได้ก่อนใส่ตัวเลขใหม่', () => {
        component.inputNumber('5');
        component.inputOperator('+');
        component.inputOperator('-'); // เปลี่ยนจาก + เป็น -
        component.inputNumber('3');
        component.calculate();

        expect(component.currentValue).toBe(2);
      });

      it('ควรคำนวณซ้อนหลายครั้งได้', () => {
        // 10 + 5 = 15
        component.inputNumber('1');
        component.inputNumber('0');
        component.inputOperator('+');
        component.inputNumber('5');
        component.calculate();
        expect(component.currentValue).toBe(15);

        // 15 * 2 = 30
        component.inputOperator('*');
        component.inputNumber('2');
        component.calculate();
        expect(component.currentValue).toBe(30);

        // 30 / 6 = 5
        component.inputOperator('/');
        component.inputNumber('6');
        component.calculate();
        expect(component.currentValue).toBe(5);
      });
    });
  });

  // ===== 5. Memory Functions =====
  describe('Memory Functions', () => {
    it('ควรเก็บค่าใน memory ได้', () => {
      component.inputNumber('4');
      component.inputNumber('2');
      component.memoryStore();

      expect(component.memory).toBe(42);
      expect(component.hasMemory()).toBeTruthy();
    });

    it('ควรเรียกค่าจาก memory ได้', () => {
      component.memory = 25;
      component.memoryRecall();

      expect(component.display).toBe('25');
      expect(component.currentValue).toBe(25);
      expect(component.waitingForNewValue).toBeTruthy();
    });

    it('ควรล้างค่าใน memory ได้', () => {
      component.memory = 100;
      component.memoryClear();

      expect(component.memory).toBe(0);
      expect(component.hasMemory()).toBeFalsy();
    });

    it('ควรบวกเข้า memory ได้', () => {
      component.memory = 10;
      component.currentValue = 5;
      component.memoryAdd();

      expect(component.memory).toBe(15);
    });

    it('ควรลบออกจาก memory ได้', () => {
      component.memory = 20;
      component.currentValue = 8;
      component.memorySubtract();

      expect(component.memory).toBe(12);
    });

    it('ควรใช้ memory ร่วมกับการคำนวณได้', () => {
      // คำนวณ 10 + 5 = 15 และเก็บใน memory
      component.inputNumber('1');
      component.inputNumber('0');
      component.inputOperator('+');
      component.inputNumber('5');
      component.calculate();
      component.memoryStore();
      expect(component.memory).toBe(15);

      // คำนวณ 3 * 4 = 12
      component.inputNumber('3');
      component.inputOperator('*');
      component.inputNumber('4');
      component.calculate();
      expect(component.currentValue).toBe(12);

      // บวก memory เข้าไปใน currentValue: 12 + 15 = 27
      component.memoryAdd();
      expect(component.memory).toBe(27); // memory = 15 + 12 = 27

      // เรียก memory มาแสดง
      component.memoryRecall();
      expect(component.currentValue).toBe(27);
    });
  });

  // ===== 6. Advanced Math Functions =====
  describe('Advanced Math Functions', () => {
    describe('Square Root', () => {
      it('ควรคำนวณ square root ได้ถูกต้อง', () => {
        component.inputNumber('1');
        component.inputNumber('6');
        component.sqrt();

        expect(component.currentValue).toBe(4);
        expect(component.display).toBe('4');
        expect(component.waitingForNewValue).toBeTruthy();
      });

      it('ควรคำนวณ square root ของทศนิยมได้', () => {
        component.currentValue = 2.25;
        component.sqrt();

        expect(component.currentValue).toBe(1.5);
      });

      it('ควรแสดงข้อผิดพลาดเมื่อ square root จำนวนลบ', () => {
        component.currentValue = -4;
        component.sqrt();

        expect(component.errorMessage).toBe('Invalid input for square root');
        expect(component.display).toBe('Error');
      });

      it('ควรคำนวณ square root ของศูนย์ได้', () => {
        component.currentValue = 0;
        component.sqrt();

        expect(component.currentValue).toBe(0);
      });
    });

    describe('Percentage', () => {
      it('ควรคำนวณเปอร์เซ็นต์ได้ถูกต้อง', () => {
        component.inputNumber('5');
        component.inputNumber('0');
        component.percentage();

        expect(component.currentValue).toBe(0.5);
        expect(component.waitingForNewValue).toBeTruthy();
      });

      it('ควรคำนวณเปอร์เซ็นต์ของทศนิยมได้', () => {
        component.currentValue = 12.5;
        component.percentage();

        expect(component.currentValue).toBe(0.125);
      });

      it('ควรคำนวณเปอร์เซ็นต์ของศูนย์ได้', () => {
        component.currentValue = 0;
        component.percentage();

        expect(component.currentValue).toBe(0);
      });
    });

    describe('Toggle Sign', () => {
      it('ควรเปลี่ยนเครื่องหมายจากบวกเป็นลบได้', () => {
        component.inputNumber('7');
        component.toggleSign();

        expect(component.currentValue).toBe(-7);
        expect(component.display).toBe('-7');
      });

      it('ควรเปลี่ยนเครื่องหมายจากลบเป็นบวกได้', () => {
        component.currentValue = -15;
        component.display = '-15';
        component.toggleSign();

        expect(component.currentValue).toBe(15);
        expect(component.display).toBe('15');
      });

      it('ไม่ควรเปลี่ยนเครื่องหมายของศูนย์', () => {
        component.currentValue = 0;
        component.toggleSign();

        expect(component.currentValue).toBe(0);
      });

      it('ควรเปลี่ยนเครื่องหมายของทศนิยมได้', () => {
        component.currentValue = 3.14;
        component.display = '3.14';
        component.toggleSign();

        expect(component.currentValue).toBe(-3.14);
        expect(component.display).toBe('-3.14');
      });
    });

    describe('Power Function', () => {
      it('ควรคำนวณกำลังสองได้ถูกต้อง', () => {
        component.inputNumber('5');
        component.power();

        expect(component.currentValue).toBe(25);
      });

      it('ควรคำนวณกำลังสองของทศนิยมได้', () => {
        component.currentValue = 2.5;
        component.power();

        expect(component.currentValue).toBe(6.25);
      });

      it('ควรคำนวณกำลังสองของศูนย์ได้', () => {
        component.currentValue = 0;
        component.power();

        expect(component.currentValue).toBe(0);
      });

      it('ควรคำนวณกำลังสองของจำนวนลบได้', () => {
        component.currentValue = -4;
        component.power();

        expect(component.currentValue).toBe(16);
      });
    });
  });

  // ===== 7. Scientific Mode =====
  describe('Scientific Mode', () => {
    it('ควรสลับเข้า scientific mode ได้', () => {
      component.toggleScientificMode();
      expect(component.isScientificMode).toBeTruthy();
    });

    it('ควรสลับออกจาก scientific mode ได้', () => {
      component.isScientificMode = true;
      component.toggleScientificMode();
      expect(component.isScientificMode).toBeFalsy();
    });

    describe('Trigonometric Functions', () => {
      beforeEach(() => {
        component.toggleScientificMode();
      });

      it('ควรคำนวณ sin ได้ถูกต้อง', () => {
        component.inputNumber('3');
        component.inputNumber('0');
        component.sin();

        expect(component.currentValue).toBeCloseTo(0.5, 5);
        expect(component.waitingForNewValue).toBeTruthy();
      });

      it('ควรคำนวณ cos ได้ถูกต้อง', () => {
        component.inputNumber('6');
        component.inputNumber('0');
        component.cos();

        expect(component.currentValue).toBeCloseTo(0.5, 5);
      });

      it('ควรคำนวณ sin ของ 0 องศาได้', () => {
        component.currentValue = 0;
        component.sin();

        expect(component.currentValue).toBeCloseTo(0, 5);
      });

      it('ควรคำนวณ cos ของ 0 องศาได้', () => {
        component.currentValue = 0;
        component.cos();

        expect(component.currentValue).toBeCloseTo(1, 5);
      });

      it('ไม่ควรคำนวณ sin เมื่อไม่อยู่ใน scientific mode', () => {
        component.toggleScientificMode(); // ปิด scientific mode
        const originalValue = component.currentValue;
        component.sin();

        expect(component.currentValue).toBe(originalValue);
      });

      it('ไม่ควรคำนวณ cos เมื่อไม่อยู่ใน scientific mode', () => {
        component.toggleScientificMode(); // ปิด scientific mode
        const originalValue = component.currentValue;
        component.cos();

        expect(component.currentValue).toBe(originalValue);
      });
    });
  });

  // ===== 8. Clear Operations =====
  describe('Clear Operations', () => {
    it('ควรล้างค่าทั้งหมดด้วย clear()', () => {
      component.display = '123';
      component.currentValue = 123;
      component.previousValue = 456;
      component.operator = '+';
      component.waitingForNewValue = true;
      component.isDecimalMode = true;
      component.errorMessage = 'Test error';

      component.clear();

      expect(component.display).toBe('0');
      expect(component.currentValue).toBe(0);
      expect(component.previousValue).toBe(0);
      expect(component.operator).toBeNull();
      expect(component.waitingForNewValue).toBeFalsy();
      expect(component.isDecimalMode).toBeFalsy();
      expect(component.errorMessage).toBe('');
    });

    it('ควรล้างเฉพาะ entry ปัจจุบันด้วย clearEntry()', () => {
      component.display = '123';
      component.currentValue = 123;
      component.previousValue = 456;
      component.operator = '+';

      component.clearEntry();

      expect(component.display).toBe('0');
      expect(component.currentValue).toBe(0);
      expect(component.previousValue).toBe(456); // ไม่เปลี่ยน
      expect(component.operator).toBe('+'); // ไม่เปลี่ยน
    });

    describe('Backspace', () => {
      it('ควรลบตัวอักษรสุดท้าย', () => {
        component.display = '123';
        component.backspace();

        expect(component.display).toBe('12');
        expect(component.currentValue).toBe(12);
      });

      it('ควรแสดง "0" เมื่อลบตัวสุดท้าย', () => {
        component.display = '5';
        component.backspace();

        expect(component.display).toBe('0');
        expect(component.currentValue).toBe(0);
      });

      it('ควรจัดการจุดทศนิยมเมื่อ backspace', () => {
        component.display = '12.3';
        component.isDecimalMode = true;
        component.backspace();

        expect(component.display).toBe('12.');
        expect(component.isDecimalMode).toBeTruthy();

        component.backspace(); // ลบจุด
        expect(component.display).toBe('12');
        expect(component.isDecimalMode).toBeFalsy();
      });

      it('ควรทำงานเหมือน clearEntry เมื่อมี error', () => {
        component.errorMessage = 'Test error';
        component.display = 'Error';
        component.backspace();

        expect(component.display).toBe('0');
        expect(component.errorMessage).toBe('');
      });

      it('ควรทำงานเหมือน clearEntry เมื่อ waitingForNewValue', () => {
        component.display = '123';
        component.waitingForNewValue = true;
        component.backspace();

        expect(component.display).toBe('0');
        expect(component.currentValue).toBe(0);
      });
    });
  });

  // ===== 9. Error Handling =====
  describe('Error Handling', () => {
    it('ควรแสดง error เมื่อหารด้วยศูนย์', () => {
      component.inputNumber('5');
      component.inputOperator('/');
      component.inputNumber('0');
      component.calculate();

      expect(component.errorMessage).toBe('Cannot divide by zero');
      expect(component.display).toBe('Error');
    });

    it('ควรแสดง error เมื่อ sqrt จำนวนลบ', () => {
      component.currentValue = -9;
      component.sqrt();

      expect(component.errorMessage).toBe('Invalid input for square root');
      expect(component.display).toBe('Error');
    });

    it('ควรล้าง error เมื่อใส่ตัวเลขใหม่', () => {
      component.errorMessage = 'Test error';
      component.display = 'Error';

      component.inputNumber('5');

      expect(component.errorMessage).toBe('');
      expect(component.display).toBe('5');
    });

    it('ควรล้าง error เมื่อใส่ทศนิยม', () => {
      component.errorMessage = 'Test error';
      component.inputDecimal();

      expect(component.errorMessage).toBe('');
    });

    it('ควรล้าง error เมื่อใช้ advanced functions', () => {
      component.errorMessage = 'Test error';
      component.currentValue = 9;
      component.sqrt();

      expect(component.errorMessage).toBe('');
      expect(component.currentValue).toBe(3);
    });

    it('ควรล้าง error เมื่อใช้ operator', () => {
      component.errorMessage = 'Test error';
      component.currentValue = 5;
      component.inputOperator('+');

      expect(component.errorMessage).toBe('');
    });

    it('ควรจัดการ invalid operation', () => {
      component.previousValue = Number.POSITIVE_INFINITY;
      component.currentValue = Number.NEGATIVE_INFINITY;
      component.operator = '+';

      const result = component.calculateResult();
      expect(result).toBeNull();
      expect(component.errorMessage).toBe('Invalid operation');
    });
  });

  // ===== 10. History Management =====
  describe('History Management', () => {
    it('ควรเพิ่มประวัติการคำนวณ', () => {
      component.inputNumber('5');
      component.inputOperator('+');
      component.inputNumber('3');
      component.calculate();

      expect(component.history.length).toBe(1);
      expect(component.history[0]).toBe('5 + 3 = 8');
    });

    it('ควรเพิ่มประวัติใหม่ที่ด้านบน', () => {
      component.addToHistory('First operation');
      component.addToHistory('Second operation');

      expect(component.history[0]).toBe('Second operation');
      expect(component.history[1]).toBe('First operation');
    });

    it('ควรจำกัดประวัติไว้ 10 รายการ', () => {
      for (let i = 1; i <= 12; i++) {
        component.addToHistory(`Operation ${i}`);
      }

      expect(component.history.length).toBe(10);
      expect(component.history[0]).toBe('Operation 12');
      expect(component.history[9]).toBe('Operation 3');
    });

    it('ควรล้างประวัติทั้งหมด', () => {
      component.addToHistory('Test 1');
      component.addToHistory('Test 2');
      component.clearHistory();

      expect(component.history.length).toBe(0);
    });

    it('ควรเพิ่มประวัติสำหรับ advanced functions', () => {
      component.currentValue = 16;
      component.sqrt();

      expect(component.history.length).toBe(1);
      expect(component.history[0]).toBe('√16 = 4');
    });
  });

  // ===== 11. Utility Methods =====
  describe('Utility Methods', () => {
    describe('hasMemory()', () => {
      it('ควรคืนค่า false เมื่อ memory = 0', () => {
        component.memory = 0;
        expect(component.hasMemory()).toBeFalsy();
      });

      it('ควรคืนค่า true เมื่อ memory มีค่า', () => {
        component.memory = 5;
        expect(component.hasMemory()).toBeTruthy();

        component.memory = -3;
        expect(component.hasMemory()).toBeTruthy();
      });
    });

    describe('canCalculate()', () => {
      it('ควรคืนค่า false เมื่อไม่มี operator', () => {
        component.operator = null;
        expect(component.canCalculate()).toBeFalsy();
      });

      it('ควรคืนค่า false เมื่อ waitingForNewValue = true', () => {
        component.operator = '+';
        component.waitingForNewValue = true;
        component.errorMessage = '';

        expect(component.canCalculate()).toBeFalsy();
      });

      it('ควรคืนค่า false เมื่อมี error', () => {
        component.operator = '+';
        component.waitingForNewValue = false;
        component.errorMessage = 'Error';

        expect(component.canCalculate()).toBeFalsy();
      });

      it('ควรคืนค่า true เมื่อพร้อมคำนวณ', () => {
        component.operator = '+';
        component.waitingForNewValue = false;
        component.errorMessage = '';

        expect(component.canCalculate()).toBeTruthy();
      });
    });

    describe('getOperatorDisplay()', () => {
      it('ควรแปลง operator เป็นสัญลักษณ์ที่ถูกต้อง', () => {
        const testCases = [
          { operator: '+', expected: '+' },
          { operator: '-', expected: '-' },
          { operator: '*', expected: '×' },
          { operator: '/', expected: '÷' },
          { operator: null, expected: '' },
          { operator: 'invalid', expected: '' },
        ];

        testCases.forEach((testCase) => {
          component.operator = testCase.operator;
          expect(component.getOperatorDisplay()).toBe(testCase.expected);
        });
      });
    });

    describe('formatNumber()', () => {
      it('ควรจัดรูปแบบจำนวนเต็ม', () => {
        // ใช้ any เพื่อเข้าถึง private method
        const formatted = (component as any).formatNumber(1000);
        expect(formatted).toBe('1,000');
      });

      it('ควรจัดรูปแบบทศนิยม', () => {
        const formatted = (component as any).formatNumber(3.14159);
        expect(formatted).toBe('3.14159');
      });

      it('ควรคืนค่า "0" สำหรับศูนย์', () => {
        const formatted = (component as any).formatNumber(0);
        expect(formatted).toBe('0');
      });

      it('ควรจำกัดทศนิยมที่ 8 ตำแหน่ง', () => {
        const longDecimal = 1 / 3; // 0.3333333333333333
        const formatted = (component as any).formatNumber(longDecimal);
        expect(formatted).toBe('0.33333333');
      });

      it('ควรจัดการ NaN', () => {
        const formatted = (component as any).formatNumber(NaN);
        expect(formatted).toBe('NaN');
      });

      it('ควรจัดการ Infinity', () => {
        const formatted = (component as any).formatNumber(Infinity);
        expect(formatted).toBe('Infinity');
      });
    });
  });

  // ===== 12. Complex Scenarios =====
  describe('Complex Scenarios', () => {
    it('ควรจัดการการคำนวณซับซ้อน: (5 + 3) * 2 / 4', () => {
      component.inputNumber('5');
      component.inputOperator('+');
      component.inputNumber('3');
      component.inputOperator('*');
      component.inputNumber('2');
      component.inputOperator('/');
      component.inputNumber('4');
      component.calculate();

      // ((5 + 3) * 2) / 4 = (8 * 2) / 4 = 16 / 4 = 4
      expect(component.currentValue).toBe(4);
    });

    it('ควรจัดการการใช้ memory ร่วมกับการคำนวณซับซ้อน', () => {
      // คำนวณ 10 + 5 = 15 และเก็บใน memory
      component.inputNumber('1');
      component.inputNumber('0');
      component.inputOperator('+');
      component.inputNumber('5');
      component.calculate();
      component.memoryStore();
      expect(component.memory).toBe(15);

      // คำนวณ 3 * 4 = 12
      component.inputNumber('3');
      component.inputOperator('*');
      component.inputNumber('4');
      component.calculate();
      expect(component.currentValue).toBe(12);

      // M+ เพิ่ม 12 เข้า memory: 15 + 12 = 27
      component.memoryAdd();
      expect(component.memory).toBe(27);

      // เรียก memory มาแสดง
      component.memoryRecall();
      expect(component.currentValue).toBe(27);

      // คูณ 2: 27 * 2 = 54
      component.inputOperator('*');
      component.inputNumber('2');
      component.calculate();

      expect(component.currentValue).toBe(54);
    });

    it('ควรกู้คืนจาก error และทำงานต่อได้', () => {
      // สร้าง error
      component.inputNumber('8');
      component.inputOperator('/');
      component.inputNumber('0');
      component.calculate();
      expect(component.errorMessage).toBeTruthy();

      // กู้คืนและคำนวณใหม่
      component.inputNumber('6');
      component.inputOperator('+');
      component.inputNumber('4');
      component.calculate();

      expect(component.errorMessage).toBe('');
      expect(component.currentValue).toBe(10);
    });

    it('ควรจัดการการเปลี่ยน mode ระหว่างการใช้งาน', () => {
      // เริ่มใน standard mode
      component.inputNumber('9');
      component.sqrt();
      expect(component.currentValue).toBe(3);

      // เปลี่ยนเป็น scientific mode
      component.toggleScientificMode();
      component.inputNumber('9');
      component.inputNumber('0');
      component.sin();

      expect(component.currentValue).toBeCloseTo(1, 5);
      expect(component.isScientificMode).toBeTruthy();

      // เปลี่ยนกลับเป็น standard mode
      component.toggleScientificMode();
      expect(component.isScientificMode).toBeFalsy();
    });
  });

  // ===== 13. Edge Cases =====
  describe('Edge Cases', () => {
    it('ควรจัดการตัวเลขขนาดใหญ่', () => {
      const largeNumber = '999999999';
      for (const digit of largeNumber) {
        component.inputNumber(digit);
      }

      expect(component.currentValue).toBe(999999999);
      expect(component.display).toBe(largeNumber);
    });

    it('ควรจัดการทศนิยมที่มีตำแหน่งเยอะ', () => {
      component.inputNumber('1');
      component.inputDecimal();
      const decimals = '123456789';
      for (const digit of decimals) {
        component.inputNumber(digit);
      }

      expect(component.display).toBe('1.123456789');
      expect(component.currentValue).toBe(1.123456789);
    });

    it('ควรจัดการการเปลี่ยน operator หลายครั้ง', () => {
      component.inputNumber('5');
      component.inputOperator('+');
      component.inputOperator('-');
      component.inputOperator('*');
      component.inputOperator('/');

      expect(component.operator).toBe('/');
      expect(component.previousValue).toBe(5);
    });

    it('ควรจัดการการกด decimal หลายครั้ง', () => {
      component.inputNumber('3');
      component.inputDecimal();
      component.inputDecimal();
      component.inputDecimal();
      component.inputNumber('14');

      expect(component.display).toBe('3.14');
      expect(component.display.split('.').length).toBe(2); // มีจุดเดียว
    });

    it('ควรจัดการ state ผิดปกติ', () => {
      component.previousValue = 10;
      component.operator = null;
      component.currentValue = 5;

      const result = component.calculateResult();
      expect(result).toBe(5); // ควรคืนค่า currentValue
    });

    it('ควรจัดการการ clear หลังจาก error', () => {
      component.errorMessage = 'Test error';
      component.display = 'Error';
      component.clear();

      expect(component.errorMessage).toBe('');
      expect(component.display).toBe('0');
    });

    it('ควรจัดการการ reset form state', () => {
      // ตั้งค่า state ต่างๆ
      component.display = '123.45';
      component.currentValue = 123.45;
      component.previousValue = 678.9;
      component.operator = '*';
      component.memory = 999;
      component.isDecimalMode = true;
      component.waitingForNewValue = true;
      component.errorMessage = 'Error';
      component.isScientificMode = true;
      component.history = ['test1', 'test2'];

      // Reset ทั้งหมด
      component.clear();
      component.memoryClear();
      component.clearHistory();
      component.isScientificMode = false;

      // ตรวจสอบว่า reset หมดแล้ว
      expect(component.display).toBe('0');
      expect(component.currentValue).toBe(0);
      expect(component.previousValue).toBe(0);
      expect(component.operator).toBeNull();
      expect(component.memory).toBe(0);
      expect(component.isDecimalMode).toBeFalsy();
      expect(component.waitingForNewValue).toBeFalsy();
      expect(component.errorMessage).toBe('');
      expect(component.isScientificMode).toBeFalsy();
      expect(component.history.length).toBe(0);
    });
  });

  // ===== 14. Performance Tests =====
  describe('Performance Tests', () => {
    it('ควรจัดการการคำนวณหลายครั้งติดต่อกัน', (done) => {
      const startTime = Date.now();

      for (let i = 0; i < 50; i++) {
        // ลดจำนวนลง
        component.inputNumber('1');
        component.inputOperator('+');
        component.inputNumber('1');
        component.calculate();
        component.clear();
      }

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      expect(executionTime).toBeLessThan(1000);
      done();
    });

    it('ควรจัดการ history ขนาดใหญ่อย่างมีประสิทธิภาพ', (done) => {
      const startTime = Date.now();

      for (let i = 0; i < 50; i++) {
        // ลดจำนวนลง
        component.addToHistory(`Operation ${i}`);
      }

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      expect(component.history.length).toBe(10);
      expect(executionTime).toBeLessThan(100);
      done();
    });

    it('ควรจัดการการเปลี่ยนแปลง state อย่างรวดเร็ว', (done) => {
      const operations = ['1', '2', '3', '+', '4', '5', '6', '='];
      const startTime = Date.now();

      for (let i = 0; i < 20; i++) {
        // ลดจำนวนลง
        operations.forEach((op) => {
          if (op === '=') {
            component.calculate();
          } else if (['+', '-', '*', '/'].includes(op)) {
            component.inputOperator(op);
          } else {
            component.inputNumber(op);
          }
        });
        component.clear();
      }

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      expect(executionTime).toBeLessThan(500);
      done();
    });
  });

  // ===== 15. Data Integrity Tests =====
  describe('Data Integrity Tests', () => {
    it('ควรรักษา consistency ของ display และ currentValue', () => {
      component.inputNumber('1');
      component.inputNumber('2');
      component.inputDecimal();
      component.inputNumber('3');

      expect(component.display).toBe(component.currentValue.toString());
    });

    it('ควรรักษา state ที่ถูกต้องหลังการคำนวณ', () => {
      component.inputNumber('5');
      component.inputOperator('+');
      component.inputNumber('3');
      component.calculate();

      expect(component.previousValue).toBe(0);
      expect(component.operator).toBeNull();
      expect(component.waitingForNewValue).toBeTruthy();
      expect(component.currentValue).toBe(8);
    });

    it('ควรรักษา decimal mode consistency', () => {
      component.inputDecimal();
      expect(component.isDecimalMode).toBeTruthy();

      component.inputNumber('5');
      expect(component.isDecimalMode).toBeTruthy();

      component.inputOperator('+');
      expect(component.isDecimalMode).toBeFalsy();
    });

    it('ควรรักษา waiting state consistency', () => {
      component.inputNumber('5');
      component.inputOperator('+');
      expect(component.waitingForNewValue).toBeTruthy();

      component.inputNumber('3');
      expect(component.waitingForNewValue).toBeFalsy();

      component.calculate();
      expect(component.waitingForNewValue).toBeTruthy();
    });
  });
});
