import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  message: string;
  form: FormGroup;
  loading: boolean = false;
  passwordVisible: boolean = false;
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }
  onSave() {
    if (this.form.valid) {
      this.loading = true;
      this.authService.login(this.form.value).subscribe({
        next: (res: any) => {
          this.authService.saveToken(res.token);
          localStorage.setItem('token', res.token);
          this.loading = false;
          this.router.navigateByUrl('/admin/dashboard');
        },
        error: (e: HttpErrorResponse) => {
          this.message = e.error.detail;
          this.loading = false;
        },
      });
    }
  }
}
