import {
  Injectable
} from '@angular/core';
import {
  AngularFirestore
} from '@angular/fire/firestore';
import {
  AuthService
} from './auth.service';

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';


/* ------------------------------ // MommentJS ------------------------------ */
import * as moment from 'moment';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private firestore: AngularFirestore,
    private auth: AuthService,

  ) {}


  /* ---------------- Update Any Existing Field in the User Doc --------------- */
  async updateUserInfo(data) {
    const user: firebase.User = await this.auth.getUser();
    return firebase.firestore().doc(`users/${user.uid}`).update(data);
  }

  async uploadPhoto(imageUrl) {
    if (imageUrl != null) {
      let id = this.firestore.createId();
      const storageRef = firebase.storage().ref(`/photos/${id}/${id}-receipt.png`);
      let uploadTask = await storageRef.putString(imageUrl, 'base64', {
        contentType: 'image/png'
      });
      let urlTask: any = await storageRef.getDownloadURL();
      return urlTask;
    } else {
      throw new Error('Kindly Log In First.');
    }
  }

  uploadReceipt(obj) {
    let id = this.firestore.createId();
    obj.receiptId = id;
    return firebase
      .firestore()
      .doc(`receipts/${id}`).set(obj);
  }

  async getReceipts() {
    const user = await this.auth.getUser();
    return firebase.firestore().collection('receipts').where('userId', '==', user.uid).get();
  }

  async updateEmail(newMail) {
    const user: firebase.User = await this.auth.getUser();
    return user.updateEmail(newMail)
  }

  async logError(obj, userId) {
    let timestamp = moment().format();
    let id = this.firestore.createId();
    obj.userId = userId;
    return firebase
      .firestore()
      .doc(`platform_errors/${id}`).set(obj);
  }

  async updatePassword(newPass) {
    const user: firebase.User = await this.auth.getUser();
    return user.updatePassword(newPass)
  }

  /* ---------------------------- Get User by Email --------------------------- */

  async getUserByEmail(email: string): Promise < any > {
    return this.firestore.collection(`users`, ref =>
      ref.where('email', '==', email)
    );
  }

  async getUserData(): Promise < firebase.firestore.DocumentSnapshot > {
    const user = await this.auth.getUser();
    return firebase.firestore().doc(`users/${user.uid}`).get();
  }

  async getUserDataRealTime() {
    const user: firebase.User = await this.auth.getUser();
    return await firebase.firestore().doc(`users/${user.uid}`);
  }

  /* -------------------------------------------------------------------------- */
  /*                                    MISC                                    */
  /* -------------------------------------------------------------------------- */


  createId() {
    return this.firestore.createId();
  }



}