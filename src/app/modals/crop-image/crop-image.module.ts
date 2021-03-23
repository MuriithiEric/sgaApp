import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CropImagePageRoutingModule } from './crop-image-routing.module';

import { CropImagePage } from './crop-image.page';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CropImagePageRoutingModule,
    ImageCropperModule
  ],
  declarations: [CropImagePage]
})
export class CropImagePageModule {}
