/**
 * Setup verification test for Vitest
 * 
 * This file verifies that the Vitest testing framework is configured correctly
 * and can run basic tests.
 */

import { describe, it, expect, vi } from 'vitest';

describe('Vitest Setup Verification', () => {
	it('should run basic assertions', () => {
		expect(true).toBe(true);
		expect(1 + 1).toBe(2);
	});

	it('should support async tests', async () => {
		const promise = Promise.resolve('test');
		await expect(promise).resolves.toBe('test');
	});

	it('should support mocking', () => {
		const mockFn = vi.fn();
		mockFn('test');
		expect(mockFn).toHaveBeenCalledWith('test');
	});

	it('should have access to environment variables', () => {
		// In tests, import.meta.env should be available
		expect(import.meta.env).toBeDefined();
	});
});

describe('TypeScript Support', () => {
	interface TestInterface {
		id: number;
		name: string;
	}

	it('should support TypeScript types', () => {
		const obj: TestInterface = {
			id: 1,
			name: 'test',
		};

		expect(obj.id).toBe(1);
		expect(obj.name).toBe('test');
	});

	it('should support type inference', () => {
		const numbers = [1, 2, 3];
		const doubled = numbers.map((n) => n * 2);

		expect(doubled).toEqual([2, 4, 6]);
	});
});

describe('DOM Environment', () => {
	it('should have access to DOM APIs', () => {
		expect(document).toBeDefined();
		expect(window).toBeDefined();
	});

	it('should support DOM manipulation', () => {
		const div = document.createElement('div');
		div.textContent = 'Hello World';
		expect(div.textContent).toBe('Hello World');
	});
});
