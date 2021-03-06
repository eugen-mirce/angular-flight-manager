import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../_services/admin.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  user: any;
  paramId: number;
  isAdmin: boolean = false;

  message: string = '';

  constructor(
    private tokenService: TokenStorageService,
    private userService: UserService,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.tokenService.getUser();
    if (this.user.roles.includes('ADMIN')) this.isAdmin = true;
    this.paramId = this.route.snapshot.params.id;
    if (this.isAdmin && this.paramId != undefined) {
      this.adminService.getUser(this.paramId).subscribe(
        response => {
          this.user = response;
        },
        error => {
          this.user = null;
        }
      );
    } else {
      this.router.navigate(['/user']);
    }
    console.log(this.user);
  }
  updateUser(): void {
    if (this.isAdmin) {
      if (this.paramId !== undefined && this.paramId !== null)
        this.adminService.updateUser(this.paramId, this.user).subscribe(
          response => {
            this.message = response.message
              ? response.message
              : 'Information was updated successfully!';
          },
          error => {
            console.log(error);
            this.message = error.error.message;
          }
        );
      else
        this.adminService.updateUser(this.user.id, this.user).subscribe(
          response => {
            response.roles = 'ADMIN';
            this.tokenService.saveUser(response);
            this.message = response.message
              ? response.message
              : 'Information was updated successfully!';
          },
          error => {
            console.log(error);
            this.message = error.error.message;
          }
        );
    } else {
      this.userService.update(this.user.id, this.user).subscribe(
        response => {
          this.tokenService.saveUser(response);
          this.message = response.message
            ? response.message
            : 'Information was updated successfully!';
        },
        error => {
          console.log(error);
          this.message = error.error.message;
        }
      );
    }
  }
  deleteUser(): void {
    if (this.isAdmin) {
      this.adminService.deleteUser(this.user.id).subscribe(
        response => {
          this.router.navigate(['/users']);
        },
        error => {
          console.log(error);
          this.message = error.error.message;
        }
      );
    } else {
      this.userService.delete(this.user.id).subscribe(
        response => {
          this.tokenService.signOut();
          this.router.navigate(['login']);
        },
        error => {
          console.log(error);
          this.message = error.error.message;
        }
      );
    }
  }
}