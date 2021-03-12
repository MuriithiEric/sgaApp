import { firebaseConfig } from './credentials';
import {
  NgModule
} from '@angular/core';
import {
  BrowserModule
} from '@angular/platform-browser';
import {
  RouteReuseStrategy
} from '@angular/router';

import {
  IonicModule,
  IonicRouteStrategy
} from '@ionic/angular';

import {
  AppRoutingModule
} from './app-routing.module';
import {
  AppComponent
} from './app.component';
import {
  HttpClientModule
} from '@angular/common/http';
import {
  UtilitiesService
} from './services/utilities.service';
import {
  AuthenticationService
} from './services/authentication.service';
import { BackEndService } from './services/back-end.service';


import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
  ],
  providers: [{
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    BackEndService,
    UtilitiesService,
    AuthenticationService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}