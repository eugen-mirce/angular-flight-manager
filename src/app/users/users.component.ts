import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { DeleteDialog } from '../_dialogs/delete-dialog.component';
import { EditDialog } from '../_dialogs/edit-dialog.component';
import { AdminService } from '../_services/admin.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  selector: string = 'all';

  isAdmin: boolean = false;
  isLoadingResults = true;

  pageEvent: PageEvent;

  resultsLength = 0;
  currentPage = 0;
  itemsPerPage = 3;

  displayedColumns: string[] = ['id', 'email', 'firstName', 'lastName', 'options'];
  dataSource: any[] = [];

  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private adminService: AdminService,
    public dialog: MatDialog
  ) { }

  ngAfterViewInit() {
    this.getUsers();
  }

  ngOnInit(): void {
    let user = this.tokenStorageService.getUser();
    if (user && user.roles.includes('ADMIN')) {
      this.isAdmin = true;
      this.getUsers();
    } else this.router.navigate(['/']);
  }

  public getPaginatorData(event: PageEvent): PageEvent {
    console.log(event.pageIndex);
    this.currentPage = event.pageIndex;
    this.getUsers();
    return event;
  }

  getUsers(): void {
    this.isLoadingResults = true;
    this.adminService.getUsers(this.currentPage + 1, this.itemsPerPage).subscribe(
      data => {
        this.dataSource = data.content;
        this.resultsLength = data.totalElements;
        this.isLoadingResults = false;
      },
      error => {
        console.log(error);
        this.isLoadingResults = false;
      }
    );

  }
  removeUser(user: any): void {
    this.adminService.deleteUser(user.id).subscribe(
      data => {
        this.getUsers();
      },
      error => {
        console.log(error);
      }
    );
  }

  deleteDialog(user: any): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      type: "user",
      data: {
        user: user
      },
      isAdmin: this.isAdmin
    };

    const dialogRef = this.dialog.open(DeleteDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (response: any) => {
        if (response == 'delete') {
          this.removeUser(user);
        }
      }, err => {
        alert(err.error);
      }
    );
  }

  editDialog(user: any): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      type: "user",
      data: {
        user: user
      }
    };

    const dialogRef = this.dialog.open(EditDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (response: any) => {
      }, err => {
        alert(err.error);
      }
    );
  }
}

