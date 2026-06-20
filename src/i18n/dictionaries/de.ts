// Deutsche Inhalte = Typ-Quelle der Wahrheit. Brand Voice "du", keine
// Gedankenstriche. Mit [PH] markierte Stellen sind Platzhalter, die Marcel
// bzw. der Content-Schritt final liefert (echte SLA, Kundennamen, Rechtstexte).
const de = {
  meta: {
    name: 'Borderhaus',
    tagline: 'Cross-Border-Fulfilment aus dem Dreiländereck',
    description:
      'Borderhaus ist bio-zertifiziertes Cross-Border-Fulfilment aus dem Dreiländereck. Inlandsversand in DE und NL aus einem Bestand, für Brands mit Wirkung.',
  },
  nav: {
    howItWorks: 'So funktioniert es',
    impact: 'Impact und Kunden',
    whoFor: 'Für wen',
    services: 'Leistungen',
    integrations: 'Integrationen',
    locations: 'Standorte',
    pricing: 'Preisrechner',
    useCases: 'Use Cases',
    knowledge: 'Wissen',
    about: 'Über uns',
    contact: 'Kontakt',
    menu: 'Menü',
    close: 'Schließen',
  },
  cta: {
    requestQuote: 'Angebot anfordern',
    talkToUs: 'Sprich mit uns',
    calculate: 'Preis berechnen',
    learnMore: 'Mehr erfahren',
    allArticles: 'Alle Artikel',
    backHome: 'Zurück zur Startseite',
  },
  home: {
    // Hero exakt aus Borderhaus_Homepage_v2.html, Headline-Claim freigegeben.
    hero: {
      eyebrow: 'Fulfillment auf der Grenze DE / NL',
      t1: 'Ein Haus.',
      t2: 'Zwei Länder.',
      t3: 'Kein Aufschlag.', // dritte Zeile in Orange
      sub: 'Borderhaus liegt direkt auf der deutsch-niederländischen Grenze und speist dein Paket ins Inlandsnetz von beiden Ländern ein. Zwei Heimatmärkte aus einem Bestand, ganz ohne Cross-Border-Aufschlag.',
      cta1: 'Preis berechnen',
      cta2: 'So funktioniert es',
      stats: [
        { v: '2', l: 'Inlandsnetze aus einem Lager' },
        { v: '0 %', l: 'Cross-Border-Aufschlag' },
        { v: '3', l: 'Länder im Einzugsgebiet' },
      ],
      tagline: 'Grenzenlos schnell.',
    },
    proof: {
      label: 'Warum Borderhaus',
      heading: 'Warum Borderhaus Fulfilment',
      sub: 'Sechs Gründe, warum Brands ihr Fulfilment an die Grenze geben.',
      points: [
        { icon: 'route', k: 'Dual-Domestic', t: '2 Märkte', b: 'Inlandsversand in DE und NL aus einem Bestand.' },
        { icon: 'badge-check', k: 'Zertifiziert', t: 'EU-Bio', b: 'Bio-zertifiziertes Fulfilment für Lebensmittel-Brands.' },
        { icon: 'timer', k: 'Tempo', t: '24h', b: 'Schnelle Bearbeitung, echte SLA folgt von Marcel.' },
        { icon: 'plug-zap', k: 'Integrationen', t: 'Plug & Play', b: 'Shopify, WooCommerce, Billbee, weclapp, REST-API.' },
        { icon: 'map-pin', k: 'Grenzlage', t: 'Dreiländereck', b: 'DE, NL und BE im Einzugsgebiet.' },
        { icon: 'heart-handshake', k: 'Haltung', t: 'Impact', b: 'Fulfilment für Brands mit Wirkung.' },
      ],
    },
    calcTeaser: {
      label: 'Preisrechner',
      t: 'In zwei Minuten zur Kosteneinschätzung',
      b: 'Schieb deine Bestellungen, Zielmärkte und Retourenquote ein und sieh sofort eine indikative Monatsspanne. Danach machst du daraus mit einem Klick eine Anfrage.',
      cta: 'Jetzt rechnen',
      from: 'ab',
      value: '€22840',
      unit: 'pro Monat, indikativ',
    },
    integrationsStrip: { t: 'Integrationen, die einfach laufen', all: 'Alle ansehen' },
    teaser: {
      impLabel: 'Impact ist das Herzstück',
      impHomeT: 'Wir wachsen, damit Brands mit Wirkung wachsen',
      impHomeB: 'Borderhaus nimmt Brands mit Haltung die Logistik ab. Lern unsere Kunden und ihren Impact kennen, plus unseren Impact Pledge.',
      impHomeCta: 'Impact ansehen',
      ucLabel: 'Use Case',
      ucHomeT: 'Impact-Brand wächst nach Benelux',
      ucHomeB: 'Wie eine DACH-Brand mit 8.000 Bestellungen im Monat ohne zweites Lager in die Niederlande skaliert hat.',
      ucRead: 'Case lesen',
      kbLabel: 'Knowledge Base',
      kbHomeT: 'Antworten auf Cross-Border-Fragen',
      kbHomeB: 'Klare, zitierbare Erklärungen rund um EU-Fulfillment, Inlandskonditionen und Retouren.',
      kbTopics: ['Cross-Border-Fulfillment EU', 'Fulfillment DE / NL', 'EU-Retouren', 'Inlandskonditionen'],
    },
    final: {
      t: 'Grenzenlos schnell starten',
      b: 'Rechne deine Kosten, fordere ein Angebot an und wir holen dein Fulfillment auf die Grenze.',
      cta2: 'Angebot anfordern',
    },
    howItWorks: {
      eyebrow: 'So funktioniert es',
      heading: 'Das Dual-Prinzip',
      intro:
        'Du lieferst einmal ein. Wir machen daraus zwei Inlandsmärkte. Dieselbe Ware, zwei nationale Versandprofile, eine Abrechnung.',
      principle: {
        title: 'Ein Bestand, zwei Inlandsversände',
        steps: [
          {
            label: 'Schritt 1',
            title: 'Anliefern',
            body: 'Du sendest deinen Bestand einmal an unser Lager im Dreiländereck.',
          },
          {
            label: 'Schritt 2',
            title: 'Synchronisieren',
            body: 'Wir verbinden deinen Shop und spiegeln Bestände live in beide Märkte.',
          },
          {
            label: 'Schritt 3',
            title: 'Inländisch versenden',
            body: 'Bestellungen gehen als Inlandssendung raus, in DE wie in NL.',
          },
        ],
      },
      cta: 'Den ganzen Ablauf ansehen',
    },
    segments: {
      eyebrow: 'Für wen',
      heading: 'Gebaut für Brands mit Wirkung',
      intro:
        'Wenn dein Sortiment Haltung hat und beide Heimatmärkte wachsen sollen, passt Borderhaus.',
      items: [
        {
          title: 'Food und Bio',
          body: 'EU-Bio-zertifiziertes Handling für Lebensmittel und empfindliche Produkte.',
        },
        {
          title: 'Beauty und Care',
          body: 'Sauberes Handling, sortenreine Lagerung, saubere Retouren.',
        },
        {
          title: 'Impact-Brands',
          body: 'Marken, die ihre Lieferkette so ernst nehmen wie ihr Produkt.',
        },
      ],
    },
    integrations: {
      eyebrow: 'Integrationen',
      heading: 'Verbunden in Minuten, nicht Wochen',
      intro:
        'Borderhaus dockt direkt an deinen Shop und deine Tools an. Bestände, Bestellungen und Tracking laufen automatisch.',
      logos: ['Shopify', 'WooCommerce', 'Billbee', 'weclapp', 'REST-API'],
    },
    ctaBand: {
      heading: 'Bereit für zwei Heimatmärkte?',
      body: 'Berechne deine indikative Spanne oder fordere direkt ein Angebot an.',
    },
  },
  pages: {
    howItWorks: {
      title: 'So funktioniert Cross-Border-Fulfilment bei Borderhaus',
      lead: 'Ein Bestand, zwei Inlandsmärkte, eine Abrechnung. So läuft die Zusammenarbeit von der Anbindung bis zum Versand.',
    },
    impact: {
      title: 'Impact und Kunden',
      lead: 'Wir arbeiten mit Brands, die etwas bewegen. Hier zeigen wir, wer mit uns versendet und wofür wir stehen.',
      pledgeHeading: 'Borderhaus Impact Pledge',
      pledgeBody:
        '[PH: Impact Pledge Text von Marcel.] Wir verpflichten uns auf faire Logistik, kurze Wege und transparente Partnerschaften.',
      clientsHeading: 'Brands, die mit uns versenden',
      clientsNote:
        '[PH: Welche Brands namentlich oder mit Logo gezeigt werden dürfen, liefert Marcel.]',
    },
    whoFor: {
      title: 'Für wen Borderhaus gebaut ist',
      lead: 'Für wachsende D2C-Brands, die in Deutschland und den Niederlanden zu Hause sein wollen.',
    },
    services: {
      title: 'Leistungen',
      lead: 'Von Wareneingang über Lagerung und Pick and Pack bis zu Retouren und Mehrwertservices.',
      items: [
        { title: 'Wareneingang', body: 'Annahme, Prüfung und Einlagerung deines Bestands.' },
        { title: 'Lagerung', body: 'Sortenreine, bio-konforme Lagerung im Dreiländereck.' },
        { title: 'Pick and Pack', body: 'Sorgfältige Kommissionierung mit deinem Branding.' },
        { title: 'Versand DE und NL', body: 'Inlandsversand in beide Heimatmärkte aus einem Bestand.' },
        { title: 'Retouren', body: 'Saubere Retourenabwicklung mit Statusrückmeldung.' },
        { title: 'Mehrwertservices', body: 'Bundling, Beilagen, Sets und Aktionshandling auf Wunsch.' },
      ],
    },
    integrations: {
      title: 'Integrationen',
      lead: 'Plug and Play mit den Systemen, die du schon nutzt. Bestände, Orders und Tracking laufen automatisch.',
    },
    locations: {
      title: 'Standorte',
      lead: 'Unser Fulfilment-Zentrum liegt im Dreiländereck, mit DE, NL und BE im direkten Einzugsgebiet.',
    },
    pricing: {
      title: 'Preisrechner',
      lead: 'Stell deine Eckdaten ein und erhalte sofort eine indikative monatliche Spanne. Für ein verbindliches Angebot reichst du deine Eingaben direkt weiter.',
      disclaimer:
        'Alle Werte sind unverbindliche Schätzungen auf Basis indikativer Tarife. Das verbindliche Angebot erstellen wir individuell.',
    },
    useCases: {
      title: 'Use Cases',
      lead: 'Wie Brands Borderhaus einsetzen, von der Markteinführung in den Niederlanden bis zur Skalierung im Food-Segment.',
    },
    knowledge: {
      title: 'Wissen',
      lead: 'Leitfäden und Antworten rund um Cross-Border-Fulfilment, Bio-Logistik und den Versand in DE und NL.',
      empty: 'Die Wissensdatenbank wird gerade aufgebaut. Bald findest du hier Pillar- und Cluster-Artikel.',
    },
    about: {
      title: 'Über uns',
      lead: 'Borderhaus ist eine eigenständige Marke der Social Ecosystems AG. Wir bauen Logistik für Brands mit Wirkung.',
    },
    contact: {
      title: 'Kontakt',
      lead: 'Erzähl uns von deiner Brand und deinem Volumen. Wir melden uns mit einer ehrlichen Einschätzung.',
    },
    imprint: { title: 'Impressum', lead: '[PH: Impressum-Inhalt von Marcel.]' },
    privacy: { title: 'Datenschutz', lead: '[PH: Datenschutzerklärung von Marcel.]' },
    terms: { title: 'AGB', lead: '[PH: AGB-Inhalt von Marcel.]' },
  },
  // Impact-Seite exakt nach Borderhaus_Impact_Rhythmus.html (Rhythmus-Variante).
  impactPage: {
    heroLabel: 'Impact ist das Herzstück',
    heroT: 'Impact und Kunden',
    heroSub:
      'Borderhaus existiert, damit Brands mit Wirkung wachsen können. Wir nehmen ihnen die Logistik ab, damit ihre Energie in die Mission fließt.',
    custT: 'Brands, für die wir liefern',
    custSub: 'Echte Kunden, echter Impact. Logos und Aussagen erscheinen nach Freigabe der jeweiligen Brand.',
    logoSlot: 'Logo nach Freigabe',
    joinTag: 'Deine Brand',
    joinT: 'Du machst Impact?',
    joinB: 'Dann passt du hierher. Lass uns dein Fulfillment übernehmen, damit deine Energie in die Mission fließt.',
    joinCta: 'Anfragen',
    pledgeLabel: 'Borderhaus Impact Pledge',
    pledgeT: 'Unsere öffentliche Zusage',
    pledgeSub: 'Sieben Punkte, an denen wir uns messen lassen. Entwurf, final von Marcel bestätigt.',
    customers: [
      { name: 'Fairafric', tag: 'Bean to Bar in Ghana', impact: 'Schokolade komplett in Ghana produziert, solarbetrieben, faire Löhne. Die Wertschöpfung bleibt im Ursprungsland.', fact: '100%', factL: 'Produktion im Ursprung' },
      { name: 'KOA', tag: 'Zero-Waste Kakao', impact: 'Macht aus Kakaofrucht-Pulpe neue Produkte. Zusatzeinkommen für Bauern, weniger Food-Waste.', fact: '0', factL: 'Verschwendung der Pulpe' },
      { name: 'Slow Forest Coffee', tag: 'Agroforst-Kaffee', impact: 'Regenerativ angebauter Kaffee mit Aufforstung und besseren Einkommen für Farmer.', fact: 'CO₂', factL: 'klimafreundlich angebaut' },
      { name: 'Saving Grains', tag: 'Nachernteverluste senken', impact: 'Reduziert Nachernteverluste und bringt Kleinbauern in Ghana und Kenia in die kommerzielle Landwirtschaft.', fact: '~30%', factL: 'Ernteverlust adressiert' },
      { name: 'Reslides', tag: 'Zirkuläre Sandalen', impact: 'Modulare Cradle-to-Cradle-Sandalen aus der Schweiz, mono-material recycelbar, mit Takeback.', fact: '1 kg', factL: 'Plastik gesammelt pro Paar' },
    ],
    pledge: [
      { n: '01', icon: 'package', t: 'Plastikarm verpacken', b: 'Recycelbar, kein unnötiges Füllmaterial.' },
      { n: '02', icon: 'route', t: 'Kurze Wege', b: 'Dual-Domestic spart Cross-Border-Kilometer.' },
      { n: '03', icon: 'heart-handshake', t: 'Brands mit Haltung zuerst', b: 'Bevorzugt ökologischer oder sozialer Mehrwert.' },
      { n: '04', icon: 'users', t: 'Faire Arbeit im Lager', b: 'Faire Bedingungen und Löhne fürs Team.' },
      { n: '05', icon: 'receipt', t: 'Faire Abrechnung', b: 'Transparent, keine versteckten Posten.' },
      { n: '06', icon: 'sprout', t: 'Wir geben zurück', b: 'Ein Beitrag pro Periode fließt in ein Impact-Projekt.' },
      { n: '07', icon: 'line-chart', t: 'Messen und berichten', b: 'Wir messen unseren Fußabdruck, einmal im Jahr offen.' },
    ],
  },
  calculator: {
    heading: 'Deine indikative Spanne',
    inputs: {
      orders: 'Bestellungen pro Monat',
      picks: 'Picks pro Bestellung',
      storage: 'Lagerbedarf (Paletten)',
      markets: 'Zielmärkte',
      weight: 'Gewichtsklasse',
      returns: 'Retourenquote',
      services: 'Mehrwertservices',
    },
    markets: { de: 'Deutschland', nl: 'Niederlande', eu: 'Übriges EU' },
    weights: { light: 'Leicht (bis 1 kg)', medium: 'Mittel (1 bis 5 kg)', heavy: 'Schwer (über 5 kg)' },
    valueServices: { branding: 'Beilagen und Branding', bundling: 'Bundling und Sets', giftwrap: 'Geschenkverpackung' },
    breakdown: {
      storage: 'Lagerung',
      pickpack: 'Pick und Pack',
      shipping: 'Versand',
      returns: 'Retouren',
      total: 'Geschätzte Spanne pro Monat',
    },
    perMonth: 'pro Monat',
    estimateNote: 'Schätzung',
    handoff: 'Diese Eingaben werden mit deiner Anfrage übergeben.',
  },
  form: {
    heading: 'Angebot anfordern',
    fields: {
      brand: 'Brand',
      shopSystem: 'Shopsystem',
      volume: 'Volumen pro Monat',
      markets: 'Zielmärkte',
      currentLogistics: 'Aktueller Logistiker',
      desiredStart: 'Wunschstart',
      message: 'Nachricht',
      name: 'Dein Name',
      email: 'E-Mail',
      phone: 'Telefon (optional)',
      consent:
        'Ich bin damit einverstanden, dass Borderhaus meine Angaben zur Bearbeitung der Anfrage verarbeitet.',
    },
    placeholders: {
      brand: 'Name deiner Brand',
      shopSystem: 'z. B. Shopify',
      volume: 'z. B. 1500 Bestellungen',
      currentLogistics: 'z. B. Eigenversand',
      message: 'Worum geht es?',
    },
    submit: 'Anfrage senden',
    sending: 'Wird gesendet …',
    successHeading: 'Danke, deine Anfrage ist da.',
    successBody: 'Wir melden uns zeitnah mit einer ehrlichen Einschätzung.',
    errorHeading: 'Das hat nicht geklappt.',
    errorBody: 'Bitte versuch es erneut oder schreib uns direkt.',
    required: 'Pflichtfeld',
    invalidEmail: 'Bitte gib eine gültige E-Mail an.',
    consentRequired: 'Bitte stimme der Verarbeitung zu.',
  },
  footer: {
    claim: 'Ein Haus. Zwei Länder. Kein Cross-Border-Aufschlag.',
    by: 'Eine Marke von Social Ecosystems AG',
    nav: 'Navigation',
    resources: 'Ressourcen',
    legal: 'Rechtliches',
    copyright: '© 2026 Borderhaus · Social Ecosystems AG',
    domains: 'borderhaus.com · borderhaus.eu · borderhaus.de',
  },
  cookie: {
    text: 'Wir nutzen datensparsame Analyse ohne Cookies von Drittanbietern. Optionale Statistik hilft uns, die Seite zu verbessern.',
    accept: 'Statistik erlauben',
    decline: 'Nur notwendige',
  },
  langSwitch: { label: 'Sprache', de: 'DE', en: 'EN' },
};

export default de;
export type Dictionary = typeof de;
