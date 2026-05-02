import { Routes } from '@angular/router';
import { Home } from './home/home';
import { SellerAuth } from './seller-auth/seller-auth';
import { SellerHome } from './seller-home/seller-home';
import { authGuard } from './auth-guard';
import { SellerAddProduct } from './seller-add-product/seller-add-product';
import { Component } from '@angular/core';
import { SellerUpdateProduct } from './seller-update-product/seller-update-product';
import { Search } from './search/search';
import { ProductDetails } from './product-details/product-details';
import { UserAuth } from './user-auth/user-auth';
import { Footer } from './footer/footer';
import { CartPage } from './cart-page/cart-page';
import { Checkout } from './checkout/checkout';
import {  MyOrder } from './my-order/my-order';



export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        component:Home,
        path:'home'
    },
    {
        component:SellerAuth,
        path: 'seller-auth'
    },
    {
        component:SellerHome,
        path:'seller-home',
        // canActivate:[authGuard]
    },
    {
        component:SellerAddProduct,
        path: 'seller-add-product',
        // canActivate:[authGuard]
    },
    {
        component:SellerUpdateProduct,
        path:'seller-update-product/:id',
    },
    {
        component:Search,
        path:'search/:query',
    },
    {
        component:ProductDetails,
        path:'details/:productId',
    },
    {
        component:UserAuth,
        path:'user-auth',
    },
    {
        component:Footer,
        path:'footer',
    },
    {
        component:CartPage,
        path:'cart-page',
    },
    {
        component:Checkout,
        path:'checkout'
    },
    {
        component:MyOrder,
        path:'my-orders'
    },
];

