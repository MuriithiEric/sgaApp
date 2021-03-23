import {
  Injectable
} from '@angular/core';
import {
  AngularFireAuth
} from '@angular/fire/auth';
import {
  AngularFirestore
} from '@angular/fire/firestore';
import {
  first
} from 'rxjs/operators';

import {
  auth
} from 'firebase/app';
import * as firebase from 'firebase/app';

import {
  Router
} from '@angular/router';
import {
  Platform
} from '@ionic/angular';
import {
  UtilitiesService
} from './utilities.service';

/* -------------------------------------------------------------------------- */
/*                              Push Notification                             */
/* -------------------------------------------------------------------------- */

import {
  Plugins,
  PushNotificationToken
} from '@capacitor/core';
const {
  PushNotifications
} = Plugins;

/* ---------------------------------- Http ---------------------------------- */
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
// import {
//   FCM
// } from '@capacitor-community/fcm';
// import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userId: string;
  public currentUser;
  public userProfile;
  // fcm: any = new FCM();
  endpoint: any = `https://us-central1-honeycoin-app.cloudfunctions.net/main`;
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private platform: Platform,
    private utils: UtilitiesService,
    private http: HttpClient,
  ) {}

  getUser(): Promise < firebase.User > {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  generateId() {
    return this.firestore.createId();
  }

  sendOTP(userPhone: any) {
    return this.http.get(`${this.endpoint}/twilio-otp`, {
      observe: 'response',
      params: {
        receiver: userPhone
      }
    });
  }


  loginUser(
    email: string,
    password: string
  ): Promise < firebase.auth.UserCredential > {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  createUser(
    email: string,
    password: string
  ): Promise < firebase.auth.UserCredential > {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  async signup(
    data: any,
    newUserCredential: any
  ): Promise < any > {
    try {
      return this.firestore
      .doc(`users/${newUserCredential.user.uid}`)
      .set({
        fullName: (data.firstName) + ' ' + (data.lastName),
        firstName: (data.firstName),
        lastName: (data.lastName),
        // phone: (data.phone.internationalNumber).replace(/\s/g, ''),
        // phone: data.phone,
        // phoneNumber: data.phone.number,
        email: data.email,
        password: data.password,
        userId: newUserCredential.user.uid,
        profilePicture: `https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}&size=512&background=4d2c3e&color=fff`,
        balance: 0,
        mileage: 0,
        timesFuelled: 0
      });
    } catch (error) {
      throw error;
    }
  }

  async getUserProfile(): Promise < firebase.firestore.DocumentSnapshot > {
    const user: firebase.User = await this.getUser();
    this.currentUser = user;
    this.userProfile = firebase.firestore().doc(`users/${user.uid}`);
    return this.userProfile.get();
  }

  async deleteAccount(): Promise < any > {
    var user = firebase.auth().currentUser;
    return user.delete();
  }


  async getUserByEmail(email): Promise < any > {
    return this.firestore.collection(`users`, ref =>
      ref.where('email', '==', email)
    );
  }

  async userNameCheck(uname) {
    const doc = await firebase.firestore().collection('users').where('userName', '==', uname).get();
    return doc.empty;
  }

  async getUserByPhone(phoneNumber): Promise < any > {
    return this.firestore.collection(`users`, ref =>
      ref.where('phoneNumber', '==', phoneNumber)
    );
  }

  async getUserByName(uname): Promise < any > {
    return this.firestore.collection(`users`, ref =>
      ref.where('userName', '==', uname)
    );
  }

  updateUserProfile(userId, userData) {
    return this.firestore
      .doc(`users/${userId}`)
      .update(userData);
  }

  async addBankAccount(data) {
    const user: firebase.User = await this.getUser();
    return firebase.firestore().collection(`users/${user.uid}/bank_accounts`).add(data);
  }

  async getBankAccounts() {
    const user: firebase.User = await this.getUser();
    return this.firestore.collection(`users/${user.uid}/bank_accounts`);
  }


  async addCreditCard(data) {
    const user: firebase.User = await this.getUser();
    return firebase.firestore().collection(`users/${user.uid}/credit_cards`).add(data);
  }

  async getCreditCards() {
    const user: firebase.User = await this.getUser();
    return this.firestore.collection(`users/${user.uid}/credit_cards`);
  }


  async addTransaction(data) {
    const user: firebase.User = await this.getUser();
    return firebase.firestore().collection(`users/${user.uid}/transactions`).add(data);
  }

  async getTransactions() {
    const user: firebase.User = await this.getUser();
    return this.firestore.collection(`users/${user.uid}/transactions`);
  }

  async loginWithGoogle() {
    return await this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
    // this.router.navigate(['/home']);
  }

  async sendEmailVerification() {
    await this.afAuth.auth.currentUser.sendEmailVerification()
  }

  async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  }

  resetPassword(email: string): Promise < void > {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  logout(): Promise < void > {
    return this.afAuth.auth.signOut();
  }


  
}