// Rechtstexte zweisprachig. Impressum mit echten Daten. Datenschutz und AGB
// sind Entwuerfe mit Hinweis auf anwaltliche Pruefung. Keine erfundenen Angaben.

export interface LegalSection {
  heading?: string;
  body: string[];
}
export interface LegalDoc {
  draftNotice?: string;
  sections: LegalSection[];
}

const DRAFT_DE = 'Entwurf, vor Livegang anwaltlich prüfen lassen.';
const DRAFT_EN = 'Subject to final legal review.';

// ---------- DEUTSCH ----------
const imprintDe: LegalDoc = {
  sections: [
    {
      heading: 'Angaben gemäß § 5 TMG / Art. 3 UWG',
      body: ['Social Ecosystems AG', 'Borderhaus ist eine Marke der Social Ecosystems AG.'],
    },
    { heading: 'Hauptsitz', body: ['Hönggerstrasse 40', '8037 Zürich', 'Schweiz'] },
    {
      heading: 'Niederlassung Deutschland',
      body: ['Bohr 12', '52072 Aachen', 'USt-IdNr: DE455166049'],
    },
    {
      heading: 'Niederlassung Niederlande',
      body: ['Bohr 10', '6422 RL Heerlen', 'USt-IdNr: NL82812668901'],
    },
    {
      heading: 'Kontakt',
      body: [
        'Telefon: +49 30 863 20 123, +31 85 3011980, +41 (0) 766838465',
        'E-Mail: hallo@borderhaus.com',
      ],
    },
    { heading: 'Vertretungsberechtigt', body: ['Pascal Lang'] },
    {
      heading: 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV',
      body: ['Dr. Marcel Lorenz'],
    },
  ],
};

const privacyDe: LegalDoc = {
  draftNotice: DRAFT_DE,
  sections: [
    {
      heading: '1. Verantwortlicher',
      body: [
        'Verantwortlich für die Datenverarbeitung ist die Social Ecosystems AG, Hönggerstrasse 40, 8037 Zürich, Schweiz.',
        'E-Mail: hallo@borderhaus.com',
      ],
    },
    {
      heading: '2. Hosting',
      body: [
        'Diese Website wird bei Hostinger gehostet. Hostinger verarbeitet dabei in unserem Auftrag technische Daten (zum Beispiel IP-Adresse, Zugriffszeitpunkt) auf Grundlage eines Auftragsverarbeitungsvertrags. Rechtsgrundlage ist unser berechtigtes Interesse an einem sicheren und stabilen Betrieb (Art. 6 Abs. 1 lit. f DSGVO).',
      ],
    },
    {
      heading: '3. Kontakt- und Inbound-Formular',
      body: [
        'Wenn du uns über das Kontakt- oder Inbound-Formular schreibst, verarbeiten wir die von dir angegebenen Daten (zum Beispiel Name, E-Mail, Brand, Shopsystem, Volumen, Zielmärkte, Nachricht), um deine Anfrage zu bearbeiten. Rechtsgrundlage ist die Anbahnung oder Erfüllung eines Vertrags (Art. 6 Abs. 1 lit. b DSGVO) sowie unser berechtigtes Interesse an der Beantwortung (Art. 6 Abs. 1 lit. f DSGVO).',
      ],
    },
    {
      heading: '4. Preisrechner',
      body: [
        'Die Eingaben im Preisrechner verarbeiten wir nur, um dir eine indikative Kalkulation anzuzeigen. Erst wenn du daraus eine Anfrage erstellst, werden die Angaben an uns übermittelt.',
      ],
    },
    {
      heading: '5. Terminbuchung über Google',
      body: [
        'Für die Terminbuchung binden wir einen Google-Terminkalender ein. Dabei werden Daten an Google (Google Ireland Limited) übermittelt. Es können personenbezogene Daten in Drittländer übertragen werden, abgesichert über geeignete Garantien wie Standardvertragsklauseln. Rechtsgrundlage ist dein Wunsch nach Terminvereinbarung (Art. 6 Abs. 1 lit. b DSGVO).',
      ],
    },
    {
      heading: '6. CRM (Zoho)',
      body: [
        'Anfragen und Vorqualifizierungen verarbeiten wir in unserem CRM-System Zoho CRM. Zoho ist als Auftragsverarbeiter auf Grundlage eines Auftragsverarbeitungsvertrags tätig; wir nutzen die EU-Rechenzentren. Rechtsgrundlage ist unser berechtigtes Interesse an einer geordneten Lead- und Kundenverwaltung (Art. 6 Abs. 1 lit. f DSGVO).',
      ],
    },
    {
      heading: '7. Analytics',
      body: [
        'Wir setzen eine datensparsame, cookielose Reichweitenmessung ein. Sie wird erst nach deiner Einwilligung geladen (Art. 6 Abs. 1 lit. a DSGVO). Du kannst deine Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen.',
      ],
    },
    {
      heading: '8. Empfänger',
      body: [
        'Empfänger deiner Daten sind unsere Auftragsverarbeiter für Hosting (Hostinger), CRM (Zoho), Terminbuchung (Google), Mailversand sowie gegebenenfalls Spam-Schutz (Cloudflare Turnstile).',
      ],
    },
    {
      heading: '9. Speicherdauer',
      body: [
        'Wir speichern personenbezogene Daten nur so lange, wie es für die genannten Zwecke erforderlich ist oder gesetzliche Aufbewahrungsfristen es verlangen. Danach werden die Daten gelöscht.',
      ],
    },
    {
      heading: '10. Deine Rechte',
      body: [
        'Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Erteilte Einwilligungen kannst du jederzeit widerrufen. Außerdem hast du ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde.',
        'Für die Ausübung deiner Rechte genügt eine Nachricht an hallo@borderhaus.com.',
      ],
    },
  ],
};

