import {
  Component,
  OnInit
} from '@angular/core';
import {
  Router,
  RouterModule
} from '@angular/router';


/* -------------------------------- Services -------------------------------- */


import {
  UtilitiesService
} from './../../services/utilities.service';
import {
  AuthService
} from 'src/app/services/auth.service';





declare var Tawk_API;
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  firstName: any = '';
  lastName: any = '';
  password: any = '';
  email: any = '';

  showBox: boolean = false;
  dialog: any = {};
  
  constructor(
    private utils: UtilitiesService,
    private router: Router,
    private authService: AuthService) {}

  ngOnInit() { }


  async submit() {
    // this.submitted = true;
  
    this.utils.presentLoading('Just a Sec...')
    // const regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
    this.authService.createUser(this.email, this.password).then(async (user) => {
      this.authService.signup({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password
      }, user).then(() => {
        this.authService.sendEmailVerification().then(() => {
          this.router.navigate(['/tabs/home'], {
            replaceUrl: true
          })
        }).catch((err) => {
          // this.submitted = false;
          this.utils.dismissLoading();
          this.utils.presentAlert('ERROR', '', err.message);
        });
      }).catch((err) => {
        // this.submitted = false;
        this.utils.dismissLoading();
        this.utils.presentAlert('ERROR', '', err.message);
      });
    }).catch((err) => {
      // this.submitted = false;
      this.utils.dismissLoading();
      this.utils.presentAlert('ERROR', '', err.message);
    });
  }


  logIn() {
    this.router.navigate(['/login']);
  }



  

}