import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Dialog } from "../_models/dialog";
import { Flight } from "../_models/flight";
import { Trip } from "../_models/trip";
import { environment } from "src/environments/environment";
import { TripService } from "../_services/trip.service";
import { FlightService } from "../_services/flight.service";
import { AdminService } from "../_services/admin.service";

@Component({
    selector: 'add-dialog',
    templateUrl: './add-dialog.component.html',
})
export class AddDialog {
    formData: any;
    reasons: string[] = environment.reasons;
    message: string;

    constructor(
        private dialogRef: MatDialogRef<AddDialog>,
        @Inject(MAT_DIALOG_DATA) public dialog: Dialog,
        private tripService: TripService,
        private flightService: FlightService,
        private adminService: AdminService
    ) { }

    ngOnInit() {
        if (this.dialog.type == "user") {
            this.formData = {
                id: null,
                firstName: '',
                lastName: '',
                email: '',
                password: ''
            }
        } else if (this.dialog.type == "trip") {
            this.formData = {
                id: null,
                reason: '',
                description: '',
                from: '',
                to: '',
                departureDate: '',
                arrivalDate: '',
                flights: [],
                status: ''
            };
        } else {
            this.formData = {
                id: null,
                from: '',
                to: '',
                departureDate: '',
                arrivalDate: ''
            };
        }
    }


    submitTrip() {
        this.message = '';

        this.tripService.create(this.dialog.data.user.id, this.formData).subscribe(
            response => {
                this.message = response.message
                    ? response.message
                    : `This ${this.dialog.type} was created successfully!`;
                this.dialogRef.close('submit');
            },
            error => {
                console.log(error);
                this.dialogRef.close('error');
            }
        );
    }
    submitFlight() {
        this.message = '';

        this.flightService.create(this.dialog.data.user.id, this.dialog.data.trip.id, this.formData).subscribe(
            response => {
                this.message = response.message
                    ? response.message
                    : `This ${this.dialog.type} was created successfully!`;
                this.dialogRef.close('submit');
            },
            error => {
                console.log(error);
                this.dialogRef.close('error');
            }
        );
    }
    close() {
        this.dialogRef.close();
    }
}