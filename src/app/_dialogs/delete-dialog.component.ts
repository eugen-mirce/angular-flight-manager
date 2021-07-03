import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Dialog } from "../_models/dialog";

@Component({
    selector: 'delete-dialog',
    templateUrl: './delete-dialog.component.html',
})
export class DeleteDialog implements OnInit {
    constructor(
        private dialogRef: MatDialogRef<DeleteDialog>,
        @Inject(MAT_DIALOG_DATA) public dialog: Dialog,
    ) { }

    ngOnInit() { }


    submit() {
        this.dialogRef.close("delete");
    }
    close() {
        this.dialogRef.close();
    }
}