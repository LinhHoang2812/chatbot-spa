import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment.development';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  uploadHeaders = new HttpHeaders();
  headers = new HttpHeaders();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.sessionToken().subscribe((res) => {
      this.uploadHeaders = this.uploadHeaders.set(
        'Authorization',
        `Bearer ${res}`
      );
      this.headers = this.headers
        .set('Authorization', `Bearer ${res}`)
        .set('Content-Type', 'application/json;');
    });
  }

  uploadDoc(form: FormData) {
    return this.http.post(env.apiBase + 'documents', form, {
      headers: this.uploadHeaders,
    });
  }
  uploadPdfWithImage(form: FormData) {
    return this.http.post(env.apiBase + 'pdf_with_images', form, {
      headers: this.uploadHeaders,
    });
  }

  getDocs(
    order_by: string,
    sort: string,
    name: string
  ): Observable<Document[]> {
    if (order_by && sort && name) {
      return this.http.get<Document[]>(
        env.apiBase +
          `documents?order_by=${order_by}&sort=${sort}&name=${name}`,
        {
          headers: this.headers,
        }
      );
    }
    if (order_by && sort) {
      return this.http.get<Document[]>(
        env.apiBase + `documents?order_by=${order_by}&sort=${sort}`,
        {
          headers: this.headers,
        }
      );
    }
    if (name) {
      return this.http.get<Document[]>(env.apiBase + `documents?name=${name}`, {
        headers: this.headers,
      });
    }

    return this.http.get<Document[]>(env.apiBase + `documents`, {
      headers: this.headers,
    });
  }
  searchDocs(q: string, sort: string): Observable<Document[]> {
    let payload: any = { q };
    if (sort) {
      payload = { ...payload, sort: sort };
    }
    return this.http.post<Document[]>(env.apiBase + 'search', payload, {
      headers: this.headers,
    });
  }
}
