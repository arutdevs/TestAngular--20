import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from './login';

describe('คอมโพเนนต์ Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Create mock router
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, Login],
      providers: [FormBuilder, { provide: Router, useValue: mockRouter }],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Reset spy calls between tests
    mockRouter.navigate.calls.reset();
  });

  // ===== 1. การตั้งค่าและการเริ่มต้นคอมโพเนนต์ =====
  describe('การตั้งค่าและเริ่มต้นคอมโพเนนต์', () => {
    it('ควรสร้างคอมโพเนนต์สำเร็จ', () => {
      expect(component).toBeTruthy();
    });

    it('ควรเริ่มต้นเวอร์ชันเป็นสตริงว่าง', () => {
      expect(component.version).toBe('');
    });

    it('ควรเริ่มต้น loginForm ด้วยโครงสร้างและค่าเริ่มต้นที่ถูกต้อง', () => {
      expect(component.loginForm.get('username')?.value).toBe('');
      expect(component.loginForm.get('password')?.value).toBe('');
      expect(component.loginForm.get('rememberMe')?.value).toBe(false);
    });

    it('ควรมี form controls ที่จำเป็นครบถ้วน', () => {
      expect(component.loginForm.get('username')).toBeTruthy();
      expect(component.loginForm.get('password')).toBeTruthy();
      expect(component.loginForm.get('rememberMe')).toBeTruthy();
    });
  });

  // ===== 2. กฎการตรวจสอบความถูกต้องของฟอร์ม =====
  describe('กฎการตรวจสอบฟอร์ม', () => {
    describe('ตรวจสอบชื่อผู้ใช้', () => {
      it('ควรต้องการชื่อผู้ใช้', () => {
        const usernameControl = component.loginForm.get('username');
        usernameControl?.setValue('');
        usernameControl?.markAsTouched();
        expect(usernameControl?.hasError('required')).toBeTruthy();
      });

      it('ควรยอมรับชื่อผู้ใช้ที่ไม่เป็นค่าว่าง', () => {
        const usernameControl = component.loginForm.get('username');
        usernameControl?.setValue('testuser');
        expect(usernameControl?.hasError('required')).toBeFalsy();
        expect(usernameControl?.valid).toBeTruthy();
      });

      it('ควรยอมรับชื่อผู้ใช้ที่มีอักขระพิเศษ', () => {
        const usernameControl = component.loginForm.get('username');
        usernameControl?.setValue('user@domain.com');
        expect(usernameControl?.valid).toBeTruthy();
      });
    });

    describe('ตรวจสอบรหัสผ่าน', () => {
      it('ควรต้องการรหัสผ่าน', () => {
        const passwordControl = component.loginForm.get('password');
        passwordControl?.setValue('');
        passwordControl?.markAsTouched();
        expect(passwordControl?.hasError('required')).toBeTruthy();
      });

      it('ควรต้องการอย่างน้อย 6 ตัวอักษร', () => {
        const passwordControl = component.loginForm.get('password');
        passwordControl?.setValue('12345');
        expect(passwordControl?.hasError('minlength')).toBeTruthy();
      });

      it('ควรยอมรับรหัสผ่านที่มีพอดี 6 ตัวอักษร', () => {
        const passwordControl = component.loginForm.get('password');
        passwordControl?.setValue('123456');
        expect(passwordControl?.hasError('minlength')).toBeFalsy();
        expect(passwordControl?.hasError('required')).toBeFalsy();
        expect(passwordControl?.valid).toBeTruthy();
      });

      it('ควรยอมรับรหัสผ่านที่ยาวกว่า 6 ตัวอักษร', () => {
        const passwordControl = component.loginForm.get('password');
        passwordControl?.setValue('password123');
        expect(passwordControl?.valid).toBeTruthy();
      });
    });

    describe('ตรวจสอบจำฉันไว้', () => {
      it('ไม่ควรมีกฎการตรวจสอบใดๆ', () => {
        const rememberMeControl = component.loginForm.get('rememberMe');

        rememberMeControl?.setValue(false);
        expect(rememberMeControl?.valid).toBeTruthy();

        rememberMeControl?.setValue(true);
        expect(rememberMeControl?.valid).toBeTruthy();
      });
    });

    describe('ตรวจสอบฟอร์มโดยรวม', () => {
      it('ควรไม่ถูกต้องเมื่อช่องทั้งหมดว่างเปล่า', () => {
        component.loginForm.patchValue({
          username: '',
          password: '',
          rememberMe: false,
        });
        expect(component.loginForm.valid).toBeFalsy();
      });

      it('ควรไม่ถูกต้องเมื่อกรอกเฉพาะชื่อผู้ใช้', () => {
        component.loginForm.patchValue({
          username: 'testuser',
          password: '',
          rememberMe: false,
        });
        expect(component.loginForm.valid).toBeFalsy();
      });

      it('ควรไม่ถูกต้องเมื่อกรอกเฉพาะรหัสผ่าน', () => {
        component.loginForm.patchValue({
          username: '',
          password: '123456',
          rememberMe: false,
        });
        expect(component.loginForm.valid).toBeFalsy();
      });

      it('ควรถูกต้องเมื่อกรอกชื่อผู้ใช้และรหัสผ่านถูกต้องครบถ้วน', () => {
        component.loginForm.patchValue({
          username: 'testuser',
          password: '123456',
          rememberMe: false,
        });
        expect(component.loginForm.valid).toBeTruthy();
      });
    });
  });

  // ===== 3. การตรวจสอบสถานะความถูกต้อง =====
  describe('การตรวจสอบสถานะความถูกต้อง (isFieldInvalid)', () => {
    describe('การตรวจจับสถานะของช่อง', () => {
      it('ควรคืนค่า false สำหรับช่องที่ถูกต้องโดยไม่คำนึงถึงสถานะการสัมผัส', () => {
        component.loginForm.get('username')?.setValue('testuser');
        expect(component.isFieldInvalid('username')).toBeFalsy();

        component.loginForm.get('username')?.markAsTouched();
        expect(component.isFieldInvalid('username')).toBeFalsy();
      });

      it('ควรคืนค่า false สำหรับช่องที่ไม่ถูกต้องแต่ยังไม่ได้สัมผัส', () => {
        component.loginForm.get('username')?.setValue('');
        // ช่องไม่ถูกต้องแต่ยังไม่ได้สัมผัสหรือแก้ไข
        expect(component.isFieldInvalid('username')).toBeFalsy();
      });

      it('ควรคืนค่า true สำหรับช่องที่ไม่ถูกต้องและได้สัมผัสแล้ว', () => {
        const usernameControl = component.loginForm.get('username');
        usernameControl?.setValue('');
        usernameControl?.markAsTouched();
        expect(component.isFieldInvalid('username')).toBeTruthy();
      });

      it('ควรคืนค่า true สำหรับช่องที่ไม่ถูกต้องและมีการแก้ไข', () => {
        const usernameControl = component.loginForm.get('username');
        // ทำให้ช่องมีการแก้ไขก่อนโดยจำลองการโต้ตอบของผู้ใช้
        usernameControl?.setValue('test');
        usernameControl?.updateValueAndValidity();
        usernameControl?.markAsDirty();

        // จากนั้นทำให้ไม่ถูกต้อง
        usernameControl?.setValue('');
        usernameControl?.updateValueAndValidity();

        expect(component.isFieldInvalid('username')).toBeTruthy();
      });
    });

    describe('กรณีขอบเขตสำหรับการตรวจสอบช่อง', () => {
      it('ควรจัดการช่องที่ไม่มีอยู่อย่างเหมาะสม', () => {
        expect(component.isFieldInvalid('nonExistentField')).toBeFalsy();
      });

      it('ควรทำงานถูกต้องสำหรับช่องฟอร์มทั้งหมด', () => {
        const fields = ['username', 'password', 'rememberMe'];

        fields.forEach((field) => {
          const result = component.isFieldInvalid(field);
          expect(typeof result).toBe('boolean');
        });
      });
    });
  });

  // ===== 4. พฤติกรรมการส่งฟอร์ม =====
  describe('พฤติกรรมการส่งฟอร์ม (onSubmit)', () => {
    describe('การส่งฟอร์มที่ไม่ถูกต้อง', () => {
      it('ควรทำเครื่องหมายช่องทั้งหมดว่าได้สัมผัสแล้วเมื่อฟอร์มไม่ถูกต้อง', () => {
        component.loginForm.patchValue({
          username: '',
          password: '',
          rememberMe: false,
        });

        spyOn(component.loginForm, 'markAllAsTouched');
        component.onSubmit();

        expect(component.loginForm.markAllAsTouched).toHaveBeenCalled();
      });

      it('ไม่ควรนำทางเมื่อฟอร์มไม่ถูกต้อง', () => {
        component.loginForm.patchValue({
          username: '',
          password: 'short',
          rememberMe: false,
        });

        component.onSubmit();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
      });

      it('ควรกลับเร็วเมื่อฟอร์มไม่ถูกต้อง', () => {
        component.loginForm.patchValue({
          username: 'testuser',
          password: '', // ไม่ถูกต้อง
          rememberMe: false,
        });

        component.onSubmit();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
      });
    });

    describe('การส่งฟอร์มที่ถูกต้อง', () => {
      it('ควรนำทางไปหน้า index เมื่อฟอร์มถูกต้อง', () => {
        component.loginForm.patchValue({
          username: 'testuser',
          password: '123456',
          rememberMe: false,
        });

        component.onSubmit();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/index']);
      });

      it('ควรนำทางโดยไม่คำนึงถึงสถานะของจดจำฉัน', () => {
        // ทดสอบด้วย rememberMe = true
        component.loginForm.patchValue({
          username: 'testuser',
          password: '123456',
          rememberMe: true,
        });

        component.onSubmit();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/index']);

        // รีเซ็ต spy สำหรับการทดสอบครั้งต่อไป
        mockRouter.navigate.calls.reset();

        // ทดสอบด้วย rememberMe = false
        component.loginForm.patchValue({
          username: 'testuser2',
          password: 'password123',
          rememberMe: false,
        });

        component.onSubmit();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/index']);
      });
    });

    describe('สถานการณ์ไม่ถูกต้องเฉพาะ', () => {
      it('ไม่ควรส่งเมื่อขาดชื่อผู้ใช้', () => {
        component.loginForm.patchValue({
          username: '',
          password: '123456',
          rememberMe: false,
        });

        component.onSubmit();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
      });

      it('ไม่ควรส่งเมื่อขาดรหัสผ่าน', () => {
        component.loginForm.patchValue({
          username: 'testuser',
          password: '',
          rememberMe: false,
        });

        component.onSubmit();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
      });

      it('ไม่ควรส่งเมื่อรหัสผ่านสั้นเกินไป', () => {
        component.loginForm.patchValue({
          username: 'testuser',
          password: '12345',
          rememberMe: false,
        });

        component.onSubmit();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
      });
    });
  });

  // ===== 5. สถานการณ์การโต้ตอบของผู้ใช้ =====
  describe('สถานการณ์การโต้ตอบของผู้ใช้', () => {
    describe('เวิร์กโฟลว์ผู้ใช้แบบสมบูรณ์', () => {
      it('ควรจัดการกระบวนการล็อกอินแบบสมบูรณ์จากว่างเปล่าถึงการส่งที่ถูกต้อง', () => {
        // เริ่มต้นด้วยฟอร์มว่าง - ไม่ควรส่ง
        component.onSubmit();
        expect(mockRouter.navigate).not.toHaveBeenCalled();

        // กรอกเฉพาะชื่อผู้ใช้ - ไม่ควรส่ง
        component.loginForm.get('username')?.setValue('testuser');
        component.onSubmit();
        expect(mockRouter.navigate).not.toHaveBeenCalled();

        // กรอกรหัสผ่านความยาวไม่ถูกต้อง - ไม่ควรส่ง
        component.loginForm.get('password')?.setValue('123');
        component.onSubmit();
        expect(mockRouter.navigate).not.toHaveBeenCalled();

        // กรอกรหัสผ่านที่ถูกต้อง - ควรส่งสำเร็จ
        component.loginForm.get('password')?.setValue('123456');
        component.onSubmit();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/index']);
      });

      it('ควรรักษาสถานะฟอร์มระหว่างการแก้ไขของผู้ใช้', () => {
        // ผู้ใช้ใส่รหัสผ่านไม่ถูกต้อง
        component.loginForm.patchValue({
          username: 'user',
          password: 'short',
        });
        expect(component.loginForm.invalid).toBeTruthy();

        // ผู้ใช้แก้ไขรหัสผ่าน
        component.loginForm.get('password')?.setValue('longpassword');
        expect(component.loginForm.valid).toBeTruthy();

        // ผู้ใช้สามารถส่งได้
        component.onSubmit();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/index']);
      });
    });

    describe('สถานะการโต้ตอบของช่อง', () => {
      it('ควรแสดงข้อผิดพลาดการตรวจสอบหลังจากการโต้ตอบของผู้ใช้เท่านั้น', () => {
        // ก่อนการโต้ตอบใดๆ - ไม่แสดงข้อผิดพลาด
        expect(component.isFieldInvalid('username')).toBeFalsy();
        expect(component.isFieldInvalid('password')).toBeFalsy();

        // หลังจากสัมผัสช่อง - ควรแสดงข้อผิดพลาดสำหรับช่องที่ไม่ถูกต้อง
        component.loginForm.get('username')?.markAsTouched();
        component.loginForm.get('password')?.markAsTouched();

        expect(component.isFieldInvalid('username')).toBeTruthy(); // ว่าง = ไม่ถูกต้อง
        expect(component.isFieldInvalid('password')).toBeTruthy(); // ว่าง = ไม่ถูกต้อง
      });
    });
  });

  // ===== 6. กรณีขอบเขตและเงื่อนไขขอบเขต =====
  describe('กรณีขอบเขตและเงื่อนไขขอบเขต', () => {
    describe('ค่าขอบเขตของข้อมูลนำเข้า', () => {
      it('ควรจัดการชื่อผู้ใช้ที่เป็นช่องว่างเท่านั้น', () => {
        component.loginForm.patchValue({
          username: '   ',
          password: '123456',
        });
        // ช่องว่างถือเป็นข้อมูลที่ถูกต้อง
        expect(component.loginForm.valid).toBeTruthy();
      });

      it('ควรจัดการค่าข้อมูลนำเข้าที่ยาวมาก', () => {
        const longString = 'a'.repeat(1000);
        component.loginForm.patchValue({
          username: longString,
          password: longString,
        });
        expect(component.loginForm.valid).toBeTruthy();
      });

      it('ควรจัดการอักขระพิเศษในช่องทั้งหมด', () => {
        component.loginForm.patchValue({
          username: 'user@#$%^&*()_+',
          password: 'pass@#$%^&*()_+word',
        });
        expect(component.loginForm.valid).toBeTruthy();
      });
    });

    describe('กรณีขอบเขตของสถานะฟอร์ม', () => {
      it('ควรจัดการการเปลี่ยนแปลงค่าฟอร์มอย่างรวดเร็ว', () => {
        const usernameControl = component.loginForm.get('username');

        // จำลองการพิมพ์อย่างรวดเร็ว
        usernameControl?.setValue('u');
        usernameControl?.setValue('us');
        usernameControl?.setValue('user');
        usernameControl?.setValue('username');

        expect(usernameControl?.valid).toBeTruthy();
        expect(usernameControl?.value).toBe('username');
      });

      it('ควรจัดการสถานการณ์การรีเซ็ตฟอร์ม', () => {
        // กรอกฟอร์ม
        component.loginForm.patchValue({
          username: 'testuser',
          password: '123456',
          rememberMe: true,
        });

        // รีเซ็ตฟอร์มโดยใช้เมธอดรีเซ็ตของ Angular
        component.loginForm.reset();

        // หลังจากรีเซ็ต ค่าควรเป็นสตริงว่างและ false สำหรับบูลีน
        // ไม่ใช่ null ตามที่คาดหวังไว้ตอนแรก
        expect(component.loginForm.get('username')?.value).toBe('');
        expect(component.loginForm.get('password')?.value).toBe('');
        expect(component.loginForm.get('rememberMe')?.value).toBe(false);

        // ฟอร์มควรไม่ถูกต้องหลังจากรีเซ็ตเนื่องจากตัวตรวจสอบที่จำเป็น
        expect(component.loginForm.invalid).toBeTruthy();
      });
    });
  });
});
