import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  tk: {
    translation: {
      nav: {
        home: 'Baş sahypa',
        catalog: 'Katalog',
        cart: 'Sebet',
        wishlist: 'Halanlarym',
        account: 'Hasabym',
      },
      header: {
        catalogButton: 'Katalog',
        locationButton: 'Şäheriňiz',
        searchPlaceholder: 'Kariz-de gözleg',
        links: {
          installments: 'Kariz karta',
          travel: 'Syýahat we petekler',
          business: 'Biznes üçin',
          promotions: 'Arzanladyşlar',
          services: 'Hyzmatlar we hyzmatdaşlar',
          express: '1 günde eltip bermek',
        },
        city: 'Aşgabat',
        changeCity: 'Şäheri üýtget',
      },
      footer: {
        copyright: '© {{year}} Kariz Market',
        about: 'Biz barada',
        contact: 'Habarlasmak',
        privacy: 'Gizlinlik syýasaty',
        terms: 'Ulanyş şertleri',
      },
      home: {
        topProducts: 'Top harytlar',
        bestDeals: 'Iň uly arzanladyşlar',
        emptySection: 'Haryt tapylmady',
      },
      common: {
        search: 'Haryt gözlegi...',
      },
      product: {
        discountBadge: '-{{value}}%',
        wishlist: 'Halanlaryma goş',
        addToCart: 'Sebede goş',
        decreaseQty: 'Mukdaryny azaldyň',
        increaseQty: 'Mukdaryny artdyryň',
        units: {
          kg: 'kg',
          count: 'san',
          l: 'l',
        },
        untitled: 'Ady ýok haryt',
        uncategorized: 'Kategoriýasyz',
        specsTitle: 'Harydyň häsiýetleri',
        specsEmpty: 'Häzirki wagtda häsiýetler ýok.',
        vendorLabel: 'Tedarikçi',
        vendorMarketplace: 'Marketplace satyjysy',
        vendorGlobal: 'Global',
        skuLabel: 'SKU',
        recommendationsTitle: 'Maslahat berlen harytlar',
        recommendationsLoading: 'Arzanladyşly harytlar ýüklenýär...',
        recommendationsEmpty: 'Arzanladyşly haryt tapylmady.',
      },
      language: {
        turkmen: 'Türkmençe',
        russian: 'Rusça',
        short: {
          tk: 'TM',
          ru: 'RU',
        },
      },
    },
  },
  ru: {
    translation: {
      nav: {
        home: 'Главная',
        catalog: 'Каталог',
        cart: 'Корзина',
        wishlist: 'Избранное',
        account: 'Аккаунт',
      },
      header: {
        catalogButton: 'Каталог',
        locationButton: 'Ваш город',
        searchPlaceholder: 'Искать в Kariz',
        links: {
          installments: 'Рассрочка Kariz',
          travel: 'Путешествия и билеты',
          business: 'Для бизнеса',
          promotions: 'Скидки и акции',
          services: 'Сервисы и услуги',
          express: 'Доставка за 1 день',
        },
        city: 'Ашхабад',
        changeCity: 'Изменить город',
      },
      footer: {
        copyright: '© {{year}} Kariz Market',
        about: 'О нас',
        contact: 'Контакты',
        privacy: 'Политика конфиденциальности',
        terms: 'Условия использования',
      },
      home: {
        topProducts: 'Популярные товары',
        bestDeals: 'Лучшие скидки',
        emptySection: 'Товары не найдены',
      },
      common: {
        search: 'Поиск товаров...',
      },
      product: {
        discountBadge: '-{{value}}%',
        wishlist: 'В избранное',
        addToCart: 'Добавить в корзину',
        decreaseQty: 'Уменьшить количество',
        increaseQty: 'Увеличить количество',
        units: {
          kg: 'кг',
          count: 'шт',
          l: 'л',
        },
        untitled: 'Без названия',
        uncategorized: 'Без категории',
        specsTitle: 'Характеристики',
        specsEmpty: 'Характеристики не указаны.',
        vendorLabel: 'Поставщик',
        vendorMarketplace: 'Продавец маркетплейса',
        vendorGlobal: 'Глобальный',
        skuLabel: 'Артикул',
        recommendationsTitle: 'Рекомендуемые товары',
        recommendationsLoading: 'Загружаем товары со скидкой...',
        recommendationsEmpty: 'Скидочных товаров пока нет.',
      },
      language: {
        turkmen: 'Туркменский',
        russian: 'Русский',
        short: {
          tk: 'TM',
          ru: 'RU',
        },
      },
    },
  },
  en: {
    translation: {
      nav: {
        home: 'Home',
        catalog: 'Catalog',
        cart: 'Cart',
        wishlist: 'Wishlist',
        account: 'Account',
      },
      header: {
        catalogButton: 'Catalog',
        locationButton: 'Your city',
        searchPlaceholder: 'Search on Kariz',
        links: {
          installments: 'Installment card',
          travel: 'Travel & tickets',
          business: 'For business',
          promotions: 'Deals & discounts',
          services: 'Services & partners',
          express: 'Delivery in 1 day',
        },
        city: 'Ashgabat',
        changeCity: 'Change city',
      },
      footer: {
        copyright: '© {{year}} Kariz Market',
        about: 'About',
        contact: 'Contact',
        privacy: 'Privacy policy',
        terms: 'Terms of use',
      },
      home: {
        topProducts: 'Top products',
        bestDeals: 'Biggest savings',
        emptySection: 'No products found',
      },
      common: {
        search: 'Search products...',
      },
      product: {
        discountBadge: '-{{value}}%',
        wishlist: 'Add to wishlist',
        addToCart: 'Add to cart',
        decreaseQty: 'Decrease quantity',
        increaseQty: 'Increase quantity',
        units: {
          kg: 'kg',
          count: 'pcs',
          l: 'l',
        },
        untitled: 'Untitled product',
        uncategorized: 'Uncategorized',
        specsTitle: 'Characteristics',
        specsEmpty: 'No characteristics provided.',
        vendorLabel: 'Vendor',
        vendorMarketplace: 'Marketplace vendor',
        vendorGlobal: 'Global',
        skuLabel: 'SKU',
        recommendationsTitle: 'Recommended products',
        recommendationsLoading: 'Loading discounted items...',
        recommendationsEmpty: 'No discounted products available right now.',
      },
      language: {
        turkmen: 'Turkmen',
        russian: 'Russian',
        short: {
          tk: 'TM',
          ru: 'RU',
        },
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'tk',
    interpolation: { escapeValue: false },
    supportedLngs: ['tk', 'ru', 'en'],
  });

export default i18n;