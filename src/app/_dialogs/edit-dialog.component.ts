import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { environment } from "src/environments/environment";
import { Dialog } from "../_models/dialog";
import { AdminService } from "../_services/admin.service";
import { FlightService } from "../_services/flight.service";
import { TripService } from "../_services/trip.service";
import { UserService } from "../_services/user.service";


@Component({
    selector: 'edit-dialog',
    templateUrl: './edit-dialog.component.html',
})
export class EditDialog {
    formData: any;
    reasons: string[] = environment.reasons;
    message: string;

    constructor(
        private dialogRef: MatDialogRef<EditDialog>,
        @Inject(MAT_DIALOG_DATA) public readonly dialog: Dialog,
        private userService: UserService,
        private tripService: TripService,
        private flightService: FlightService
    ) { }

    ngOnInit() {
        console.log(this.dialog);
        if (this.dialog.type == 'trip') {
            this.formData = this.dialog.data.trip;
        } else if (this.dialog.type == 'flight') {
            this.formData = this.dialog.data.flight;
        } else if (this.dialog.type == 'user') {
            this.formData = this.dialog.data.user;
        }
    }

    updateTrip() {
        this.message = '';

        this.tripService.update(this.dialog.data.user.id, this.dialog.data.trip.id, this.formData).subscribe(
            response => {
                this.message = response.message
                    ? response.message
                    : `This ${this.dialog.type} was updated successfully!`;
                this.dialogRef.close('update');
            },
            error => {
                console.log(error);
                this.dialogRef.close('error');
            }
        );
    }
    updateFlight() {
        this.message = '';

        this.flightService.update(this.dialog.data.user.id, this.dialog.data.trip.id, this.dialog.data.flight.id, this.formData).subscribe(
            response => {
                this.message = response.message
                    ? response.message
                    : `This ${this.dialog.type} was updated successfully!`;
                this.dialogRef.close('update');
            },
            error => {
                console.log(error);
                this.dialogRef.close('error');
            }
        );
    }
    updateUser() {
        this.message = '';
        this.formData.roles = [this.formData.roles];
        this.userService.update(this.dialog.data.user.id, this.formData).subscribe(
            response => {
                this.message = response.message
                    ? response.message
                    : `This ${this.dialog.type} was updated successfully!`;
                this.dialogRef.close('update');
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