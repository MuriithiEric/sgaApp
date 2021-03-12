import { Component, OnInit } from '@angular/core';
import { BackEndService } from 'src/app/services/back-end.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

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
  constructor(
    private bs: BackEndService,
    private utils: UtilitiesService
  ) { }

  ngOnInit() {
  }

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


  




}
