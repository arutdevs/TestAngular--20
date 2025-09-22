import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from './login';

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Create mock router
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, Login],
      providers: [
        FormBuilder,
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Reset spy calls between tests
    mockRouter.navigate.calls.reset();
  });

  // ===== 1. COMPONENT SETUP & INITIALIZATION =====
  describe('Component Setup & Initialization', () => {
    it('should create component successfully', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize version as empty string', () => {
      expect(component.version).toBe('');
    });

    it('should initialize loginForm with correct structure and default values', () => {
      expect(component.loginForm.get('username')?.value).toBe('');
      expect(component.loginForm.get('password')?.value).toBe('');
      expect(component.loginForm.get('rememberMe')?.value).toBe(false);
    });

    it('should have all required form controls', () => {
      expect(component.loginForm.get('username')).toBeTruthy();
      expect(component.loginForm.get('password')).toBeTruthy();
      expect(component.loginForm.get('rememberMe')).toBeTruthy();
    });
  });

  // ===== 2. FORM VALIDATION RULES =====
  describe('Form Validation Rules', () => {
    describe('Username Validation', () => {
      it('should require username', () => {
        const usernameControl = component.loginForm.get('username');
        usernameControl?.setValue('');
        usernameControl?.markAsTouched();
        expect(usernameControl?.hasError('required')).toBeTruthy();
      });

      it('should accept any non-empty username', () => {
        const usernameControl = component.loginForm.get('username');
        usernameControl?.setValue('testuser');
        expect(usernameControl?.hasError('required')).toBeFalsy();
        expect(usernameControl?.valid).toBeTruthy();
      });

      it('should accept username with special characters', () => {
        const usernameControl = component.loginForm.get('username');
        usernameControl?.setValue('user@domain.com');
        expect(usernameControl?.valid).toBeTruthy();
      });
    });

    describe('Password Validation', () => {
      it('should require password', () => {
        const passwordControl = component.loginForm.get('password');
        passwordControl?.setValue('');
        passwordControl?.markAsTouched();
        expect(passwordControl?.hasError('required')).toBeTruthy();
      });

      it('should require minimum 6 characters', () => {
        const passwordControl = component.loginForm.get('password');
        passwordControl?.setValue('12345');
        expect(passwordControl?.hasError('minlength')).toBeTruthy();
      });

      it('should accept password with exactly 6 characters', () => {
        const passwordControl = component.loginForm.get('password');
        passwordControl?.setValue('123456');
        expect(passwordControl?.hasError('minlength')).toBeFalsy();
        expect(passwordControl?.hasError('required')).toBeFalsy();
        expect(passwordControl?.valid).toBeTruthy();
      });

      it('should accept password longer than 6 characters', () => {
        const passwordControl = component.loginForm.get('password');
        passwordControl?.setValue('password123');
        expect(passwordControl?.valid).toBeTruthy();
      });
    });

    describe('Remember Me Validation', () => {
      it('should not have any validation rules', () => {
        const rememberMeControl = component.loginForm.get('rememberMe');
        
        rememberMeControl?.setValue(false);
        expect(rememberMeControl?.valid).toBeTruthy();
        
        rememberMeControl?.setValue(true);
        expect(rememberMeControl?.valid).toBeTruthy();
      });
    });

    describe('Form Overall Validation', () => {
      it('should be invalid when all fields are empty', () => {
        component.loginForm.patchValue({
          username: '',
          password: '',
          rememberMe: false
        });
        expect(component.loginForm.valid).toBeFalsy();
      });

      it('should be invalid when only username is filled', () => {
        component.loginForm.patchValue({
          username: 'testuser',
          password: '',
          rememberMe: false
        });
        expect(component.loginForm.valid).toBeFalsy();
      });

      it('should be invalid when only password is filled', () => {
        component.loginForm.patchValue({
          username: '',
          password: '123456',
          rememberMe: false
        });
        expect(component.loginForm.valid).toBeFalsy();
      });

      it('should be valid when both username and password are correctly filled', () => {
        component.loginForm.patchValue({
          username: 'testuser',
          password: '123456',
          rememberMe: false
        });
        expect(component.loginForm.valid).toBeTruthy();
      });
    });
  });

  // ===== 3. VALIDATION STATE CHECKING =====
  describe('Validation State Checking (isFieldInvalid)', () => {
    describe('Field State Detection', () => {
      it('should return false for valid field regardless of touch state', () => {
        component.loginForm.get('username')?.setValue('testuser');
        expect(component.isFieldInvalid('username')).toBeFalsy();
        
        component.loginForm.get('username')?.markAsTouched();
        expect(component.isFieldInvalid('username')).toBeFalsy();
      });

      it('should return false for invalid but pristine field', () => {
        component.loginForm.get('username')?.setValue('');
        // Field is invalid but not touched or dirty
        expect(component.isFieldInvalid('username')).toBeFalsy();
      });

      it('should return true for invalid and touched field', () => {
        const usernameControl = component.loginForm.get('username');
        usernameControl?.setValue('');
        usernameControl?.markAsTouched();
        expect(component.isFieldInvalid('username')).toBeTruthy();
      });

      it('should return true for invalid and dirty field', () => {
        const usernameControl = component.loginForm.get('username');
        // Make field dirty first by user interaction simulation
        usernameControl?.setValue('test');
        usernameControl?.updateValueAndValidity();
        usernameControl?.markAsDirty();
        
        // Then make it invalid
        usernameControl?.setValue('');
        usernameControl?.updateValueAndValidity();
        
        expect(component.isFieldInvalid('username')).toBeTruthy();
      });
    });

    describe('Edge Cases for Field Checking', () => {
      it('should handle non-existent field gracefully', () => {
        expect(component.isFieldInvalid('nonExistentField')).toBeFalsy();
      });

      it('should work correctly for all form fields', () => {
        const fields = ['username', 'password', 'rememberMe'];
        
        fields.forEach(field => {
          const result = component.isFieldInvalid(field);
          expect(typeof result).toBe('boolean');
        });
      });
    });
  });

  // ===== 4. FORM SUBMISSION BEHAVIOR =====
  describe('Form Submission Behavior (onSubmit)', () => {
    describe('Invalid Form Submission', () => {
      it('should mark all fields as touched when form is invalid', () => {
        component.loginForm.patchValue({
          username: '',
          password: '',
          rememberMe: false
        });
        
        spyOn(component.loginForm, 'markAllAsTouched');
        component.onSubmit();
        
        expect(component.loginForm.markAllAsTouched).toHaveBeenCalled();
      });

      it('should not navigate when form is invalid', () => {
        component.loginForm.patchValue({
          username: '',
          password: 'short',
          rememberMe: false
        });
        
        component.onSubmit();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
      });

      it('should return early when form is invalid', () => {
        component.loginForm.patchValue({
          username: 'testuser',
          password: '', // Invalid
          rememberMe: false
        });
        
        component.onSubmit();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
      });
    });

    describe('Valid Form Submission', () => {
      it('should navigate to index page when form is valid', () => {
        component.loginForm.patchValue({
          username: 'testuser',
          password: '123456',
          rememberMe: false
        });
        
        component.onSubmit();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/index']);
      });

      it('should navigate regardless of rememberMe state', () => {
        // Test with rememberMe = true
        component.loginForm.patchValue({
          username: 'testuser',
          password: '123456',
          rememberMe: true
        });
        
        component.onSubmit();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/index']);
        
        // Reset spy for next test
        mockRouter.navigate.calls.reset();
        
        // Test with rememberMe = false
        component.loginForm.patchValue({
          username: 'testuser2',
          password: 'password123',
          rememberMe: false
        });
        
        component.onSubmit();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/index']);
      });
    });

    describe('Specific Invalid Scenarios', () => {
      it('should not submit when username is missing', () => {
        component.loginForm.patchValue({
          username: '',
          password: '123456',
          rememberMe: false
        });
        
        component.onSubmit();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
      });

      it('should not submit when password is missing', () => {
        component.loginForm.patchValue({
          username: 'testuser',
          password: '',
          rememberMe: false
        });
        
        component.onSubmit();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
      });

      it('should not submit when password is too short', () => {
        component.loginForm.patchValue({
          username: 'testuser',
          password: '12345',
          rememberMe: false
        });
        
        component.onSubmit();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
      });
    });
  });

  // ===== 5. USER INTERACTION SCENARIOS =====
  describe('User Interaction Scenarios', () => {
    describe('Complete User Workflow', () => {
      it('should handle complete login flow from empty to valid submission', () => {
        // Start with empty form - should not submit
        component.onSubmit();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        
        // Fill username only - should not submit
        component.loginForm.get('username')?.setValue('testuser');
        component.onSubmit();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        
        // Fill password with invalid length - should not submit
        component.loginForm.get('password')?.setValue('123');
        component.onSubmit();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        
        // Fill valid password - should submit successfully
        component.loginForm.get('password')?.setValue('123456');
        component.onSubmit();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/index']);
      });

      it('should maintain form state during user corrections', () => {
        // User enters invalid password
        component.loginForm.patchValue({
          username: 'user',
          password: 'short'
        });
        expect(component.loginForm.invalid).toBeTruthy();
        
        // User corrects password
        component.loginForm.get('password')?.setValue('longpassword');
        expect(component.loginForm.valid).toBeTruthy();
        
        // User can submit
        component.onSubmit();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/index']);
      });
    });

    describe('Field Interaction States', () => {
      it('should show validation errors only after user interaction', () => {
        // Before any interaction - no errors shown
        expect(component.isFieldInvalid('username')).toBeFalsy();
        expect(component.isFieldInvalid('password')).toBeFalsy();
        
        // After touching fields - errors should show for invalid fields
        component.loginForm.get('username')?.markAsTouched();
        component.loginForm.get('password')?.markAsTouched();
        
        expect(component.isFieldInvalid('username')).toBeTruthy(); // Empty = invalid
        expect(component.isFieldInvalid('password')).toBeTruthy(); // Empty = invalid
      });
    });
  });

  // ===== 6. EDGE CASES & BOUNDARY CONDITIONS =====
  describe('Edge Cases & Boundary Conditions', () => {
    describe('Input Boundary Values', () => {
      it('should handle whitespace-only username', () => {
        component.loginForm.patchValue({
          username: '   ',
          password: '123456'
        });
        // Whitespace is considered valid input
        expect(component.loginForm.valid).toBeTruthy();
      });

      it('should handle very long input values', () => {
        const longString = 'a'.repeat(1000);
        component.loginForm.patchValue({
          username: longString,
          password: longString
        });
        expect(component.loginForm.valid).toBeTruthy();
      });

      it('should handle special characters in all fields', () => {
        component.loginForm.patchValue({
          username: 'user@#$%^&*()_+',
          password: 'pass@#$%^&*()_+word'
        });
        expect(component.loginForm.valid).toBeTruthy();
      });
    });

    describe('Form State Edge Cases', () => {
      it('should handle rapid form value changes', () => {
        const usernameControl = component.loginForm.get('username');
        
        // Simulate rapid typing
        usernameControl?.setValue('u');
        usernameControl?.setValue('us');
        usernameControl?.setValue('user');
        usernameControl?.setValue('username');
        
        expect(usernameControl?.valid).toBeTruthy();
        expect(usernameControl?.value).toBe('username');
      });

      it('should handle form reset scenarios', () => {
        // Fill form
        component.loginForm.patchValue({
          username: 'testuser',
          password: '123456',
          rememberMe: true
        });
        
        // Reset form using Angular's reset method
        component.loginForm.reset();
        
        // After reset, values should be empty strings and false for boolean
        // Not null as originally expected
        expect(component.loginForm.get('username')?.value).toBe('');
        expect(component.loginForm.get('password')?.value).toBe('');
        expect(component.loginForm.get('rememberMe')?.value).toBe(false);
        
        // Form should be invalid after reset due to required validators
        expect(component.loginForm.invalid).toBeTruthy();
      });
    });
  });
});