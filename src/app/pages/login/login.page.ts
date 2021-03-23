import {
  AuthService
} from './../../services/auth.service';
import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  AlertController,
  LoadingController
} from '@ionic/angular';
import {
  Router
} from '@angular/router';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  emailInput: any = '';
  passwordInput: any = '';
  showBox: boolean = false;
  dialog: any = {};
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router,
    private utils: UtilitiesService
  ) {}

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['eve.holt@reqres.in', [Validators.required, Validators.email]],
      password: ['cityslicka', [Validators.required, Validators.minLength(6)]],
    });
  }

  // async login() {
  //   this.utils.presentLoading('');

  //   this.authService.login(this.credentials.value).subscribe(
  //     async (res) => {
  //        this.utils.dimissLoading();
  //         this.router.navigateByUrl('/tabs', {
  //           replaceUrl: true
  //         });
  //       },
  //       async (res) => {
  //        this.utils.dimissLoading();
  //         const alert = await this.alertController.create({
  //           header: 'Login failed',
  //           message: res.error.error,
  //           buttons: ['OK'],
  //         });

  //         await alert.present();
  //       }
  //   );
  // }


  logIn() {
    this.utils.dismissLoading();
    if (this.emailInput.length > 4 && this.passwordInput.length > 4) {
      // this.loading = true;
      this.authService.loginUser(this.emailInput, this.passwordInput).then(() => {
        // this.utils.dismissLoading();
        // this.getUserData();
        this.router.navigate(['/tabs/home'], {
          replaceUrl: true
        });
      }).catch((err) => {
        this.utils.dismissLoading();
        // this.utils.handleError(err);
        this.openDialog({
          // title: 'ERROR',
          text: 'This account is not registered.'
        });
      });
    } else {
      this.utils.dismissLoading();
      // this.utils.presentAlert('ERROR', '', 'Invalid Password or Email.')
      this.openDialog({
        // title: 'ERROR',
        text: 'Invalid Password or Email.'
      });
    }
  }

  // Easy access for form fields
  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  openDialog(data) {
    this.showBox = true
    this.dialog = data;
  }

  closeDialog() {
    this.showBox = false;
  }

}