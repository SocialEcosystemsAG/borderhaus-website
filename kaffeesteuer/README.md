# Kaffeesteuer-Modul (Formular 1807/1808)

Rechenkern und Bausteine für den Menüpunkt **„Kaffeesteuer“** in
dashboard.borderhaus.com. Jeder Monat ist ein **Lauf**: anlegen → Plausi
rechnen → Prüfung durch Marcel → Freigabe → Versand ans HZA → Beleg in Lexware
→ bezahlt. Das Modul ist bewusst framework-frei (TypeScript, läuft direkt mit
Node ≥ 22.18), damit es in die Dashboard-App übernommen werden kann.

## Was drin ist

| Datei | Aufgabe |
|---|---|
| `src/calendar.ts` | Registrierkennzeichen (lfd. Nr. = (Jahr − 2025) × 12 + Monat − 8), Fälligkeit, Ampel |
| `src/country.ts` | Länderfeld normalisieren (DE, Germany, Deutschland, GER → DE); Unbekanntes = Blocker |
| `src/sku-mapping.ts` | Versionierte SKU-Tabelle (kg je Einheit), Kits, Schweizer Ware; Unbekannt = Blocker |
| `data/sku-exclusions.json` | Geräte, Zubehör, Fremdware mit Lieferadresse DE (kein Röstkaffee) |
| `src/compute.ts` | Positionen des Monats: Versanddatum im Monat, Lieferadresse DE, Kit-Abzug, Overrides |
| `src/checks.ts` | Plausibilitäts-Checkliste 1–18 (Blocker / Warnungen), live berechnet |
| `src/fms1807.ts` | Feldbelegung 1807/1808, XML-Datensatz (FMS-Format), HTTP-Client Formularserver |
| `src/pdf.ts` | Menge in kg auf Seite 5 (1808, Zeile 1.1) einsetzen |
| `src/sheet.ts` | Sheet mit zwei Tabs, Formeln statt Werte, Abgleichzeile Tab 2 ↔ Tab 1 |
| `src/email.ts` | HZA-Mail: Empfänger, BCC-Zähler (erste 5 Läufe), Betreff, Standardtext |
| `src/lexware.ts` | Beleg (purchaseinvoice, ohne USt) und Datei-Upload |
| `src/channel.ts` | Austauschbarer Ausgabekanal (2026 FMS + E-Mail, ab 2027 Zoll-Portal) |
| `src/zoho.ts` | Zoho Inventory (Pakete, Zielweg) und Books-Aufträge (Übergangsweg) |
| `src/run.ts`, `bin/run-month.ts` | Lauf erzeugen, versioniert (`v1`, `v2`, …), nichts wird überschrieben |

## Datenschutz: was nicht ins Repo gehört

Das Repository ist öffentlich. Stammdaten (Telefon, Unternehmensnummer,
E-Mail-Adressen), Zoho-Snapshots, Historie, Overrides, Läufe und die
Unterschrift liegen ausschließlich in `private/` (gitignored) bzw. in der App.
`config.example.json` zeigt das Format mit Platzhaltern.

## Tests

```bash
npm install
npm test        # Unit-Tests, Golden Files, Regression August (wenn private/fixtures vorhanden)
```

- **Golden File 1807:** Der erzeugte XML-Datensatz ist byte-genau gleich dem
  FMS-Export August 2026 (anonymisiert in `test/golden/`, echt in `private/`).
- **Feldbelegung:** `test/golden/1807-fields-september-2026.json`, von Hand nach
  der Briefing-Tabelle geschrieben.
- **Regression August 2026:** Zoho ergibt Aufträge, Positionen und kg der
  eingereichten Liste, positionsgenau (Sollwerte in `private/fixtures`). Die Prüfung
  findet dabei genau die zwei Doppelmeldungen aus Vormonaten (SO-00941 Juni-Teil,
  SO-00959 Juli).

## Lauf erzeugen (bis der Scheduler in der App läuft)

```bash
node bin/run-month.ts private/runs/2026-09.spec.json
```

Ausgabe in `private/runs/<Monat>/v<N>/`: `run.json` (Positionen, Checks,
Overrides), Sheet `.xlsx`, FMS-XML-Datensatz, `pruefansicht.md`, `mail.txt`.

## Bekannte Grenzen des Übergangswegs (Books-Connector)

- Keine Paketdaten: Versanddatum = `delivery_date`, sonst Abschlussdatum.
  Teilversand und späte Statusänderungen werden als Warnung gezeigt (Check 11)
  und über die Historie abgesichert (Check 4). Zielweg ist der Inventory-
  Paketreport (`fetchShipmentsByItem`), dann mit Paketnummern und Kit-Abzug.
- Unterschrift wird nicht automatisch gesetzt. Das bleibt ein Schritt von Marcel
  bzw. eine eigene, ausdrücklich freigegebene Erweiterung (verschlüsseltes Asset,
  nur im Render-Schritt geladen, nie im Repo).
- Lexware: Die öffentliche API legt Belege an; die Überweisung wird in Lexware
  vorbereitet und von Marcel freigegeben. IBAN/Empfänger aus der Zahlung vom
  09.04.2026 (HZA Stuttgart) übernehmen, nicht raten.
