import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-operation-created',
  templateUrl: './dialog-operation-created.component.html',
  styleUrls: ['./dialog-operation-created.component.scss'],
})
export class DialogOperationCreatedComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}
}
