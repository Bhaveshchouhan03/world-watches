import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { Seller } from './services/seller';
import { ProductService } from './services/product';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // ProductService,
    // provideRouter(routes, withHashLocation()),
    Seller,
    provideHttpClient(),
    provideRouter(routes), provideClientHydration(withEventReplay())
  ]
};
