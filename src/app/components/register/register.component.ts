import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/services/account.service';
import { passwordMatchValidator, validateUsernameNotTaken } from 'src/app/validators/custom.validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  existingUsernames: Observable<string[] | null> = this.accountService.getUsernames();
  destroy$ = new Subject();

  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
    this.createForm();
    this.registerForm.controls['username'].setAsyncValidators(validateUsernameNotTaken(this.existingUsernames));
  };

  createForm() {
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email ])
    }, 
    { validators: passwordMatchValidator });
  }

  register() {
    if (this.registerForm.invalid) {  
      this.markControlsDirtyAndTouched();
      return;
     }
    const {confirmPassword, ...userData } = this.registerForm.value; 
    this.accountService.createUser(userData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data =>  this.router.navigate(['/login']));
  }


 /**
  * GETTERS TO RID OF VERY LONG ERROR MESSAGES IN THE TEMPLATE
  */
  getUsernameRequiredError() {
    return (this.registerForm.get('username')?.hasError('required') && this.registerForm.get('username')?.touched && this.registerForm.get('username')?.dirty);
  }

  getUsernameAlreadyExistsError() {
    return this.registerForm.get('username')?.hasError('alreadyExists') && this.registerForm.get('username')?.touched && this.registerForm.get('username')?.dirty;
  }

  getPasswordRequiredError() {
    return (this.registerForm.get('password')?.hasError('required') && this.registerForm.get('password')?.touched && this.registerForm.get('password')?.dirty);
  }

  getPasswordConfirmRequiredError() {
    return (this.registerForm.get('confirmPassword')?.hasError('required') && this.registerForm.get('confirmPassword')?.touched && this.registerForm.get('confirmPassword')?.dirty);
  }

  getEmailRequiredError() {
    return (this.registerForm.get('email')?.hasError('required') && this.registerForm.get('email')?.touched && this.registerForm.get('email')?.dirty); 
  } 

  getEmailNotValidError() {
    return this.registerForm.get('email')?.hasError('email') && this.registerForm.get('email')?.touched && this.registerForm.get('email')?.dirty;
  }

  getPasswordsMustMatchError() {
    return this.registerForm.errors;
  }

  
 /**
  * NEEDED TO MANUALLY ACTIVATE ERRORS ON FORM SUBMITTANCE
  */

  markControlsDirtyAndTouched() {
    Object.keys(this.registerForm.controls).forEach(field => {
      const control = this.registerForm.get(field);
      if (control) {
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
      } 
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next('');
    this.destroy$.complete();
  }
}
