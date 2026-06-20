// English content, mirrors the German structure (source of truth). Voice "you",
// no em dashes. [PH] marks placeholders Marcel / the content step finalises.
import type { Dictionary } from './de';

const en: Dictionary = {
  meta: {
    name: 'Borderhaus',
    tagline: 'Cross-border fulfilment from the tri-border region',
    description:
      'Borderhaus is organic-certified cross-border fulfilment from the tri-border region. Domestic shipping in DE and NL from a single stock, for brands with impact.',
  },
  nav: {
    howItWorks: 'How it works',
    impact: 'Impact and customers',
    whoFor: 'Who it is for',
    services: 'Services',
    integrations: 'Integrations',
    locations: 'Locations',
    pricing: 'Pricing',
    useCases: 'Use cases',
    knowledge: 'Knowledge',
    about: 'About',
    contact: 'Contact',
    menu: 'Menu',
    close: 'Close',
  },
  cta: {
    requestQuote: 'Request a quote',
    talkToUs: 'Talk to us',
    calculate: 'Calculate price',
    learnMore: 'Learn more',
    allArticles: 'All articles',
    backHome: 'Back to home',
  },
  home: {
    hero: {
      eyebrow: 'Cross-border fulfilment',
      title: 'One stock,',
      titleAccent: 'two home markets.',
      subtitle:
        'Borderhaus ships your orders as domestic parcels in Germany and the Netherlands. Organic-certified, fast and straight from the tri-border region to your customers.',
      trust: ['EU organic certified', 'Domestic shipping DE and NL', 'Plug and play integrations'],
    },
    proof: {
      heading: 'Why Borderhaus fulfilment',
      intro: 'Six reasons brands with impact hand us their logistics.',
      points: [
        {
          label: 'Dual-domestic',
          headline: '2 markets',
          body: 'Domestic shipping in DE and NL from a single stock, no double warehousing.',
        },
        {
          label: 'Certified',
          headline: 'EU organic',
          body: 'Organic-certified fulfilment for food brands and sensitive ranges.',
        },
        {
          label: 'Speed',
          headline: '24h',
          body: 'Fast turnaround from intake to dispatch. [PH: real SLA to come from Marcel.]',
        },
        {
          label: 'Integrations',
          headline: 'Plug and play',
          body: 'Shopify, WooCommerce, Billbee, weclapp and a REST API without the fiddling.',
        },
        {
          label: 'Border location',
          headline: 'Tri-border',
          body: 'DE, NL and BE sit in the direct catchment area of your deliveries.',
        },
        {
          label: 'Stance',
          headline: 'Impact',
          body: 'Fulfilment for brands with impact, not for the lowest common denominator.',
        },
      ],
    },
    howItWorks: {
      eyebrow: 'How it works',
      heading: 'The dual principle',
      intro:
        'You deliver once. We turn it into two domestic markets. Same goods, two national shipping profiles, one invoice.',
      principle: {
        title: 'One stock, two domestic shipments',
        steps: [
          {
            label: 'Step 1',
            title: 'Deliver',
            body: 'You send your stock once to our warehouse in the tri-border region.',
          },
          {
            label: 'Step 2',
            title: 'Sync',
            body: 'We connect your shop and mirror stock live into both markets.',
          },
          {
            label: 'Step 3',
            title: 'Ship domestically',
            body: 'Orders go out as domestic parcels, in DE and in NL.',
          },
        ],
      },
      cta: 'See the full flow',
    },
    segments: {
      eyebrow: 'Who it is for',
      heading: 'Built for brands with impact',
      intro: 'If your range has a stance and both home markets should grow, Borderhaus fits.',
      items: [
        {
          title: 'Food and organic',
          body: 'EU organic certified handling for food and sensitive products.',
        },
        { title: 'Beauty and care', body: 'Clean handling, sorted storage, tidy returns.' },
        {
          title: 'Impact brands',
          body: 'Brands that take their supply chain as seriously as their product.',
        },
      ],
    },
    integrations: {
      eyebrow: 'Integrations',
      heading: 'Connected in minutes, not weeks',
      intro:
        'Borderhaus plugs straight into your shop and tools. Stock, orders and tracking run automatically.',
      logos: ['Shopify', 'WooCommerce', 'Billbee', 'weclapp', 'REST API'],
    },
    ctaBand: {
      heading: 'Ready for two home markets?',
      body: 'Calculate your indicative range or request a quote right away.',
    },
  },
  pages: {
    howItWorks: {
      title: 'How cross-border fulfilment works at Borderhaus',
      lead: 'One stock, two domestic markets, one invoice. Here is how we work together from onboarding to dispatch.',
    },
    impact: {
      title: 'Impact and customers',
      lead: 'We work with brands that move things. Here we show who ships with us and what we stand for.',
      pledgeHeading: 'Borderhaus Impact Pledge',
      pledgeBody:
        '[PH: Impact Pledge text from Marcel.] We commit to fair logistics, short routes and transparent partnerships.',
      clientsHeading: 'Brands that ship with us',
      clientsNote: '[PH: Which brands may be shown by name or logo comes from Marcel.]',
    },
    whoFor: {
      title: 'Who Borderhaus is built for',
      lead: 'For growing D2C brands that want to be at home in Germany and the Netherlands.',
    },
    services: {
      title: 'Services',
      lead: 'From intake through storage and pick and pack to returns and value-added services.',
      items: [
        { title: 'Goods intake', body: 'Receiving, checking and storing your stock.' },
        { title: 'Storage', body: 'Sorted, organic-compliant storage in the tri-border region.' },
        { title: 'Pick and pack', body: 'Careful picking with your branding.' },
        { title: 'Shipping DE and NL', body: 'Domestic shipping into both home markets from one stock.' },
        { title: 'Returns', body: 'Clean returns handling with status feedback.' },
        { title: 'Value-added services', body: 'Bundling, inserts, sets and promo handling on request.' },
      ],
    },
    integrations: {
      title: 'Integrations',
      lead: 'Plug and play with the systems you already use. Stock, orders and tracking run automatically.',
    },
    locations: {
      title: 'Locations',
      lead: 'Our fulfilment centre sits in the tri-border region, with DE, NL and BE in the direct catchment area.',
    },
    pricing: {
      title: 'Pricing',
      lead: 'Set your key figures and get an indicative monthly range instantly. For a binding quote you pass your inputs straight on.',
      disclaimer:
        'All figures are non-binding estimates based on indicative tariffs. We build the binding quote individually.',
    },
    useCases: {
      title: 'Use cases',
      lead: 'How brands use Borderhaus, from launching in the Netherlands to scaling in the food segment.',
    },
    knowledge: {
      title: 'Knowledge',
      lead: 'Guides and answers on cross-border fulfilment, organic logistics and shipping in DE and NL.',
      empty: 'The knowledge base is being built. Pillar and cluster articles will appear here soon.',
    },
    about: {
      title: 'About us',
      lead: 'Borderhaus is an independent brand of Social Ecosystems AG. We build logistics for brands with impact.',
    },
    contact: {
      title: 'Contact',
      lead: 'Tell us about your brand and your volume. We will come back with an honest assessment.',
    },
    imprint: { title: 'Imprint', lead: '[PH: Imprint content from Marcel.]' },
    privacy: { title: 'Privacy', lead: '[PH: Privacy policy from Marcel.]' },
    terms: { title: 'Terms', lead: '[PH: Terms content from Marcel.]' },
  },
  calculator: {
    heading: 'Your indicative range',
    inputs: {
      orders: 'Orders per month',
      picks: 'Picks per order',
      storage: 'Storage need (pallets)',
      markets: 'Target markets',
      weight: 'Weight class',
      returns: 'Return rate',
      services: 'Value-added services',
    },
    markets: { de: 'Germany', nl: 'Netherlands', eu: 'Rest of EU' },
    weights: { light: 'Light (up to 1 kg)', medium: 'Medium (1 to 5 kg)', heavy: 'Heavy (over 5 kg)' },
    valueServices: { branding: 'Inserts and branding', bundling: 'Bundling and sets', giftwrap: 'Gift wrapping' },
    breakdown: {
      storage: 'Storage',
      pickpack: 'Pick and pack',
      shipping: 'Shipping',
      returns: 'Returns',
      total: 'Estimated range per month',
    },
    perMonth: 'per month',
    estimateNote: 'Estimate',
    handoff: 'These inputs are passed on with your request.',
  },
  form: {
    heading: 'Request a quote',
    fields: {
      brand: 'Brand',
      shopSystem: 'Shop system',
      volume: 'Volume per month',
      markets: 'Target markets',
      currentLogistics: 'Current logistics provider',
      desiredStart: 'Desired start',
      message: 'Message',
      name: 'Your name',
      email: 'Email',
      phone: 'Phone (optional)',
      consent: 'I agree that Borderhaus may process my details to handle this request.',
    },
    placeholders: {
      brand: 'Your brand name',
      shopSystem: 'e.g. Shopify',
      volume: 'e.g. 1500 orders',
      currentLogistics: 'e.g. self-fulfilment',
      message: 'What is it about?',
    },
    submit: 'Send request',
    sending: 'Sending …',
    successHeading: 'Thanks, your request is in.',
    successBody: 'We will come back shortly with an honest assessment.',
    errorHeading: 'That did not work.',
    errorBody: 'Please try again or write to us directly.',
    required: 'Required',
    invalidEmail: 'Please enter a valid email.',
    consentRequired: 'Please agree to the processing.',
  },
  footer: {
    tagline: 'Cross-border fulfilment for brands with impact.',
    columns: { product: 'Product', company: 'Company', legal: 'Legal' },
    parent: 'A brand of Social Ecosystems AG',
    rights: 'All rights reserved.',
  },
  cookie: {
    text: 'We use privacy-friendly analytics without third-party cookies. Optional statistics help us improve the site.',
    accept: 'Allow statistics',
    decline: 'Only necessary',
  },
  langSwitch: { label: 'Language', de: 'DE', en: 'EN' },
};

export default en;
