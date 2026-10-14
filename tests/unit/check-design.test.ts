import { describe, expect, it } from 'vitest';
import {
	findDesignIssues,
	listDesignFiles,
	THEME_FILE,
} from '../../scripts/check-design.mjs';

const lines = (text: string) => findDesignIssues(text).map((i) => i.line);

describe('findDesignIssues', () => {
	it('flags raw colours', () => {
		expect(lines('.a { color: #ef4444; }')).toEqual([1]);
		expect(lines('.a {\n  background: #FFF;\n}')).toEqual([2]);
		expect(lines('box-shadow: 0 2px 8px rgba(0,0,0,0.2);')).toEqual([1]);
		expect(lines('color: hsl(180, 5%, 56%);')).toEqual([1]);
		expect(lines("color: '#10b981',")).toEqual([1]);
	});

	it('flags named colours in colour properties', () => {
		expect(lines('color: white;')).toEqual([1]);
		expect(lines('border: 1px solid black;')).toEqual([1]);
		expect(lines('background-color: Red;')).toEqual([1]);
	});

	it('flags fonts that are not tokens', () => {
		expect(lines('font-family: monospace;')).toEqual([1]);
		expect(lines("font-family: 'Inter', sans-serif;")).toEqual([1]);
	});

	it('accepts theme tokens', () => {
		expect(
			lines(
				[
					'color: var(--sl-color-gray-3);',
					'background: var(--sl-color-green-low);',
					'border: 1px solid var(--sl-color-hairline-light);',
					'font-family: var(--aw-font-heading);',
					'font-family: inherit;',
					'box-shadow: var(--sl-shadow-md);',
				].join('\n'),
			),
		).toEqual([]);
	});

	it('ignores things that only look like colours', () => {
		expect(lines(".replace(/'/g, '&#039;')")).toEqual([]);
		expect(lines("document.querySelector('#add-course')")).toEqual([]);
		expect(lines('[Results](#results)')).toEqual([]);
		expect(lines('A white paper on Islamic finance')).toEqual([]);
	});

	it('allows a marked exception', () => {
		expect(lines('color: #000; /* design-ok: printed output */')).toEqual([]);
	});
});

describe('listDesignFiles', () => {
	it('checks components and public scripts, but not the theme itself', () => {
		const files = listDesignFiles();
		expect(files).toContain('src/components/GPACalculator.astro');
		expect(files).toContain('public/pwa-register.js');
		expect(files).not.toContain(THEME_FILE);
	});
});
