import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent} from 'ngx-image-cropper';
import { ModalController } from '@ionic/angular';
import { UtilitiesService } from 'src/app/services/utilities.service';
@Component({
  selector: 'app-crop-image',
  templateUrl: './crop-image.page.html',
  styleUrls: ['./crop-image.page.scss'],
})
export class CropImagePage implements OnInit {
  rawImage;
  croppedImage = null;
  idVerification;
  constructor(
    private modalController: ModalController,
    private utils: UtilitiesService
  ) { }

  ngOnInit() {
    this.utils.presentLoading('Rendering Image');
    // console.log(this.rawImage);
  }

  imageCropped(e: ImageCroppedEvent) {
    this.croppedImage = e.base64;
    // console.log()
  }

  saveImage() {
    this.modalController.dismiss({
      imageUrl: this.croppedImage
    });
  }

  loadImageFailed(e) {
   console.log(e);
   this.utils.presentAlert('Slight Hitch!', '', 'Please Re-upload the photo we had an issue rendering it.');
  }

  imageLoaded() {
    this.utils.dismissLoading();
  }

}
