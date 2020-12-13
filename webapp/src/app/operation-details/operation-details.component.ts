import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-operation-details',
  templateUrl: './operation-details.component.html',
  styleUrls: ['./operation-details.component.scss'],
})
export class OperationDetailsComponent implements OnInit {
  operation: any;
  inputImages = [];
  outputImages = [];
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const operationId = params.get('operationId');
      if (operationId) {
        this.http
          .get(`${environment.serverBaseUrl}/operations/${operationId}`)
          .subscribe({
            next: (data) => {
              this.operation = data;
              this.operation.items.forEach((i) =>
                this.inputImages.push(
                  `${environment.serverBaseUrl}/files/${i.id}`
                )
              );
            },
            error: (err: HttpErrorResponse) => console.error(err),
          });

        this.http
          .get(`${environment.serverBaseUrl}/operations/${operationId}/tasks`)
          .subscribe({
            next: (data: []) => {
              data.forEach((i: any) =>
                this.outputImages.push(
                  `${environment.serverBaseUrl}/files/${i.outputFile}`
                )
              );
            },
            error: (err: HttpErrorResponse) => console.error(err),
          });
      }
    });
  }

  openImage(url: string) {
    window.open(url);
  }
}
