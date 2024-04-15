import { Component, EventEmitter, Output, Input } from '@angular/core';
import { DocumentsService } from '../../services/documents.service';

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

  constructor(private documentService: DocumentsService) {}

  ngOnInit() {}

  uploadDoc(e: any) {
    this.loading = true;
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    this.documentService.uploadDoc(formData).subscribe((res) => {
      this.loading = false;
      this.refetchData.emit();
    });
  }

  uploadPdfWithImage(e: any) {
    this.loading = true;
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    this.documentService.uploadPdfWithImage(formData).subscribe((res) => {
      this.loading = false;
      this.refetchData.emit(null);
    });
  }

  onSearch() {
    this.loading = true;
    this.documentService
      .searchDocs(this.q, null)
      .subscribe((res: Document[]) => {
        this.loading = false;
        this.refetchData.emit(res);
      });
  }
  onChange() {
    if (this.filename) {
      this.filenameChange.emit(null);
    }

    this.qChange.emit(this.q);
    if (!this.q) {
      this.refetchData.emit();
    }
  }
}
