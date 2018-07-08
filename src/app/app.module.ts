import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    NgSelectModule,
    TypeaheadModule
  ],
  providers: [TypeaheadModule,NgSelectModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
