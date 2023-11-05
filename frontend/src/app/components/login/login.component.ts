import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent  {
  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });



  get email() {
    return this.loginForm.controls['email'];
  }
  get password() { return this.loginForm.controls['password']; }

  loginUser() {
    this.authService.login(this.loginForm.value).subscribe({next:(response :any)=>{
      if(response.success){
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login successful',life : 3000, });
        this.router.navigateByUrl('/employees');
      }
      else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'email or password is wrong',life : 3000, });
      }

    },
    error:(error):any  =>{
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred, check the internet connection', life : 3000, });

    }
  })

  }




}
