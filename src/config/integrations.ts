import type { Locale } from '@/i18n/config';

// Integrationen exakt aus Borderhaus_Homepage_v2.html (renderVals.integrations).
export const INTEGRATIONS: {
  name: string;
  logo: string;
  desc: Record<Locale, string>;
}[] = [
  {
    name: 'Shopify',
    logo: '/images/logo-shopify.png',
    desc: {
      de: 'Bestellungen, Bestände und Tracking automatisch synchron.',
      en: 'Orders, stock and tracking in automatic sync.',
    },
  },
  {
    name: 'WooCommerce',
    logo: '/images/logo-woocommerce.png',
    desc: {
      de: 'Plugin-Anbindung für deinen WordPress-Shop.',
      en: 'Plugin connection for your WordPress shop.',
    },
  },
  {
    name: 'Billbee',
    logo: '/images/logo-billbee.png',
    desc: {
      de: 'Multichannel-Aufträge sauber gebündelt.',
      en: 'Multichannel orders cleanly bundled.',
    },
  },
  {
    name: 'weclapp',
    logo: '/images/logo-weclapp.png',
    desc: { de: 'ERP-Sync für Bestände und Belege.', en: 'ERP sync for stock and documents.' },
  },
  {
    name: 'Smoasters',
    logo: '/images/logo-smoasters.png',
    desc: {
      de: 'Schwester-Plattform für Specialty Coffee, nahtlos angebunden.',
      en: 'Sister platform for specialty coffee, seamlessly connected.',
    },
  },
];
