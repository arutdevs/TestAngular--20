import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-calculator',
  imports: [],
  templateUrl: './calculator.html',
  styleUrl: './calculator.scss',
})
export class Calculator {
  // Properties สำหรับ display และ state
  display: string = '0';
  previousValue: number = 0;
  currentValue: number = 0;
  operator: string | null = null;
  waitingForNewValue: boolean = false;
  isDecimalMode: boolean = false;
  history: string[] = [];
  errorMessage: string = '';

  // Properties สำหรับ advanced features
  memory: number = 0;
  isScientificMode: boolean = false;

  constructor() {}

  // ===== Basic Input Methods =====

  /**
   * จัดการการกดตัวเลข
   */
  inputNumber(num: string): void {
    if (this.errorMessage) {
      this.clearError();
    }

    if (this.waitingForNewValue) {
      this.display = num;
      this.waitingForNewValue = false;
      this.isDecimalMode = false;
    } else {
      if (this.display === '0' && num !== '.') {
        this.display = num;
      } else {
        this.display += num;
      }
    }

    this.currentValue = parseFloat(this.display);
  }

  /**
   * จัดการการกดทศนิยม
   */
  inputDecimal(): void {
    if (this.errorMessage) {
      this.clearError();
    }

    if (this.waitingForNewValue) {
      this.display = '0.';
      this.waitingForNewValue = false;
      this.isDecimalMode = true;
    } else if (!this.isDecimalMode && this.display.indexOf('.') === -1) {
      this.display += '.';
      this.isDecimalMode = true;
    }
  }

  // ===== Operator Methods =====

  /**
   * จัดการ operators พื้นฐาน (+, -, *, /)
   */
  inputOperator(nextOperator: string): void {
    if (this.errorMessage) {
      this.clearError();
    }

    const inputValue = parseFloat(this.display);

    if (this.operator && this.waitingForNewValue) {
      this.operator = nextOperator;
      return;
    }

    if (this.previousValue === 0) {
      this.previousValue = inputValue;
    } else if (this.operator) {
      const result = this.calculateResult();

      if (result === null) {
        return; // Error occurred
      }

      this.previousValue = result;
      this.display = this.formatNumber(result);
      this.currentValue = result;
    }

    this.waitingForNewValue = true;
    this.operator = nextOperator;
    this.isDecimalMode = false;
  }

  /**
   * คำนวณผลลัพธ์
   */
  calculateResult(): number | null {
    const prev = this.previousValue;
    const current = this.currentValue;

    let result: number;

    try {
      switch (this.operator) {
        case '+':
          result = prev + current;
          break;
        case '-':
          result = prev - current;
          break;
        case '*':
          result = prev * current;
          break;
        case '/':
          if (current === 0) {
            this.showError('Cannot divide by zero');
            return null;
          }
          result = prev / current;
          break;
        default:
          return current;
      }

      // ตรวจสอบผลลัพธ์ที่ไม่ถูกต้อง
      if (!isFinite(result)) {
        this.showError('Invalid operation');
        return null;
      }

      return result;
    } catch (error) {
      this.showError('Calculation error');
      return null;
    }
  }

  /**
   * กดปุ่ม equals
   */
  calculate() {
    // ตรวจสอบว่ามี operator และไม่มี error
    if (!this.canCalculate()) {
      return;
    }

    // คำนวณผลลัพธ์
    const result = this.calculateResult();

    if (result !== null) {
      // เพิ่มประวัติ
      this.addToHistory(
        `${this.previousValue} ${this.getOperatorDisplay()} ${this.currentValue} = ${result}`
      );

      // อัปเดต state
      this.currentValue = result;
      this.display = this.formatNumber(result);
      this.previousValue = 0;
      this.operator = null;
      this.waitingForNewValue = true;
      this.isDecimalMode = false;
    }
  }

  // ===== Clear Methods =====

  /**
   * Clear ทั้งหมด
   */
  clear(): void {
    this.display = '0';
    this.previousValue = 0;
    this.currentValue = 0;
    this.operator = null;
    this.waitingForNewValue = false;
    this.isDecimalMode = false;
    this.clearError();
  }

  /**
   * Clear Entry (CE)
   */
  clearEntry(): void {
    this.display = '0';
    this.currentValue = 0;
    this.waitingForNewValue = false;
    this.isDecimalMode = false;
    this.clearError();
  }

  /**
   * Backspace
   */
  backspace(): void {
    if (this.errorMessage || this.waitingForNewValue) {
      this.clearEntry();
      return;
    }

    if (this.display.length > 1) {
      const newDisplay = this.display.slice(0, -1);
      this.display = newDisplay;

      // ตรวจสอบจุดทศนิยม
      if (this.display.indexOf('.') === -1) {
        this.isDecimalMode = false;
      }
    } else {
      this.display = '0';
      this.isDecimalMode = false;
    }

    this.currentValue = parseFloat(this.display) || 0;
  }

  // ===== Advanced Math Functions =====

