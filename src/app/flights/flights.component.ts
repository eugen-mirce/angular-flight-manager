import { AfterViewInit, Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';
import { AdminService } from '../_services/admin.service';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteDialog } from '../_dialogs/delete-dialog.component';
import { AddDialog } from '../_dialogs/add-dialog.component';
import { EditDialog } from '../_dialogs/edit-dialog.component';
import { FlightService } from '../_services/flight.service';
import { Flight } from '../_models/flight';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent implements OnInit, AfterViewInit {
  isAdmin: boolean = false;
  tripId: number;
  isLoadingResults = true;

  resultsLength = 0;

  displayedColumns: string[] = ['id', 'from', 'to', 'departureDate', 'arrivalDate', 'options'];
  dataSource: Flight[] = [];

  constructor(
    private flightService: FlightService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private adminService: AdminService,
    public dialog: MatDialog
  ) { }

  ngAfterViewInit() {
    this.getFlights();
  }

  ngOnInit(): void {
    let user = this.tokenStorageService.getUser();
    this.tripId = this.route.snapshot.params.id;
    if (user) {
      if (user.roles.includes('ADMIN'))
        this.isAdmin = true;
      this.getFlights();
    } else this.router.navigate(['/login']);
  }

  getFlights(): void {
    this.isLoadingResults = true;
    if (this.isAdmin && this.tripId) {
      this.adminService.getTripFlights(this.tripId).subscribe(
        data => {
          this.dataSource = data.content;
          this.resultsLength = data.length;
          this.isLoadingResults = false;
        },
        error => {
          console.log(error);
          this.isLoadingResults = false;
        }
      );
    } else if (!this.isAdmin && this.tripId) {
      let user = this.tokenStorageService.getUser();
      this.flightService.getAll(user.id, this.tripId).subscribe(
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
    } else {
      this.router.navigate(['/trips']);
    }
  }
  removeFlight(flight: any): void {
    if (this.isAdmin) {
      this.adminService.deleteFlight(flight.id).subscribe(
        data => {
          this.getFlights();
        },
        error => {
          console.log(error);
        }
      );
    } else {
      let user = this.tokenStorageService.getUser();
      this.flightService.delete(user.id, this.tripId, flight.id).subscribe(
        data => {
          this.getFlights();
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  deleteDialog(flight: any): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      type: "flight",
      data: {
        user: this.tokenStorageService.getUser(),
        flight: flight
      },
      isAdmin: this.isAdmin
    };

    const dialogRef = this.dialog.open(DeleteDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (response: any) => {
        if (response == 'delete') {
          this.removeFlight(flight);
        }
      }, err => {
        alert(err.error);
      }
    );
  }
  editDialog(flight: any): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      type: "flight",
      data: {
        user: this.tokenStorageService.getUser(),
        trip: {
          id: this.tripId
        },
        flight: flight
      },
      isAdmin: this.isAdmin
    };

    const dialogRef = this.dialog.open(EditDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (response: any) => {
        this.getFlights();
      }, err => {
        alert(err.error);
      }
    );
  }
  addFlightDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      type: "flight",
      data: {
        user: this.tokenStorageService.getUser(),
        trip: {
          id: this.tripId
        }
      }
    };

    const dialogRef = this.dialog.open(AddDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (response: any) => {
        this.getFlights();
      }, err => {
        alert(err.error);
      }
    );
  }
}

