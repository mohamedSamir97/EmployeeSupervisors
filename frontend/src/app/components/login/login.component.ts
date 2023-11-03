import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiResponse } from 'src/app/models/apiResponse';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

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
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login successful' });
        this.router.navigateByUrl('/employees');
      }
      else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'email or password is wrong' });
      }

    },
    error:(error):any  =>{
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred' });

    }
  })

    // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'email or password is wrong' });

    // this.authService.getUserByEmail(email as string).subscribe(
    //   response => {
    //     if (response.length > 0 && response[0].password === password) {
    //       sessionStorage.setItem('email', email as string);
    //       this.router.navigate(['/home']);
    //     } else {
    //       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'email or password is wrong' });
    //     }
    //   },
    //   error => {
    //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
    //   }

    // )
  }




}
