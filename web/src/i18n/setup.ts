import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: { translation: { nav: { home: 'Home', catalog: 'Catalog', cart: 'Cart', wishlist: 'Wishlist', account: 'Account' }, common: { search: 'Search products...' } } },
  ru: { translation: { nav: { home: 'Главная', catalog: 'Каталог', cart: 'Корзина', wishlist: 'Закладки', account: 'Аккаунт' }, common: { search: 'Поиск товаров...' } } },
  tk: { translation: { nav: { home: 'Baş sahypa', catalog: 'Katalog', cart: 'Sebet', wishlist: 'Halanlarym', account: 'Hasap' }, common: { search: 'Haryt gözleg...' } } },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({ resources, fallbackLng: 'en', interpolation: { escapeValue: false } });

export default i18n;

