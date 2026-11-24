import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    kind: z.enum(['project', 'note']).default('project'),
    status: z.enum(['active', 'completed', 'prototype']).default('active'),
    stack: z.array(z.string()),
    highlights: z.array(z.string()).default([]),
    repoUrl: z.string().url().optional(),
    demoUrl: z.string().url().optional(),
    pubDate: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    entryType: z.enum(['essay', 'fragment']).default('fragment'),
    carousel: z.boolean().default(false),
    pubDate: z.coerce.date(),
    weather: z.string().optional(),
    bgm: z.string().optional(),
    mood: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, journal };
