import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-view-operation',
  templateUrl: './view-operation.component.html',
  styleUrls: ['./view-operation.component.scss']
})
export class ViewOperationComponent implements OnInit {

  form:FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form=this.formBuilder.group({
      operation: new FormControl('',[Validators.required])
    })
  }

}
