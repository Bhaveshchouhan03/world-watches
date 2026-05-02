// import { CanActivateFn } from '@angular/router';

// export const authGuard: CanActivateFn = (route, state) => {
  
//   constructor(private sellerService:SellerService)
  
//   return this.sellerService.isSellerLoggedIn;
// };




import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
// import { Seller } from './seller-home'; // <--- Yahan 'Seller' likhein
import { Seller } from './services/seller';
// import { SellerHome } from './seller-home/seller-home';

export const authGuard: CanActivateFn = (route, state) => {
  const SellerService = inject(Seller); 
  const router = inject(Router);

  if(localStorage.getItem('seller')){
      return true;
    }

  if (SellerService.isSellerLoggedIn.value) { 
    return true;
  } else {
    return router.parseUrl('/seller-auth');
  }
};