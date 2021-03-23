import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  FormsModule
} from '@angular/forms';

import {
  IonicModule
} from '@ionic/angular';

import {
  HomePageRoutingModule
} from './home-routing.module';

import {
  HomePage
} from './home.page';
import {
  CropImagePageModule
} from 'src/app/modals/crop-image/crop-image.module';
import { FilestackModule } from '@filestack/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    CropImagePageModule,
    FilestackModule.forRoot({
      apikey: `AMGxu7xp2TNeIMML5tN4Gz`,
      options: {
        maxSize: 1024
      }
    })
  ],
  declarations: [HomePage]
})
export class HomePageModule {}