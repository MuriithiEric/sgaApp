import {
  Component,
  OnInit
} from '@angular/core';
import {
  BackEndService
} from 'src/app/services/back-end.service';
import {
  UtilitiesService
} from 'src/app/services/utilities.service';

import {
  Plugins,
  Camera,
  CameraResultType,
  CameraSource,
  Capacitor
} from '@capacitor/core';
import {
  CropImagePage
} from 'src/app/modals/crop-image/crop-image.page';
import {
  ModalController
} from '@ionic/angular';
import {
  Router
} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  imageUrl: any = 'https://kimptode.sirv.com/Images/15744B78-EAED-43CB-9AAD-E14590481AC5.JPG';
  receiptData: any = {
    clientNo: '',
    cardNo: '',
    driverName: '',
    plateNo: '',
    odometer: ''
  }

  slidecat = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 2.6,
    spaceBetween: 7,
  };

  tabList: string = 'receipts';


  constructor(
    private bs: BackEndService,
    private utils: UtilitiesService,
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {}

  extractDataFromImage() {
    this.utils.presentLoading('');
    this.bs.extractTextFromImage(this.imageUrl).then((res: any) => {
      this.utils.dismissLoading();
      let resp = res.body.resp;
      let objectResponse = JSON.parse(resp);
      if (objectResponse.ErrorMessage) {
        this.utils.presentAlert('Error', '', objectResponse.ErrorMessage[0]);
        throw new Error(objectResponse.ErrorMessage[0]);
      } else {
        console.log(objectResponse);
        // console.log(res.body);
        let receiptString = objectResponse.ParsedResults[0].ParsedText;
        let receiptArray = receiptString.split("\n");
        console.log(receiptArray);
        this.receiptData = {
          clientNo: receiptArray[10],
          cardNo: receiptArray[11],
          driverName: receiptArray[12],
          plateNo: receiptArray[13],
          odometer: receiptArray[14]
        }
      }
    }).catch((err) => {
      this.utils.dismissLoading();
      this.utils.handleError(err);
    });
  }

  extractTextFromImage() {
    this.utils.presentLoading('');
    this.bs.extractDataFromImage(this.imageUrl).then((res: any) => {
      this.utils.dismissLoading();
      let objectResponse = res.body;
      // console.log(resp);
      // let objectResponse = JSON.parse(resp);
      if (objectResponse.ErrorMessage) {
        this.utils.presentAlert('Error', '', objectResponse.ErrorMessage[0]);
        throw new Error(objectResponse.ErrorMessage[0]);
      } else {
        console.log(objectResponse);
        // console.log(res.body);
        let receiptString = objectResponse.ParsedResults[0].ParsedText;
        let receiptArray = receiptString.split("\n");
        console.log(receiptArray);
      }
    }).catch((err) => {
      this.utils.dismissLoading();
      this.utils.handleError(err);
    });
  }

  async takePicture() {
    try {
      const image = await Plugins.Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Base64
        // source: CameraSource.Camera
      });
      this.imageUrl = image.base64String;
      this.openImageCropper();
    } catch (error) {
      console.log(error);
      // this.utils.handleError(error);
    }
  }

  async openImageCropper() {
    const modal = await this.modalController.create({
      component: CropImagePage,
      componentProps: {
        rawImage: 'data:image/png;base64,' + this.imageUrl
      }
    });

    modal.onDidDismiss().then((resp) => {
      this.imageUrl = (resp.data.imageUrl.slice(22));
      // this.updateProfilePhoto();
    });

    return await modal.present();
  }

  PageRoute(urlSlug: string) {
    this.router.navigateByUrl('/' + urlSlug);
  }





}