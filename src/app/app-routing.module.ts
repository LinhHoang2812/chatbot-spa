import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './admin/pages/auth/auth.component';
import { ChatUIComponent } from './chat/pages/chat-ui/chat-ui.component';
import { DashboardComponent } from './admin/pages/dashboard/dashboard.component';
import { authGuard } from './guard/auth.guard';
import { ChatUISmallComponent } from './chat/pages/chat-uismall/chat-uismall.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: ChatUIComponent },
      { path: 'small', component: ChatUISmallComponent },
      {
        path: 'admin',
        children: [
          { path: 'auth', component: AuthComponent },

          {
            path: 'dashboard',
            component: DashboardComponent,
            canActivate: [authGuard],
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
