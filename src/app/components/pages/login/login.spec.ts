import 'zone.js'; // เพิ่มบรรทัดนี้ก่อน
import 'zone.js/testing'; // บรรทัดเดิม
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Login } from './login';

describe('หน้าเข้าสู่ระบบ (Login Component)', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // สร้าง mock router
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Login, ReactiveFormsModule],
      providers: [{ provide: Router, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  // ========================================
  // 🟢 ระดับ 1: การทดสอบพื้นฐาน
  // ========================================
  describe('🟢 ระดับ 1: การทดสอบพื้นฐาน', () => {
    it('ควรสร้างคอมโพเนนต์ได้สำเร็จ', () => {
      expect(component).toBeTruthy();
    });

    it('ควรมีฟอร์มล็อกอินที่ถูกต้อง', () => {
      expect(component.loginForm).toBeDefined();
      expect(component.loginForm.get('username')).toBeTruthy();
      expect(component.loginForm.get('password')).toBeTruthy();
      expect(component.loginForm.get('rememberMe')).toBeTruthy();
    });

    it('ควรมีค่าเริ่มต้นของฟอร์มที่ถูกต้อง', () => {
      expect(component.loginForm.get('username')?.value).toBe('ๅ/-');
      expect(component.loginForm.get('password')?.value).toBe('');
      expect(component.loginForm.get('rememberMe')?.value).toBe(false);
    });

    it('ควรมีตัวแปร version เป็นข้อความว่าง', () => {
      expect(component.version).toBe('');
    });

    it('ควรมีช่องกรอกข้อมูลทั้งหมด 3 ช่อง', () => {
      const allInput = fixture.nativeElement.querySelectorAll('input');
      expect(allInput.length).toBe(3);
    });

    it('ควรมีช่องเลือก "จดจำชื่อผู้ใช้งาน" 1 ช่อง', () => {
      const inputCheckbox = fixture.nativeElement.querySelectorAll('input[type="checkbox"]');
      expect(inputCheckbox.length).toBe(1);
    });

    it('ควรมีปุ่มส่งข้อมูล 1 ปุ่ม', () => {
      const button = fixture.nativeElement.querySelectorAll('button');
      expect(button.length).toBe(1);
    });
  });

  // ========================================
  // 🟡 ระดับ 2: การทดสอบองค์ประกอบของหน้า
  // ========================================
  describe('🟡 ระดับ 2: การทดสอบองค์ประกอบของหน้า', () => {
    describe('การแสดงผลส่วนต่างๆ', () => {
      it('ควรแสดงโลโก้ของระบบ', () => {
        const logoImg = fixture.debugElement.query(By.css('img[alt="Logo"]'));
        expect(logoImg).toBeTruthy();
        expect(logoImg.nativeElement.src).toContain('assets/images/logo-system.png');
        expect(logoImg.nativeElement.style.maxHeight).toBe('100px');
      });

      it('ควรแสดงหัวข้อ "เข้าสู่ระบบ"', () => {
        const title = fixture.debugElement.query(By.css('h2.login'));
        expect(title).toBeTruthy();
        expect(title.nativeElement.textContent.trim()).toBe('เข้าสู่ระบบ');
      });

      it('ควรแสดงป้ายกำกับฟิลด์ที่ถูกต้อง', () => {
        const usernameLabel = fixture.debugElement.query(By.css('label[for="username"]'));
        const passwordLabel = fixture.debugElement.query(By.css('label[for="password"]'));
        const rememberMeLabel = fixture.debugElement.query(By.css('label[for="rememberMe"]'));

        expect(usernameLabel.nativeElement.textContent.trim()).toBe('ชื่อผู้ใช้');
        expect(passwordLabel.nativeElement.textContent.trim()).toBe('รหัสผ่าน');
        expect(rememberMeLabel.nativeElement.textContent.trim()).toBe('จดจำชื่อผู้ใช้งาน');
      });

      it('ควรแสดงลิงก์ "ลืมรหัสผ่าน?"', () => {
        const forgotPasswordLink = fixture.debugElement.query(
          By.css('a[routerLink="/auth/forgot-password"]')
        );
        expect(forgotPasswordLink).toBeTruthy();
        expect(forgotPasswordLink.nativeElement.textContent.trim()).toBe('ลืมรหัสผ่าน?');
      });

      it('ควรแสดงเวอร์ชันของระบบ', () => {
        const versionElement = fixture.debugElement.query(By.css('.text-version'));
        expect(versionElement).toBeTruthy();
      });

      it('ควรแสดงไอคอนในช่องกรอกข้อมูล', () => {
        const userIcon = fixture.debugElement.query(By.css('.icon-user'));
        const keyIcon = fixture.debugElement.query(By.css('.icon-key'));

        expect(userIcon).toBeTruthy();
        expect(keyIcon).toBeTruthy();
      });
    });

    describe('ค่าเริ่มต้นของฟอร์ม', () => {
      it('ช่องชื่อผู้ใช้ควรว่างเปล่าในตอนเริ่มต้น', () => {
        const usernameInput = fixture.nativeElement.querySelector('#username');
        expect(usernameInput.value).toBe('');
        expect(component.loginForm.get('username')?.value).toBe('');
      });

      it('ช่องรหัสผ่านควรว่างเปล่าในตอนเริ่มต้น', () => {
        const passwordInput = fixture.nativeElement.querySelector('#password');
        expect(passwordInput.value).toBe('');
        expect(component.loginForm.get('password')?.value).toBe('');
      });

      it('ช่องจดจำชื่อผู้ใช้ควรไม่ถูกเลือกในตอนเริ่มต้น', () => {
        const rememberMeInput = fixture.nativeElement.querySelector('#rememberMe');
        expect(rememberMeInput.checked).toBe(false);
        expect(component.loginForm.get('rememberMe')?.value).toBe(false);
      });
    });

    describe('สถานะของปุ่มส่งข้อมูล', () => {
      it('ควรปิดการใช้งานปุ่มส่งเมื่อชื่อผู้ใช้ว่าง', () => {
        component.loginForm.get('username')?.setValue('');
        component.loginForm.get('password')?.setValue('validpass123');
        fixture.detectChanges();

        const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
        expect(submitButton.disabled).toBe(true);
      });

      it('ควรปิดการใช้งานปุ่มส่งเมื่อรหัสผ่านว่าง', () => {
        component.loginForm.get('username')?.setValue('testuser');
        component.loginForm.get('password')?.setValue('');
        fixture.detectChanges();

        const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
        expect(submitButton.disabled).toBe(true);
      });

      it('ควรปิดการใช้งานปุ่มส่งเมื่อรหัสผ่านสั้นเกินไป', () => {
        component.loginForm.get('username')?.setValue('testuser');
        component.loginForm.get('password')?.setValue('12345'); // น้อยกว่า 6 ตัว
        fixture.detectChanges();

        const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
        expect(submitButton.disabled).toBe(true);
      });

      it('ควรเปิดการใช้งานปุ่มส่งเมื่อข้อมูลถูกต้องครบถ้วน', () => {
        component.loginForm.get('username')?.setValue('testuser');
        component.loginForm.get('password')?.setValue('validpass123');
        fixture.detectChanges();

        const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
        expect(submitButton.disabled).toBe(false);
      });
    });
  });

  // ========================================
  // 🔴 ระดับ 3: การทดสอบการตรวจสอบข้อมูล
  // ========================================
  describe('🔴 ระดับ 3: การทดสอบการตรวจสอบข้อมูล', () => {
    describe('การตรวจสอบพื้นฐาน', () => {
      it('ควรไม่ถูกต้องเมื่อชื่อผู้ใช้ว่าง', () => {
        component.loginForm.get('username')?.setValue('');
        component.loginForm.get('username')?.markAsTouched();

        expect(component.loginForm.get('username')?.invalid).toBe(true);
        expect(component.isFieldInvalid('username')).toBe(true);
      });

      it('ควรไม่ถูกต้องเมื่อรหัสผ่านว่าง', () => {
        component.loginForm.get('password')?.setValue('');
        component.loginForm.get('password')?.markAsTouched();

        expect(component.loginForm.get('password')?.invalid).toBe(true);
        expect(component.isFieldInvalid('password')).toBe(true);
      });

      it('ควรไม่ถูกต้องเมื่อรหัสผ่านสั้นกว่า 6 ตัวอักษร', () => {
        component.loginForm.get('password')?.setValue('12345');
        component.loginForm.get('password')?.markAsTouched();

        expect(component.loginForm.get('password')?.invalid).toBe(true);
        expect(component.isFieldInvalid('password')).toBe(true);
      });

      it('ควรถูกต้องเมื่อกรอกข้อมูลครบถ้วนและถูกต้อง', () => {
        component.loginForm.setValue({
          username: 'testuser',
          password: 'validpass123',
          rememberMe: false,
        });

        expect(component.loginForm.valid).toBe(true);
        expect(component.isFieldInvalid('username')).toBe(false);
        expect(component.isFieldInvalid('password')).toBe(false);
      });
    });

    describe('การแสดงข้อความแสดงข้อผิดพลาด', () => {
      it('ควรแสดงข้อความผิดพลาดเมื่อคลิกช่องชื่อผู้ใช้แล้วไม่กรอกข้อมูล', () => {
        const usernameInput = fixture.nativeElement.querySelector('#username');

        // จำลองการคลิกเข้าไปและออกมาโดยไม่กรอกข้อมูล
        usernameInput.dispatchEvent(new Event('focus'));
        usernameInput.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        expect(usernameInput.classList.contains('is-invalid')).toBe(true);

        const errorMessage = fixture.nativeElement.querySelector('.invalid-feedback');
        expect(errorMessage).toBeTruthy();
        expect(errorMessage.textContent.trim()).toBe('กรุณากรอกชื่อผู้ใช้');
      });

      it('ควรแสดงข้อความผิดพลาดเมื่อคลิกช่องรหัสผ่านแล้วไม่กรอกข้อมูล', () => {
        const passwordInput = fixture.nativeElement.querySelector('#password');

        passwordInput.dispatchEvent(new Event('focus'));
        passwordInput.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        expect(passwordInput.classList.contains('is-invalid')).toBe(true);

        const errorMessages = fixture.nativeElement.querySelectorAll('.invalid-feedback');
        expect(errorMessages[1]).toBeTruthy();
        expect(errorMessages[1].textContent.trim()).toBe('กรุณากรอกรหัสผ่าน');
      });

      it('ควรแสดงข้อความผิดพลาดเมื่อรหัสผ่านสั้นเกินไป', () => {
        const passwordInput = fixture.nativeElement.querySelector('#password');

        // กรอกรหัสผ่านสั้นกว่า 6 ตัว
        component.loginForm.get('password')?.setValue('123');
        component.loginForm.get('password')?.markAsTouched();
        fixture.detectChanges();

        expect(passwordInput.classList.contains('is-invalid')).toBe(true);
      });
    });

    describe('การกู้คืนจากข้อผิดพลาด', () => {
      it('ควรซ่อนข้อผิดพลาดเมื่อแก้ไขชื่อผู้ใช้ให้ถูกต้อง', () => {
        // สร้างข้อผิดพลาดก่อน
        const usernameInput = fixture.nativeElement.querySelector('#username');
        usernameInput.dispatchEvent(new Event('focus'));
        usernameInput.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        expect(usernameInput.classList.contains('is-invalid')).toBe(true);

        // แก้ไขโดยใส่ข้อมูลที่ถูกต้อง
        component.loginForm.get('username')?.setValue('validuser');
        fixture.detectChanges();

        expect(usernameInput.classList.contains('is-invalid')).toBe(false);
        expect(component.isFieldInvalid('username')).toBe(false);
      });

      it('ควรซ่อนข้อผิดพลาดเมื่อแก้ไขรหัสผ่านให้ถูกต้อง', () => {
        // สร้างข้อผิดพลาดก่อน
        const passwordInput = fixture.nativeElement.querySelector('#password');
        passwordInput.dispatchEvent(new Event('focus'));
        passwordInput.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        expect(passwordInput.classList.contains('is-invalid')).toBe(true);

        // แก้ไขโดยใส่รหัสผ่านที่ถูกต้อง
        component.loginForm.get('password')?.setValue('validpass123');
        fixture.detectChanges();

        expect(passwordInput.classList.contains('is-invalid')).toBe(false);
        expect(component.isFieldInvalid('password')).toBe(false);
      });
    });
  });

  // ========================================
  // 🔥 ระดับ 4: การทดสอบการทำงานของฟังก์ชัน
  // ========================================
  describe('🔥 ระดับ 4: การทดสอบการทำงานของฟังก์ชัน', () => {
    describe('ฟังก์ชัน isFieldInvalid', () => {
      it('ควรคืนค่า true เมื่อฟิลด์ไม่ถูกต้องและถูกแตะ', () => {
        component.loginForm.get('username')?.setValue('');
        component.loginForm.get('username')?.markAsTouched();

        expect(component.isFieldInvalid('username')).toBe(true);
      });

      it('ควรคืนค่า false เมื่อฟิลด์ถูกต้อง', () => {
        component.loginForm.get('username')?.setValue('validuser');
        component.loginForm.get('username')?.markAsTouched();

        expect(component.isFieldInvalid('username')).toBe(false);
      });

      it('ควรคืนค่า false เมื่อฟิลด์ไม่ถูกต้องแต่ยังไม่ถูกแตะ', () => {
        component.loginForm.get('username')?.setValue('');
        // ไม่ mark as touched

        expect(component.isFieldInvalid('username')).toBe(false);
      });

      it('ควรจัดการกับฟิลด์ที่ไม่มีอยู่', () => {
        expect(component.isFieldInvalid('nonExistentField')).toBe(false);
      });
    });

    describe('ฟังก์ชัน onSubmit', () => {
      it('ควรเรียกใช้ onSubmit เมื่อส่งฟอร์มที่ถูกต้อง', () => {
        spyOn(component, 'onSubmit');

        component.loginForm.setValue({
          username: 'testuser',
          password: 'validpass123',
          rememberMe: false,
        });
        fixture.detectChanges();

        const form = fixture.nativeElement.querySelector('form');
        form.dispatchEvent(new Event('submit'));

        expect(component.onSubmit).toHaveBeenCalled();
      });

      it('ควร markAllAsTouched เมื่อฟอร์มไม่ถูกต้อง', () => {
        spyOn(component.loginForm, 'markAllAsTouched');

        // ทำให้ฟอร์มไม่ถูกต้อง
        component.loginForm.setValue({
          username: '',
          password: '',
          rememberMe: false,
        });

        component.onSubmit();

        expect(component.loginForm.markAllAsTouched).toHaveBeenCalled();
      });

      it('ควรแสดงข้อผิดพลาดทุกฟิลด์เมื่อส่งฟอร์มที่ไม่ถูกต้อง', () => {
        // ทำให้ฟอร์มไม่ถูกต้อง
        component.loginForm.setValue({
          username: '',
          password: '123', // สั้นเกินไป
          rememberMe: false,
        });

        component.onSubmit();
        fixture.detectChanges();

        expect(component.isFieldInvalid('username')).toBe(true);
        expect(component.isFieldInvalid('password')).toBe(true);
      });
    });

    describe('การทำงานร่วมกันของ UI และ Logic', () => {
      it('ควรส่งข้อมูลที่ถูกต้องไปยัง onSubmit', () => {
        spyOn(component, 'onSubmit');

        const formData = {
          username: 'testuser',
          password: 'validpass123',
          rememberMe: true,
        };

        component.loginForm.setValue(formData);
        fixture.detectChanges();

        const form = fixture.nativeElement.querySelector('form');
        form.dispatchEvent(new Event('submit'));

        expect(component.onSubmit).toHaveBeenCalled();
        expect(component.loginForm.value).toEqual(formData);
      });

      it('ควรเปลี่ยนสถานะ checkbox rememberMe ได้', () => {
        const checkboxInput = fixture.nativeElement.querySelector('#rememberMe');

        // เริ่มต้นควรเป็น false
        expect(component.loginForm.get('rememberMe')?.value).toBe(false);

        // คลิกเพื่อเปลี่ยนเป็น true
        checkboxInput.click();
        fixture.detectChanges();

        expect(component.loginForm.get('rememberMe')?.value).toBe(true);
      });

      it('ควรอัพเดทตำแหน่งไอคอนเมื่อฟิลด์มีข้อผิดพลาด', () => {
        // ทำให้ username field มี error
        component.loginForm.get('username')?.setValue('');
        component.loginForm.get('username')?.markAsTouched();
        fixture.detectChanges();

        const userIcon = fixture.debugElement.query(By.css('.icon-user'));
        // เช็คว่า style.top ถูกตั้งค่าเมื่อมี error
        expect(userIcon.nativeElement.style.top).toBeTruthy();
      });
    });
  });

  // ========================================
  // 💎 ระดับ 5: การทดสอบขั้นสูง (Edge Cases)
  // ========================================
  describe('💎 ระดับ 5: การทดสอบขั้นสูง', () => {
    describe('กรณีพิเศษ', () => {
      it('ควรจัดการกับข้อมูลที่มีช่องว่างนำหน้าและตามหลัง', () => {
        component.loginForm.get('username')?.setValue('  testuser  ');
        component.loginForm.get('password')?.setValue('  validpass123  ');

        expect(component.loginForm.get('username')?.value).toBe('  testuser  ');
        expect(component.loginForm.get('password')?.value).toBe('  validpass123  ');
      });

      it('ควรจัดการกับอักขระพิเศษในชื่อผู้ใช้', () => {
        const specialChars = ['@', '#', '$', '%', '&', '*'];

        specialChars.forEach((char) => {
          component.loginForm.get('username')?.setValue(`test${char}user`);
          expect(component.loginForm.get('username')?.valid).toBe(true);
        });
      });

      it('ควรยอมรับรหัสผ่านที่มีความยาวมาก', () => {
        const longPassword = 'a'.repeat(100); // รหัสผ่านยาว 100 ตัว
        component.loginForm.get('password')?.setValue(longPassword);

        expect(component.loginForm.get('password')?.valid).toBe(true);
      });
    });

    describe('การทดสอบประสิทธิภาพ', () => {
      it('ควรจัดการกับการเปลี่ยนค่าฟิลด์หลายครั้งติดกัน', () => {
        const iterations = 100;

        for (let i = 0; i < iterations; i++) {
          component.loginForm.get('username')?.setValue(`user${i}`);
          component.loginForm.get('password')?.setValue(`pass${i}123456`);
        }

        expect(component.loginForm.get('username')?.value).toBe(`user${iterations - 1}`);
        expect(component.loginForm.get('password')?.value).toBe(`pass${iterations - 1}123456`);
        expect(component.loginForm.valid).toBe(true);
      });

      it('ควรจัดการกับการเรียก onSubmit หลายครั้งติดกัน', () => {
        spyOn(component, 'onSubmit').and.callThrough();
        spyOn(component.loginForm, 'markAllAsTouched');

        // ทำให้ฟอร์มไม่ถูกต้อง
        component.loginForm.setValue({
          username: '',
          password: '',
          rememberMe: false,
        });

        // เรียก onSubmit หลายครั้ง
        for (let i = 0; i < 5; i++) {
          component.onSubmit();
        }

        expect(component.onSubmit).toHaveBeenCalledTimes(5);
        expect(component.loginForm.markAllAsTouched).toHaveBeenCalledTimes(5);
      });
    });
  });
});
