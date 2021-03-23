import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CropImagePage } from './crop-image.page';

describe('CropImagePage', () => {
  let component: CropImagePage;
  let fixture: ComponentFixture<CropImagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropImagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CropImagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
