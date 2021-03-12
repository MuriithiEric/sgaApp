import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CropImagePage } from './crop-image.page';

const routes: Routes = [
  {
    path: '',
    component: CropImagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CropImagePageRoutingModule {}