  /**
   * คำนวณ square root
   */
  sqrt(): void {
    if (this.errorMessage) {
      this.clearError();
    }

    const value = this.currentValue;

    if (value < 0) {
      this.showError('Invalid input for square root');
      return;
    }

    const result = Math.sqrt(value);
    this.display = this.formatNumber(result);
    this.currentValue = result;
    this.addToHistory(`√${value} = ${result}`);
    this.waitingForNewValue = true;
  }

  /**
   * คำนวณ percentage
   */
  percentage(): void {
    if (this.errorMessage) {
      this.clearError();
    }

    const result = this.currentValue / 100;
    this.display = this.formatNumber(result);
    this.currentValue = result;
    this.addToHistory(`${this.currentValue * 100}% = ${result}`);
    this.waitingForNewValue = true;
  }

  /**
   * เปลี่ยนเครื่องหมาย +/-
   */
  toggleSign(): void {
    if (this.errorMessage) {
      this.clearError();
    }

    if (this.currentValue !== 0) {
      this.currentValue = -this.currentValue;
      this.display = this.formatNumber(this.currentValue);
    }
  }

  // ===== Memory Functions =====

  /**
   * Memory Clear
   */
  memoryClear(): void {
    this.memory = 0;
  }

  /**
   * Memory Recall
   */
  memoryRecall(): void {
    this.display = this.formatNumber(this.memory);
    this.currentValue = this.memory;
    this.waitingForNewValue = true;
    this.isDecimalMode = false;
  }

  /**
   * Memory Store
   */
  memoryStore(): void {
    this.memory = this.currentValue;
  }

  /**
   * Memory Add
   */
  memoryAdd(): void {
    this.memory += this.currentValue;
  }

  /**
   * Memory Subtract
   */
  memorySubtract(): void {
    this.memory -= this.currentValue;
  }

  // ===== Scientific Functions =====

  /**
   * Toggle Scientific Mode
   */
  toggleScientificMode(): void {
    this.isScientificMode = !this.isScientificMode;
  }

  /**
   * Sin function
   */
  sin(): void {
    if (!this.isScientificMode) return;

    const result = Math.sin((this.currentValue * Math.PI) / 180); // Convert to radians
    this.display = this.formatNumber(result);
    this.currentValue = result;
    this.addToHistory(`sin(${this.currentValue}) = ${result}`);
    this.waitingForNewValue = true;
  }

  /**
   * Cos function
   */
  cos(): void {
    if (!this.isScientificMode) return;

    const result = Math.cos((this.currentValue * Math.PI) / 180);
    this.display = this.formatNumber(result);
    this.currentValue = result;
    this.addToHistory(`cos(${this.currentValue}) = ${result}`);
    this.waitingForNewValue = true;
  }

  /**
   * Power function (x^2)
   */
  power(): void {
    const value = this.currentValue;
    const result = Math.pow(value, 2);
    this.display = this.formatNumber(result);
    this.currentValue = result;
    this.addToHistory(`${value}² = ${result}`);
    this.waitingForNewValue = true;
  }

  // ===== History Management =====

  /**
   * เพิ่มประวัติการคำนวณ
   */
  addToHistory(operation: string): void {
    this.history.unshift(operation);

    // เก็บประวัติไว้แค่ 10 รายการล่าสุด
    if (this.history.length > 10) {
      this.history = this.history.slice(0, 10);
    }
  }

  /**
   * ล้างประวัติ
   */
  clearHistory(): void {
    this.history = [];
  }

  // ===== Error Handling =====

  /**
   * แสดงข้อผิดพลาด
   */
  private showError(message: string): void {
    this.errorMessage = message;
    this.display = 'Error';
  }

  /**
   * ล้างข้อผิดพลาด
   */
  private clearError(): void {
    this.errorMessage = '';
    if (this.display === 'Error') {
      this.clear();
    }
  }

  // ===== Utility Methods =====

  /**
   * จัดรูปแบบตัวเลข
   */
  private formatNumber(num: number): string {
    if (num === 0) return '0';

    // ตรวจสอบจำนวนทศนิยม
    const str = num.toString();

    // ถ้าเป็นจำนวนเต็ม
    if (num % 1 === 0) {
      return num.toLocaleString();
    }

    // ถ้ามีทศนิยม จำกัดที่ 8 ตำแหน่ง
    return parseFloat(num.toFixed(8)).toString();
  }

  /**
   * ตรวจสอบว่ามี memory หรือไม่
   */
  hasMemory(): boolean {
    return this.memory !== 0;
  }

  /**
   * ตรวจสอบว่าสามารถกด equals ได้หรือไม่
   */
  canCalculate(): boolean {
    return this.operator !== null && !this.waitingForNewValue && !this.errorMessage;
  }

  /**
   * Get current operator display
   */
  getOperatorDisplay(): string {
    if (!this.operator) return '';

    switch (this.operator) {
      case '+':
        return '+';
      case '-':
        return '-';
      case '*':
        return '×';
      case '/':
        return '÷';
      default:
        return '';
    }
  }
}
