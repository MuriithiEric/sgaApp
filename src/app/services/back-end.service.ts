import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackEndService {
  endpoint: any = 'https://api.honeycoin.app';
  apiKey: any = '848ebd4e5888957';
  constructor(
    private http: HttpClient
  ) { }

  extractTextFromImage(imageUrl) {
    return this.http.get(`${this.endpoint}/ocr-extract-text`, {
      headers: {},
      observe: 'response',
      params: {
        "imageUrl": imageUrl,
      }
    }).toPromise();
  }

  extractDataFromImage(imageUrl) {
    return this.http.get(`https://api.ocr.space/parse/imageurl?apikey=${this.apiKey}&url=${imageUrl}&isTable=true`, {
      headers: {},
      observe: 'response'
    }).toPromise();
  }



}
