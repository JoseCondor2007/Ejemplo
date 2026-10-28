import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: '../header/header.component.html',
  styleUrls: ['../header/header.component.css']
})
export class HeaderComponent implements OnInit {
  user: any;
  currentDate = new Date();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }
}