const termsDe: LegalDoc = {
  draftNotice: DRAFT_DE,
  sections: [
    {
      heading: '1. Geltungsbereich',
      body: [
        'Diese Allgemeinen Geschäftsbedingungen gelten für Fulfilment-Dienstleistungen der Social Ecosystems AG (Marke Borderhaus) gegenüber Unternehmen. Abweichende Bedingungen des Kunden gelten nur bei ausdrücklicher Zustimmung.',
      ],
    },
    {
      heading: '2. Leistungen',
      body: [
        'Borderhaus erbringt Leistungen im Bereich Wareneingang, Lagerung, Kommissionierung (Pick und Pack), Versand sowie Retourenabwicklung und optionale Mehrwertservices. Der konkrete Leistungsumfang ergibt sich aus dem individuellen Angebot bzw. Vertrag.',
      ],
    },
    {
      heading: '3. Vertragsschluss',
      body: [
        'Ein Vertrag kommt durch ein individuelles Angebot von Borderhaus und dessen Annahme durch den Kunden zustande. Angaben auf der Website, insbesondere im Preisrechner, sind unverbindliche Schätzungen und kein Angebot.',
      ],
    },
    {
      heading: '4. Preise und Zahlung',
      body: [
        'Es gelten die im individuellen Angebot vereinbarten Preise. Sofern nicht anders vereinbart, sind Rechnungen ohne Abzug zahlbar. Die konkreten Preis- und Zahlungsmodalitäten werden im individuellen Angebot festgelegt.',
      ],
    },
    {
      heading: '5. Pflichten des Kunden',
      body: [
        'Der Kunde liefert zutreffende Stamm- und Artikeldaten, sorgt für ordnungsgemäß verpackte Anlieferungen und stellt sicher, dass die eingelagerten Waren rechtlich zulässig sind.',
      ],
    },
    {
      heading: '6. Haftung',
      body: [
        'Borderhaus haftet nach den gesetzlichen Bestimmungen. Konkrete Haftungsregelungen, Haftungsgrenzen und Versicherungsfragen werden im individuellen Vertrag geregelt.',
      ],
    },
    {
      heading: '7. Laufzeit und Kündigung',
      body: ['Laufzeit, Kündigungsfristen und eine etwaige Mindestlaufzeit ergeben sich aus dem individuellen Vertrag.'],
    },
    { heading: '8. Datenschutz', body: ['Es gilt die Datenschutzerklärung von Borderhaus.'] },
    {
      heading: '9. Schlussbestimmungen',
      body: [
        'Anwendbares Recht und Gerichtsstand werden im individuellen Vertrag festgelegt. Sollten einzelne Bestimmungen unwirksam sein, bleibt der übrige Vertrag wirksam.',
      ],
    },
  ],
};

// ---------- ENGLISCH ----------
const imprintEn: LegalDoc = {
  sections: [
    {
      heading: 'Information pursuant to § 5 TMG',
      body: ['Social Ecosystems AG', 'Borderhaus is a brand of Social Ecosystems AG.'],
    },
    { heading: 'Headquarters', body: ['Hönggerstrasse 40', '8037 Zurich', 'Switzerland'] },
    { heading: 'German branch', body: ['Bohr 12', '52072 Aachen', 'VAT ID: DE455166049'] },
    { heading: 'Dutch branch', body: ['Bohr 10', '6422 RL Heerlen', 'VAT ID: NL82812668901'] },
    {
      heading: 'Contact',
      body: [
        'Phone: +49 30 863 20 123, +31 85 3011980, +41 (0) 766838465',
        'Email: hallo@borderhaus.com',
      ],
    },
    { heading: 'Represented by', body: ['Pascal Lang'] },
    { heading: 'Responsible for content', body: ['Dr. Marcel Lorenz'] },
  ],
};

