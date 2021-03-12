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
    this.bs.extractTextFromImage(this.imageUrl).then((res) => {
      this.utils.dismissLoading();
      console.log(res.body);
    }).catch((err) => {
      this.utils.dismissLoading();
      this.utils.handleError(err);
    });
  }




}
