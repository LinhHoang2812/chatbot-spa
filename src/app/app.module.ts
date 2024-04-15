import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './admin/pages/auth/auth.component';
import { ChatUIComponent } from './chat/pages/chat-ui/chat-ui.component';
import { DashboardComponent } from './admin/pages/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UploadFormComponent } from './admin/components/upload-form/upload-form.component';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BotComponent } from './chat/components/bot/bot.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ChatUISmallComponent } from './chat/pages/chat-uismall/chat-uismall.component';
@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    ChatUIComponent,
    DashboardComponent,
    UploadFormComponent,
    BotComponent,
    ChatUISmallComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    NgxSpinnerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
