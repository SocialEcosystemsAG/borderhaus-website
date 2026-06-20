import { defineField, defineType } from 'sanity';

// Wiederverwendbarer FAQ-Eintrag. Wird auch fuer FAQPage-JSON-LD genutzt.
export const faq = defineType({
  name: 'faq',
  title: 'FAQ-Eintrag',
  type: 'object',
  fields: [
    defineField({ name: 'question', title: 'Frage', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'answer', title: 'Antwort', type: 'text', rows: 4, validation: (r) => r.required() }),
  ],
});
