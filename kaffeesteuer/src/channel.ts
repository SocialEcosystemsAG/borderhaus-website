// Ausgabekanal austauschbar: 2026 FMS-PDF + E-Mail ans HZA, ab 01.01.2027 Zoll-Portal.
import type { Registrierkennzeichen } from "./calendar.ts";
import type { YearMonth } from "./types.ts";

export type Filing = {
  ym: YearMonth;
  rkz: Registrierkennzeichen;
  grams: number;
  taxCents: number;
  attachments: { fileName: string; mimeType: string; bytes: Uint8Array }[];
};

export type SendReceipt = { channel: string; messageId: string; sentAt: string; files: string[] };

export interface OutputChannel {
  readonly id: "fms-email" | "zoll-portal";
  /** Nur nach Freigabe durch Marcel aufrufen („Freigeben & senden“). */
  send(filing: Filing): Promise<SendReceipt>;
}

export function channelFor(ym: YearMonth): OutputChannel["id"] {
  return ym.year >= 2027 ? "zoll-portal" : "fms-email";
}