const privacyEn: LegalDoc = {
  draftNotice: DRAFT_EN,
  sections: [
    {
      heading: '1. Controller',
      body: [
        'The controller for data processing is Social Ecosystems AG, Hönggerstrasse 40, 8037 Zurich, Switzerland.',
        'Email: hallo@borderhaus.com',
      ],
    },
    {
      heading: '2. Hosting',
      body: [
        'This website is hosted by Hostinger. On our behalf, Hostinger processes technical data (for example IP address, access time) based on a data processing agreement. The legal basis is our legitimate interest in secure and stable operation (Art. 6(1)(f) GDPR).',
      ],
    },
    {
      heading: '3. Contact and inbound form',
      body: [
        'When you write to us via the contact or inbound form, we process the details you provide (for example name, email, brand, shop system, volume, target markets, message) to handle your request. The legal basis is the initiation or performance of a contract (Art. 6(1)(b) GDPR) and our legitimate interest in responding (Art. 6(1)(f) GDPR).',
      ],
    },
    {
      heading: '4. Price calculator',
      body: [
        'We process the inputs in the price calculator only to show you an indicative calculation. The details are transmitted to us only once you turn them into a request.',
      ],
    },
    {
      heading: '5. Appointment booking via Google',
      body: [
        'For appointment booking we embed a Google appointment calendar. Data is transmitted to Google (Google Ireland Limited). Personal data may be transferred to third countries, safeguarded by appropriate measures such as standard contractual clauses. The legal basis is your wish to arrange an appointment (Art. 6(1)(b) GDPR).',
      ],
    },
    {
      heading: '6. CRM (Zoho)',
      body: [
        'We process requests and pre-qualifications in our CRM system Zoho CRM. Zoho acts as a processor based on a data processing agreement; we use the EU data centres. The legal basis is our legitimate interest in orderly lead and customer management (Art. 6(1)(f) GDPR).',
      ],
    },
    {
      heading: '7. Analytics',
      body: [
        'We use privacy-friendly, cookieless analytics. It is only loaded after your consent (Art. 6(1)(a) GDPR). You can withdraw your consent at any time with effect for the future.',
      ],
    },
    {
      heading: '8. Recipients',
      body: [
        'Recipients of your data are our processors for hosting (Hostinger), CRM (Zoho), appointment booking (Google), email delivery and, where applicable, spam protection (Cloudflare Turnstile).',
      ],
    },
    {
      heading: '9. Retention period',
      body: [
        'We store personal data only for as long as necessary for the stated purposes or as required by statutory retention periods. Afterwards the data is deleted.',
      ],
    },
    {
      heading: '10. Your rights',
      body: [
        'You have the right to access, rectification, erasure, restriction of processing, data portability and objection. You can withdraw any consent given at any time. You also have the right to lodge a complaint with a data protection supervisory authority.',
        'To exercise your rights, a message to hallo@borderhaus.com is sufficient.',
      ],
    },
  ],
};

const termsEn: LegalDoc = {
  draftNotice: DRAFT_EN,
  sections: [
    {
      heading: '1. Scope',
      body: [
        'These general terms and conditions apply to fulfilment services of Social Ecosystems AG (Borderhaus brand) towards businesses. Differing terms of the customer apply only with express consent.',
      ],
    },
    {
      heading: '2. Services',
      body: [
        'Borderhaus provides services in the areas of goods intake, storage, picking (pick and pack), shipping, returns handling and optional value-added services. The specific scope follows from the individual quote or contract.',
      ],
    },
    {
      heading: '3. Conclusion of contract',
      body: [
        'A contract is concluded through an individual quote from Borderhaus and its acceptance by the customer. Information on the website, in particular in the price calculator, is a non-binding estimate and not an offer.',
      ],
    },
    {
      heading: '4. Prices and payment',
      body: [
        'The prices agreed in the individual quote apply. Unless otherwise agreed, invoices are payable without deduction. The specific price and payment terms are set out in the individual quote.',
      ],
    },
    {
      heading: '5. Customer obligations',
      body: [
        'The customer provides accurate master and item data, ensures properly packaged deliveries and ensures that the stored goods are legally permissible.',
      ],
    },
    {
      heading: '6. Liability',
      body: [
        'Borderhaus is liable in accordance with statutory provisions. Specific liability rules, liability limits and insurance matters are governed by the individual contract.',
      ],
    },
    {
      heading: '7. Term and termination',
      body: ['Term, notice periods and any minimum term follow from the individual contract.'],
    },
    { heading: '8. Data protection', body: ['The Borderhaus privacy policy applies.'] },
    {
      heading: '9. Final provisions',
      body: [
        'Applicable law and place of jurisdiction are set out in the individual contract. Should individual provisions be invalid, the remaining contract stays in force.',
      ],
    },
  ],
};

export type Locale = 'de' | 'en';
export type LegalKey = 'imprint' | 'privacy' | 'terms';

export const legal: Record<Locale, Record<LegalKey, LegalDoc>> = {
  de: { imprint: imprintDe, privacy: privacyDe, terms: termsDe },
  en: { imprint: imprintEn, privacy: privacyEn, terms: termsEn },
};
