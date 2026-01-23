import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';
import { glob } from 'astro/loaders';

/**
 * Extended schema for Awesome IIUM resources
 * All new fields are optional for backward compatibility with existing content
 */
const extendedDocsSchema = docsSchema({
	extend: z.object({
		// Resource categorization
		resourceType: z
			.enum([
				'portal',
				'tool',
				'community',
				'library',
				'app',
				'guide',
				'course',
			])
			.optional(),
		tags: z.array(z.string()).optional(),

		// Quality indicators
		verified: z.boolean().default(false),
		featured: z.boolean().default(false),

		// IIUM-specific metadata
		kulliyyah: z
			.enum([
				'AIKOL',
				'AHAS-KIRKHS',
				'KAED',
				'KAHS',
				'KENMS',
				'KICT',
				'KLM',
				'KOD',
				'KOE',
				'KOED',
				'KOM',
				'KON',
				'KOP',
				'KOS',
				'general',
			])
			.optional(),
		campus: z.enum(['gombak', 'kuantan', 'pagoh', 'all']).optional(),

		// Tracking
		lastUpdated: z.coerce.date().optional(),
		maintainer: z.string().optional(),
	}),
});

export const collections = {
	docs: defineCollection({
		loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/docs' }),
		schema: extendedDocsSchema,
	}),
};
