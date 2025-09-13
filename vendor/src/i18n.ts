import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { store } from './store'

const resources = {
  en: {
    translation: {
      app: {
        title: 'Käriz Vendor Portal',
      },
      nav: {
        dashboard: 'Dashboard',
        products: 'Products',
        orders: 'Orders',
        inventory: 'Inventory',
        reports: 'Reports',
        settings: 'Account Settings',
      },
      actions: {
        addProduct: 'Add Product',
        markShipped: 'Mark as Shipped',
      },
    },
  },
  fa: {
    translation: {
      app: { title: 'پرتال فروشندگان کاریز' },
      nav: {
        dashboard: 'داشبورد',
        products: 'محصولات',
        orders: 'سفارش‌ها',
        inventory: 'موجودی',
        reports: 'گزارش‌ها',
        settings: 'تنظیمات حساب',
      },
      actions: {
        addProduct: 'افزودن محصول',
        markShipped: 'ارسال شد',
      },
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: store.getState().ui.language,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
