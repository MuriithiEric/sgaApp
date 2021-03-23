import {
  Injectable
} from '@angular/core';
import {
  ToastController,
  LoadingController,
  AlertController
} from '@ionic/angular';
// ES6 Modules or TypeScript
// import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  loader: any;
  isLoading = false;
  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController, public loadingCtrl: LoadingController) {

  }

  async presentAlert(header: string, sub: string, msg: string) {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: header,
      subHeader: sub,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentToast(message, cssClass) {
    let toast = await this.toastCtrl.create({
      mode: 'ios',
      message: message,
      duration: 3000,
      position: 'top',
      animated: true,
      cssClass: cssClass
    });
    await toast.present();
  }

  async presentLoading(message) {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      mode: 'ios',
      message: message,
      duration: 1000000,
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }


  async handleError(e): Promise < void > {
    const alert = await this.alertCtrl.create({
      message: e.message,
      mode: 'ios',
      buttons: [{
        text: 'Ok',
        role: 'cancel'
      }]
    });
    await alert.present();
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }

  /* -------------------------------------------------------------------------- */
  /*                                 SweetAlert                                 */
  /* -------------------------------------------------------------------------- */

  // errorAlert(error) {
  //   Swal.fire(
  //     'Error',
  //     error,
  //     'error'
  //   )
  // }



}