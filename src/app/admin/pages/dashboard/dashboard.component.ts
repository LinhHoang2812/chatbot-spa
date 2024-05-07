import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { DocumentsService } from '../../services/documents.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  displayedColumns: string[] = ['filename', 'created_at', 'uploaded_by'];
  documents: Document[];
  date_down: boolean = true;
  filterName: boolean = false;
  filename: string;
  q: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private documentService: DocumentsService
  ) {}
  ngOnInit() {
    this.documentService
      .getDocs(null, null, null)
      .subscribe((res: Document[]) => {
        this.documents = res;
      });
  }

  refetchData(res: Document[]) {
    if (!res) {
      this.documentService
        .getDocs(null, null, null)
        .subscribe((res: Document[]) => {
          this.documents = res;
        });
    } else {
      this.documents = res;
    }
    this.date_down = true;
  }

  closeFilter(e: any) {
    if (
      !e.target.classList.contains('name') &&
      !e.target.classList.contains('arrow')
    ) {
      this.filterName = false;
    }
  }

  applyFilter(order_by: string, sort: string) {
    if (sort === 'asc') {
      this.date_down = false;
    } else {
      this.date_down = true;
    }
    if (this.filename && !sort) {
      // this.filterName = false;
      this.date_down = true;
    }
    if (this.q) {
      this.documentService.searchDocs(this.q, sort).subscribe((res) => {
        this.documents = res;
      });
    } else {
      this.documentService
        .getDocs(order_by, sort, this.filename)
        .subscribe((res: Document[]) => {
          this.documents = res;
        });
    }
  }

  onChange() {
    if (this.q) {
      this.q = null;
    }

    if (!this.filename) {
      this.refetchData(null);
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.authService.saveToken(null);
    this.router.navigateByUrl('/admin/auth');
  }

  download(url: string, filename: string) {
    this.documentService.downloadDoc(url).subscribe((blob) => {
      saveAs(blob, filename);
    });
  }
}
