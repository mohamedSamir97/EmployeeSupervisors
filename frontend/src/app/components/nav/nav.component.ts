import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(public authService:AuthService,
    private router:Router,
    private messageService: MessageService) { }

  ngOnInit(): void {
  }

  logout(){
    this.authService.logout();
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Logged out successful' });
    this.router.navigateByUrl('/');
  }

}
