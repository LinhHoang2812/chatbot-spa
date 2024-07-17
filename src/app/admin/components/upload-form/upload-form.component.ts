import { Component, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { DocumentsService } from '../../services/documents.service';
import { FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss'],
})
export class UploadFormComponent {
  @Output() refetchData = new EventEmitter(null);
  @Input() q: string;
  @Output() qChange = new EventEmitter(null);

  @Input() filename: string;
  @Output() filenameChange = new EventEmitter(null);
  loading: boolean = false;

  

  file: File
  form: FormGroup
  submitted: boolean = false
  reportList = ["Report A2A","Report Milano","Report Friuli Venezia Giulia","Report Bergamo","Report Brescia","Report Valtellina Valchiavenna","Report Monza Brianza","Report Puglia",
  "Report Sicilia","Report Piemonte","Report Calabria"]

  constructor(private documentService: DocumentsService) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('',[Validators.required]),
      topic: new FormControl('',[Validators.required]),
      file: new FormControl(null,[Validators.required]),
      high_importance: new FormControl(null)

      
    })
  }

  uploadDoc(e: any) {
   
    this.form.get('file').setValue(e.target.files[0], {emitModelToViewChange: false});
    
    
  }

  onSave(){
    this.submitted = true
    if (this.form.valid){
      this.loading = true;
      const formData = new FormData();
      Object.keys(this.form.value).forEach(key=>{
        if (key === "high_importance"){
          formData.append(key,this.form.get(key).value || false);
        }
        else{
          formData.append(key,this.form.get(key).value);
        }
        
      })
      
      this.documentService.uploadDoc(formData).subscribe((res) => {
        this.loading = false;
        this.refetchData.emit();
        this.form.reset()
        this.submitted = false
       
    });


    }
    
  }


  // uploadPdfWithImage(e: any) {
  //   this.loading = true;
  //   const formData = new FormData();
  //   formData.append('file', e.target.files[0]);
  //   this.documentService.uploadPdfWithImage(formData).subscribe((res) => {
  //     this.loading = false;
  //     this.refetchData.emit(null);
  //   });
  // }



  // onSearch() {
  //   this.loading = true;
  //   this.documentService
  //     .searchDocs(this.q, null)
  //     .subscribe((res: Document[]) => {
  //       this.loading = false;
  //       this.refetchData.emit(res);
  //     });
  // }
  // onChange() {
  //   if (this.filename) {
  //     this.filenameChange.emit(null);
  //   }

  //   this.qChange.emit(this.q);
  //   if (!this.q) {
  //     this.refetchData.emit();
  //   }
  // }
}
