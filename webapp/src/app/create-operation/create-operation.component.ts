import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-operation',
  templateUrl: './create-operation.component.html',
  styleUrls: ['./create-operation.component.scss'],
})
export class CreateOperationComponent implements OnInit {
  files: File[];
  form: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      images: [],
      description: new FormControl(''),
      fBlur: new FormControl(false),
      fContour: new FormControl(false),
      fDetail: new FormControl(false),
      fEdgeEnhance: new FormControl(false),
      fEdgeEnhancePlus: new FormControl(false),
      fEmboss: new FormControl(false),
      fFindEdges: new FormControl(false),
      fSharpen: new FormControl(false),
      fSmooth: new FormControl(false),
      fSmoothPlus: new FormControl(false),
    });
  }

  onFileSelected(event: { files: File[] }) {
    this.files = event.files;
  }

  public async buildRequest() {
    let fd = new FormData();

    for (let f of this.files) {
      fd.append('images', f, f.name);
    }

    console.log(fd);
  }

  onSubmit() {
    const filters = [];

    if (this.form.get('fBlur').value) filters.push('blur');
    if (this.form.get('fContour').value) filters.push('contour');
    if (this.form.get('fDetail').value) filters.push('detail');
    if (this.form.get('fEdgeEnhance').value) filters.push('edge_enhance');
    if (this.form.get('fEdgeEnhancePlus').value)
      filters.push('edge_enhance_plus');
    if (this.form.get('fEmboss').value) filters.push('emboss');
    if (this.form.get('fFindEdges').value) filters.push('find_edges');
    if (this.form.get('fSharpen').value) filters.push('sharpen');
    if (this.form.get('fSmooth').value) filters.push('smooth');
    if (this.form.get('fSmoothPlus').value) filters.push('smooth_plus');

    const fd = new FormData();
    fd.append(
      'settings',
      JSON.stringify({
        description: this.form.get('description').value,
        filters: filters,
      })
    );

    for (let f of this.files) {
      fd.append('images', f, f.name);
    }

    this.http
      .post<any>(`${environment.serverBaseUrl}/operations/create`, fd)
      .subscribe(
        (res) => {
          console.log(res);
          alert(
            'La operación se ha creado correctamente y será procesada en breve.'
          );
          this.router.navigateByUrl('/');
        },
        (err) => console.log(err)
      );
  }

  showSendingDialog() {}
}
