import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  content?: string;

  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    let user = this.tokenStorageService.getUser();
    if (Object.keys(user).length === 0) {
      // this.router.navigate(['/login']);
      this.content = 'No User Logged In.';
    } else {
      this.content = 'Hello ' + user.firstName + '!';
    }
  }
}