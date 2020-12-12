import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-operation-details',
  templateUrl: './operation-details.component.html',
  styleUrls: ['./operation-details.component.scss']
})
export class OperationDetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

}
