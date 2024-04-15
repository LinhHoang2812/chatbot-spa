import { Component } from '@angular/core';
import { AuthService } from './admin/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'chatbot_ng';
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit() {}
}
