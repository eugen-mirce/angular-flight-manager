import { AfterViewInit, Component, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';
import { TripService } from '../_services/trip.service';
import { Trip } from '../_models/trip';
import { AdminService } from '../_services/admin.service';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteDialog } from '../_dialogs/delete-dialog.component';
import { AddDialog } from '../_dialogs/add-dialog.component';
import { EditDialog } from '../_dialogs/edit-dialog.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnInit, AfterViewInit {
  selector: string = 'all';

  isAdmin: boolean = false;
  userId?: number;
  isLoadingResults = true;

  pageEvent: PageEvent;

  resultsLength = 0;
  currentPage = 0;
  itemsPerPage = 5;

  displayedColumns: string[] = ['id', 'reason', 'description', 'from', 'to', 'departureDate', 'arrivalDate', 'status', 'options'];
  dataSource: Trip[] = [];

  constructor(
    private tripService: TripService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private adminService: AdminService,
    public dialog: MatDialog
  ) { }

  ngAfterViewInit() {
    this.getTrips();
  }

  ngOnInit(): void {
    let user = this.tokenStorageService.getUser();
    if (user) {
      if (user.roles.includes('ADMIN')) this.isAdmin = true;
      this.getTrips();
      if (this.route.snapshot.params.id) {
        this.userId = this.route.snapshot.params.id;
      }
    } else this.router.navigate(['/login']);
  }

  public getPaginatorData(event: PageEvent): PageEvent {
    console.log(event.pageIndex);
    this.currentPage = event.pageIndex;
    this.getTrips();
    return event;
  }

  changeSelector(newSelector: string): void {
    this.selector = newSelector;
    this.dataSource = [];
    this.currentPage = 0;
    this.getTrips();
  }

  getTrips(): void {
    this.isLoadingResults = true;
    if (this.isAdmin) {
      if (this.userId) {
        this.tripService.getAll(this.userId).subscribe(
          data => {
            this.dataSource = data;
            this.resultsLength = data.length;
            this.isLoadingResults = false;
          },
          error => {
            console.log(error);
            this.isLoadingResults = false;
          })
      } else {
        this.adminService.getAllTrips(this.selector, this.currentPage + 1, this.itemsPerPage).subscribe(
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
    } else {
      let user = this.tokenStorageService.getUser();
      this.tripService.getAll(user.id).subscribe(
        data => {
          this.dataSource = data;
          this.resultsLength = data.length;
          this.isLoadingResults = false;
        },
        error => {
          console.log(error);
          this.isLoadingResults = false;
        }
      );
    }
  }
  removeTrip(trip: any): void {
    if (this.isAdmin) {
      this.adminService.deleteTrip(trip.id).subscribe(
        data => {
          this.getTrips();
        },
        error => {
          console.log(error);
        }
      );
    } else {
      let user = this.tokenStorageService.getUser();
      this.tripService.delete(user.id, trip.id).subscribe(
        data => {
          this.getTrips();
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  approveTrip(trip: any): void {
    this.adminService.approveTrip(trip.id).subscribe(
      response => {
        trip.status = 'APPROVED';
      },
      error => {
        console.log(error);
      }
    );
  }

  requestApprove(trip: any): void {
    this.tripService.requestApproval(this.tokenStorageService.getUser().id, trip.id).subscribe(
      response => {
        trip.status = 'PENDING';
      },
      error => {
        console.log(error);
      }
    );
  }

  deleteDialog(trip: any): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      type: "trip",
      data: {
        user: this.tokenStorageService.getUser(),
        trip: trip
      },
      isAdmin: this.isAdmin
    };

    const dialogRef = this.dialog.open(DeleteDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (response: any) => {
        if (response == 'delete') {
          this.removeTrip(trip);
        }
      }, err => {
        alert(err.error);
      }
    );
  }
  addTripDialog(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      type: "trip",
      data: {
        user: this.tokenStorageService.getUser()
      }
    };

    const dialogRef = this.dialog.open(AddDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (response: any) => {
        this.getTrips();
      }, err => {
        alert(err.error);
      }
    );
  }
  editDialog(trip: any): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      type: "trip",
      data: {
        user: this.tokenStorageService.getUser(),
        trip: trip
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
  addFlightDialog(trip: any) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      type: "flight",
      data: {
        user: this.tokenStorageService.getUser(),
        trip: trip
      }
    };

    const dialogRef = this.dialog.open(AddDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (response: any) => {
        this.getTrips();
      }, err => {
        alert(err.error);
      }
    );
  }
}

