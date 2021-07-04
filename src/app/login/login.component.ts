import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    email: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  message = '';
  hide = true;
  roles: string[] = [];

  constructor(
    private userService: UserService,
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) { }
  ngOnInit(): void {
    if (this.tokenStorageService.getUser()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorageService.getUser().roles;
      if (this.roles.includes('ADMIN'))
        this.router.navigate(['/users']);
      else
        this.router.navigate(['/trips']);
    }

  }
  loginProces() {
    const { email, password } = this.form;

    this.userService.login(email, password)
      .subscribe((response: any) => {
        let authorizationToken = response.headers.get('authorization');
        let userId = response.headers.get('userid');
        let admin = response.headers.get('isadmin');
        this.tokenStorageService.saveToken(authorizationToken);
        this.isLoginFailed = false;
        this.message = 'Successfully Logged In';
        this.saveUser(userId, admin);
      }, (err: any) => {
        if (err.status == 403) {
          this.message = 'Wrong Credentials';
        } else {
          this.message = err.console.error.message;
        }
        this.isLoginFailed = true;
      })
  }
  saveUser(id: number, admin: string): void {
    this.userService.get(id).subscribe((data: any) => {
      if (admin == 'true') data.roles = 'ADMIN';
      else data.roles = 'USER';
      this.tokenStorageService.saveUser(data);

      this.isLoginFailed = false;
      this.isLoggedIn = true;
      this.reloadPage();
    });
  }
  reloadPage(): void {
    window.location.reload();
  }
}
