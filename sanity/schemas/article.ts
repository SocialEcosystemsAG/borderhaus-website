import { defineField, defineType } from 'sanity';

// Knowledge-Base-Artikel. Unterstuetzt Pillar- und Cluster-Typ sowie interne
// Verlinkung (Pillar zu Cluster) ueber das Feld "related".
export const article = defineType({
  name: 'article',
  title: 'Artikel',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      title: 'Sprache',
      type: 'string',
      options: { list: [
        { title: 'Deutsch', value: 'de' },
        { title: 'English', value: 'en' },
      ] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Typ',
      type: 'string',
      options: { list: [
        { title: 'Pillar', value: 'pillar' },
        { title: 'Cluster', value: 'cluster' },
      ] },
      initialValue: 'cluster',
    }),
    defineField({ name: 'title', title: 'Titel', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'excerpt', title: 'Teaser', type: 'text', rows: 3 }),
    defineField({ name: 'publishedAt', title: 'Veröffentlicht am', type: 'datetime' }),
    defineField({ name: 'updatedAt', title: 'Aktualisiert am', type: 'datetime' }),
    defineField({
      name: 'body',
      title: 'Inhalt',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      of: [{ type: 'faq' }],
    }),
    defineField({
      name: 'related',
      title: 'Verwandte Artikel (Pillar zu Cluster)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'language' },
  },
});
