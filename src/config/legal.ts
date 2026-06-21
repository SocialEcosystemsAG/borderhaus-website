// Rechtstexte. Impressum mit echten Daten (Platzhalter klar markiert).
// Datenschutz und AGB sind Entwürfe mit Hinweis auf anwaltliche Prüfung.
// Bewusst auf Deutsch gehalten (DE/CH-Recht), unabhängig von der UI-Sprache.

export interface LegalSection {
  heading?: string;
  body: string[];
}
export interface LegalDoc {
  draftNotice?: string;
  sections: LegalSection[];
}

const DRAFT = 'Entwurf, vor Livegang anwaltlich prüfen lassen.';

export const imprint: LegalDoc = {
  sections: [
    {
      heading: 'Angaben gemäß § 5 TMG / Art. 3 UWG',
      body: [
        'Social Ecosystems AG',
        'Borderhaus ist eine Marke der Social Ecosystems AG.',
      ],
    },
    {
      heading: 'Hauptsitz',
      body: ['Hönggerstrasse 40', '8037 Zürich', 'Schweiz'],
    },
    {
      heading: 'Niederlassung Deutschland',
      body: ['Bohr 12', '52072 Aachen'],
    },
    {
      heading: 'Niederlassung Niederlande',
      body: ['Bohr 10', '6422 RL Heerlen'],
    },
    {
      heading: 'Kontakt',
      body: [
        'Telefon: +49 30 863 20 123, +31 85 3011980, +41 (0) 766838465',
        'E-Mail: hallo@borderhaus.com',
      ],
    },
    {
      heading: 'Register und Steuern',
      body: [
        'Handelsregister-Nummer: CHE-[von Marcel ergänzen]',
        'UID / USt-IdNr.: [von Marcel ergänzen]',
      ],
    },
    {
      heading: 'Vertretungsberechtigung',
      body: ['Verwaltungsrat bzw. vertretungsberechtigte Person: [von Marcel ergänzen]'],
    },
    {
      heading: 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV',
      body: ['[von Marcel ergänzen]'],
    },
  ],
};

export const privacy: LegalDoc = {
  draftNotice: DRAFT,
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

export const terms: LegalDoc = {
  draftNotice: DRAFT,
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
        'Es gelten die im individuellen Angebot vereinbarten Preise. [Platzhalter: konkrete Preis- und Zahlungsmodalitäten von Marcel ergänzen.] Sofern nicht anders vereinbart, sind Rechnungen ohne Abzug zahlbar.',
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
        'Borderhaus haftet nach den gesetzlichen Bestimmungen. [Platzhalter: Haftungsregelungen, Haftungsgrenzen und Versicherung von Marcel bzw. anwaltlich konkretisieren.]',
      ],
    },
    {
      heading: '7. Laufzeit und Kündigung',
      body: [
        '[Platzhalter: Laufzeit, Kündigungsfristen und Mindestlaufzeit von Marcel ergänzen.]',
      ],
    },
    {
      heading: '8. Datenschutz',
      body: ['Es gilt die Datenschutzerklärung von Borderhaus.'],
    },
    {
      heading: '9. Schlussbestimmungen',
      body: [
        '[Platzhalter: anwendbares Recht und Gerichtsstand von Marcel bzw. anwaltlich festlegen.] Sollten einzelne Bestimmungen unwirksam sein, bleibt der übrige Vertrag wirksam.',
      ],
    },
  ],
};

export const legalDocs = { imprint, privacy, terms };
