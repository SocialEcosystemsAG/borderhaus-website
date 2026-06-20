// Kanonische Hauptdomain. Sprachpfade /de und /en. ccTLDs (.de/.nl/.at/.org)
// werden auf Hosting-Ebene per 301 hierher gemappt.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://borderhaus.com';

export const ORG = {
  legalName: 'Social Ecosystems AG',
  brand: 'Borderhaus',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hallo@borderhaus.com',
  // [PH: echte Standortdaten von Marcel.] Dual-Domestic: je ein Eintrag DE / NL.
  locations: [
    {
      country: 'DE',
      name: 'Borderhaus Fulfilment Deutschland',
      streetAddress: '[PH: Straße]',
      postalCode: '[PH]',
      city: '[PH: Stadt]',
      addressCountry: 'DE',
    },
    {
      country: 'NL',
      name: 'Borderhaus Fulfilment Nederland',
      streetAddress: '[PH: Straat]',
      postalCode: '[PH]',
      city: '[PH: Plaats]',
      addressCountry: 'NL',
    },
  ],
};
