import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { HomePage } from '../pages/Home';
import { CatalogPage } from '../pages/Catalog';
import { ProductPage } from '../pages/Product';
import { SearchPage } from '../pages/Search';
import { CartPage } from '../pages/Cart';
import { CheckoutPage } from '../pages/Checkout';
import { OrderConfirmationPage } from '../pages/OrderConfirmation';
import { AboutPage } from '../pages/About';
import { ContactPage } from '../pages/Contact';
import { PrivacyPage } from '../pages/Privacy';
import { TermsPage } from '../pages/Terms';
import { LoginPage } from '../pages/auth/Login';
import { RegisterPage } from '../pages/auth/Register';
import { ForgotPasswordPage } from '../pages/auth/ForgotPassword';
import { DashboardPage } from '../pages/account/Dashboard';
import { OrdersPage } from '../pages/account/Orders';
import { WishlistPage } from '../pages/account/Wishlist';
import { LoyaltyPage } from '../pages/account/Loyalty';
import { AddressesPage } from '../pages/account/Addresses';
import { SettingsPage } from '../pages/account/Settings';
import { VendorStorefrontPage } from '../pages/VendorStorefront';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/catalog/:categoryId?', element: <CatalogPage /> },
      { path: '/product/:id', element: <ProductPage /> },
      { path: '/search', element: <SearchPage /> },
      { path: '/cart', element: <CartPage /> },
      { path: '/checkout', element: <CheckoutPage /> },
      { path: '/order-confirmation/:id', element: <OrderConfirmationPage /> },
      { path: '/vendor/:id', element: <VendorStorefrontPage /> },
      // static
      { path: '/about', element: <AboutPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/privacy', element: <PrivacyPage /> },
      { path: '/terms', element: <TermsPage /> },
      // auth
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      // account
      { path: '/account', element: <DashboardPage /> },
      { path: '/account/orders', element: <OrdersPage /> },
      { path: '/account/wishlist', element: <WishlistPage /> },
      { path: '/account/loyalty', element: <LoyaltyPage /> },
      { path: '/account/addresses', element: <AddressesPage /> },
      { path: '/account/settings', element: <SettingsPage /> },
    ],
  },
]);

export const AppRouter: React.FC = () => <RouterProvider router={router} />;

