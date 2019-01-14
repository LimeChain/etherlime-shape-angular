import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputToDoComponent } from './input-to-do/input-to-do.component';
import { AddToDoComponent } from './add-to-do/add-to-do.component';

@NgModule({
  declarations: [
    AppComponent,
    InputToDoComponent,
    AddToDoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
