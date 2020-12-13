import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  queue = [];

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.http
    .get(`${environment.serverBaseUrl}/operations`)
    .subscribe({
      next: (data:[]) => {
        this.queue = data;
      },
      error: (err: HttpErrorResponse) => console.error(err),
    });
  }

}
