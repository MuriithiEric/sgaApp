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
  AlertController,
  ModalController
} from '@ionic/angular';
import {
  Router
} from '@angular/router';
import {
  UserService
} from 'src/app/services/user.service';
import {
  AuthService
} from 'src/app/services/auth.service';
import * as moment from 'moment';

import * as firebase from 'firebase';
import 'firebase/firestore';
import * as filestack from 'filestack-js';
import {
  NgxImageCompressService
} from 'ngx-image-compress';
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

  userData: any = {};
  apikey: string;


  imgResultBeforeCompress: string;
  imgResultAfterCompress: string;
  receipts: any = [];

  imageSize: any = '';
  constructor(
    private bs: BackEndService,
    private utils: UtilitiesService,
    private modalController: ModalController,
    private router: Router,
    private user: UserService,
    private auth: AuthService,
    private imageCompress: NgxImageCompressService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.apikey = 'AMGxu7xp2TNeIMML5tN4Gz';
    this.getUserData();
  }

  refresh(e) {
    this.getUserData();
    e.target.complete();
  }

  onUploadSuccess(url) {
    // console.log('###uploadSuccess', res);
    let imageUrl = url;
    console.log(imageUrl);
    this.extractTextFromImage(imageUrl);
  }

  onUploadError(err: any) {
    // console.log('###uploadError', err);
    this.utils.handleError(err);
  }

  extractDataFromImage(url) {
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
          odometer: receiptArray[14],
          userId: this.userData.userId,
          fuelledOn: moment().format('llll'),
          uploadedOn: moment().format('llll'),
          driverBalanceBefore: this.userData.balance
        }
        console.log(this.receiptData);
        this.user.uploadReceipt(this.receiptData).then(() => {
          this.utils.presentToast('Receipt Uploaded Successfully!', 'toast-success');
        }).catch((err) => {
          this.utils.dismissLoading();
          this.utils.handleError(err);
        });
      }
    }).catch((err) => {
      this.utils.dismissLoading();
      this.utils.handleError(err);
    });
  }

  extractTextFromImage(url) {
    this.utils.presentLoading('');
    this.bs.extractDataFromImage(url).then((res: any) => {
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
        this.receiptData = {
          clientNo: receiptArray[10].split('#')[1].trim(),
          cardNo: receiptArray[11].split('#')[1].trim(),
          driverName: receiptArray[12],
          plateNo: receiptArray[13].split('#')[1].trim(),
          odometer: receiptArray[14],
          userId: this.userData.userId,
          userFirstName: this.userData.firstName,
          lastName: this.userData.lastName,
          fuelledOn: moment().format('llll'),
          uploadedOn: moment().format('llll'),
          driverBalanceBefore: this.userData.balance,
          receiptUrl: url,
          amountFuelled: receiptArray[19].split('KES')[1].trim(),
          ticketNo: receiptArray[6].split('#')[1].trim(),
          // litresLimit: receiptArray[22],
          availableLitres: receiptArray[23].split('lable')[1].trim(),
        }
        let driverBalance = parseFloat(receiptArray[26].split('KES')[1].trim());
        console.log(this.receiptData);
        this.user.uploadReceipt(this.receiptData).then(() => {
          this.utils.presentToast('Receipt Uploaded Successfully!', 'toast-success');
          this.user.updateUserInfo({
            balance: driverBalance,
            timesFuelled: firebase.firestore.FieldValue.increment(1),
            odometer: receiptArray[14].split('Odometer')[1].trim(),
            availableLitres: receiptArray[23].split('lable')[1].trim(),
            cardNo: receiptArray[11].split('#')[1].trim()
          }).then(() => {
            console.log('Updated Driver Balance');
            this.getUserData();
          }).catch((err) => {
            console.log('L178');
            this.utils.dismissLoading();
            this.utils.handleError(err);
          });
        }).catch((err) => {
          console.log('L162');
          this.utils.dismissLoading();
          this.utils.handleError(err);
        });
      }
    }).catch((err) => {
      console.log('L167');
      if (err.message === 'Timed out waiting for results') {
        this.extractTextFromImage(url);
        this.utils.presentToast('Network Error, retrying...', 'toast-error');
      } else {
        this.utils.dismissLoading();
        this.utils.handleError(err);
      }
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
      // this.openImageCropper();
      this.calculateImageSize(this.imageUrl);
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

  calculateImageSize(base64String) {
    let padding, inBytes, base64StringLength;
    if (base64String.endsWith("==")) padding = 2;
    else if (base64String.endsWith("=")) padding = 1;
    else padding = 0;

    base64StringLength = base64String.length;
    console.log(base64StringLength)
    inBytes = (base64StringLength / 4) * 3 - padding;
    console.log(inBytes);
    //in KB
    this.imageSize = (inBytes / 1000) / 1000;
    if (this.imageSize <= 1.4) {
      // this.openImageCropper();
      this.uploadReceiptAndGetURL(this.imageUrl);
    } else {
      this.utils.presentAlert('FILE TOO LARGE', '', 'The photo must be less than 1.5MB.');
    }
    console.log(this.imageSize)
  }

  PageRoute(urlSlug: string) {
    this.router.navigateByUrl('/' + urlSlug);
  }

  uploadReceiptAndGetURL(url) {
    this.utils.presentLoading('');
    this.user.uploadPhoto(url).then((url) => {
      this.utils.dismissLoading();
      console.log(url);
      this.extractTextFromImage(url);
    }).catch((err) => {
      this.utils.dismissLoading();
      this.utils.handleError(err);
    });
  }


  async getUserData() {
    this.utils.presentLoading('');
    this.auth.getUserProfile().then(async (userProfileSnapshot: any) => {
      this.utils.dismissLoading();
      if (userProfileSnapshot.data()) {
        this.userData = await userProfileSnapshot.data();
        // console.log(this.userData);
        this.getReceipts();
      } else {
        this.auth.logout();
        this.utils.dismissLoading();
        // this.utils.handleError(err);
        this.router.navigate(['/login']);
      }
    }).catch((err) => {
      this.auth.logout();
      this.utils.dismissLoading();
      this.utils.handleError(err);
      this.router.navigate(['/login']);
    });
  }

  getReceipts() {
    this.receipts = [];
    this.utils.presentLoading('');
    this.user.getReceipts().then((snap) => {
      this.utils.dismissLoading();
      snap.docs.forEach((doc) => {
        this.receipts.push(doc.data())
        // this.totalImpressions += doc.data().views;
        // this.totalSales += doc.data().sales;
      });
    }).catch((err) => {
      this.auth.logout();
      this.utils.dismissLoading();
      this.utils.handleError(err);
      this.router.navigate(['/login']);
    });
  }


  compressFile() {

    this.imageCompress.uploadFile().then(({
      image,
      orientation
    }) => {

      this.imgResultBeforeCompress = image;
      console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
      console.log(orientation);
      this.imageCompress.compressFile(image, orientation, 25, 50).then(
        result => {
          this.imgResultAfterCompress = result;
          console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
          console.log(orientation);
          setTimeout(() => {
            let elem: any = document.querySelector('#upload-receipt');
            elem.click();
          }, 1000)
        }
      );

    });

  }

  async presentAlertRadio() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Select Option',
      inputs: [{
          name: 'radio1',
          type: 'radio',
          label: 'Take Picture',
          value: 'camera',
          checked: true
        },
        {
          name: 'radio2',
          type: 'radio',
          label: 'Upload from Device',
          value: 'filestack'
        }
      ],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Ok',
        handler: (choice) => {
          if (choice === 'camera') {
            this.takePicture();
          } else {
            const client = filestack.init('AMGxu7xp2TNeIMML5tN4Gz');
            client.picker({
              onFileUploadFinished: (res: any) => {
                // console.log(res);
                this.onUploadSuccess(res.url);
              },
              onFileUploadFailed: (res: object) => {
                this.onUploadError(res);
              }
            }).open();
          }
          console.log('Confirm Ok');
        }
      }]
    });

    await alert.present();
  }


}