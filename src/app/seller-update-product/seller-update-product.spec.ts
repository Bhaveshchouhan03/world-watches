import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerUpdateProduct } from './seller-update-product';

describe('SellerUpdateProduct', () => {
  let component: SellerUpdateProduct;
  let fixture: ComponentFixture<SellerUpdateProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerUpdateProduct],
    }).compileComponents();

    fixture = TestBed.createComponent(SellerUpdateProduct);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
