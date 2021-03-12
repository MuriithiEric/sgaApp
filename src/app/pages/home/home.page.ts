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
      console.log(objectResponse);
      // console.log(res.body);
      let receipt = objectResponse.ParsedResults[0].ParsedText;
      console.log(receipt);
    }).catch((err) => {
      this.utils.dismissLoading();
      this.utils.handleError(err);
    });
  }




}
