import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { DashboardPage } from '@/pages/Dashboard';
import { VendorsPage } from '@/pages/Vendors';
import { ProductsPage } from '@/pages/Products';
import { CategoriesPage } from '@/pages/Categories';
import { OrdersPage } from '@/pages/Orders';
import { CustomersPage } from '@/pages/Customers';
import { CouponsPage } from '@/pages/Coupons';
import { ReportsPage } from '@/pages/Reports';
import { BannersPage } from '@/pages/Banners';
import { SettingsPage } from '@/pages/Settings';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/vendors" element={<VendorsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/coupons" element={<CouponsPage />} />
          <Route path="/banners" element={<BannersPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

