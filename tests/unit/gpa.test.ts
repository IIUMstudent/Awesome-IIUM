/**
 * Unit tests for GPA calculation utilities
 *
 * Tests semester GPA, CGPA calculations, grade descriptions, and validation
 */

import { describe, expect, it } from 'vitest';
import {
	type Course,
	calculateNewCGPA,
	calculateSemesterGPA,
	getGradeDescription,
	isValidCourse,
} from '../../src/utils/gpa';

describe('calculateSemesterGPA', () => {
	it('should calculate GPA for single course', () => {
		const courses: Course[] = [{ grade: 4.0, credits: 3 }];
		expect(calculateSemesterGPA(courses)).toBe(4.0);
	});

	it('should calculate GPA for multiple courses with same grade', () => {
		const courses: Course[] = [
			{ grade: 3.5, credits: 3 },
			{ grade: 3.5, credits: 3 },
		];
		expect(calculateSemesterGPA(courses)).toBe(3.5);
	});

	it('should calculate weighted GPA correctly', () => {
		const courses: Course[] = [
			{ grade: 4.0, credits: 3 }, // 12 points
			{ grade: 3.0, credits: 3 }, // 9 points
		];
		// Total: 21 points / 6 credits = 3.50
		expect(calculateSemesterGPA(courses)).toBe(3.5);
	});

	it('should handle different credit weights', () => {
		const courses: Course[] = [
			{ grade: 4.0, credits: 4 }, // 16 points
			{ grade: 2.0, credits: 2 }, // 4 points
		];
		// Total: 20 points / 6 credits = 3.33
		expect(calculateSemesterGPA(courses)).toBe(3.33);
	});

	it('should round to 2 decimal places', () => {
		const courses: Course[] = [
			{ grade: 4.0, credits: 3 }, // 12 points
			{ grade: 3.0, credits: 3 }, // 9 points
			{ grade: 2.0, credits: 3 }, // 6 points
		];
		// Total: 27 points / 9 credits = 3.00
		expect(calculateSemesterGPA(courses)).toBe(3.0);
	});

	it('should return 0 for empty course array', () => {
		expect(calculateSemesterGPA([])).toBe(0);
	});

	it('should throw error for invalid grade above 4.0', () => {
		const courses: Course[] = [{ grade: 5.0, credits: 3 }];
		expect(() => calculateSemesterGPA(courses)).toThrow('Invalid grade');
	});

	it('should throw error for negative grade', () => {
		const courses: Course[] = [{ grade: -1.0, credits: 3 }];
		expect(() => calculateSemesterGPA(courses)).toThrow('Invalid grade');
	});

	it('should throw error for negative credits', () => {
		const courses: Course[] = [{ grade: 3.0, credits: -1 }];
		expect(() => calculateSemesterGPA(courses)).toThrow('Invalid credits');
	});

	it('should handle courses with 0 credits', () => {
		const courses: Course[] = [
			{ grade: 4.0, credits: 3 },
			{ grade: 3.0, credits: 0 }, // Audit course
		];
		// Only 3 credits counted
		expect(calculateSemesterGPA(courses)).toBe(4.0);
	});

	it('should handle F grade (0.00)', () => {
		const courses: Course[] = [
			{ grade: 4.0, credits: 3 }, // 12 points
			{ grade: 0.0, credits: 3 }, // 0 points
		];
		// Total: 12 points / 6 credits = 2.00
		expect(calculateSemesterGPA(courses)).toBe(2.0);
	});

	it('should calculate realistic semester scenario', () => {
		// Realistic IIUM semester
		const courses: Course[] = [
			{ grade: 4.0, credits: 3 }, // A in 3-credit course
			{ grade: 3.67, credits: 3 }, // A- in 3-credit course
			{ grade: 3.33, credits: 3 }, // B+ in 3-credit course
			{ grade: 3.0, credits: 2 }, // B in 2-credit course
			{ grade: 2.67, credits: 1 }, // B- in 1-credit course
		];
		// Total: (12 + 11.01 + 9.99 + 6 + 2.67) / 12 = 41.67 / 12 = 3.47
		const gpa = calculateSemesterGPA(courses);
		expect(gpa).toBeGreaterThan(3.4);
		expect(gpa).toBeLessThan(3.5);
	});
});

describe('calculateNewCGPA', () => {
	it('should calculate CGPA for first semester', () => {
		// No previous CGPA, first semester GPA becomes CGPA
		const newCGPA = calculateNewCGPA(0, 0, 3.5, 15);
		expect(newCGPA).toBe(3.5);
	});

	it('should maintain CGPA when semester GPA matches', () => {
		// Previous CGPA 3.5, semester GPA 3.5
		const newCGPA = calculateNewCGPA(3.5, 30, 3.5, 15);
		expect(newCGPA).toBe(3.5);
	});

	it('should increase CGPA with higher semester GPA', () => {
		// Previous CGPA 3.0, new semester 4.0
		const newCGPA = calculateNewCGPA(3.0, 30, 4.0, 15);
		expect(newCGPA).toBeGreaterThan(3.0);
		expect(newCGPA).toBeLessThan(4.0);
	});

	it('should decrease CGPA with lower semester GPA', () => {
		// Previous CGPA 3.5, poor semester 2.0
		const newCGPA = calculateNewCGPA(3.5, 30, 2.0, 15);
		expect(newCGPA).toBeLessThan(3.5);
		expect(newCGPA).toBeGreaterThan(2.0);
	});

	it('should calculate realistic progression', () => {
		// Year 1 Semester 1: Start with GPA 3.8
		let cgpa = calculateNewCGPA(0, 0, 3.8, 16);
		expect(cgpa).toBe(3.8);

		// Year 1 Semester 2: GPA 3.6
		cgpa = calculateNewCGPA(cgpa, 16, 3.6, 16);
		expect(cgpa).toBe(3.7); // (3.8*16 + 3.6*16) / 32 = 3.7

		// Year 2 Semester 1: GPA 3.9
		cgpa = calculateNewCGPA(cgpa, 32, 3.9, 16);
		// (3.7*32 + 3.9*16) / 48 = (118.4 + 62.4) / 48 = 180.8 / 48 = 3.77
		expect(cgpa).toBeCloseTo(3.77, 2);
	});

	it('should handle recovery from poor semester', () => {
		// Start with 3.0 CGPA after 30 credits
		// Bad semester: 2.0 GPA for 15 credits
		const afterBadSemester = calculateNewCGPA(3.0, 30, 2.0, 15);
		expect(afterBadSemester).toBeLessThan(3.0);

		// Recovery semester: 4.0 GPA for 15 credits
		const afterRecovery = calculateNewCGPA(afterBadSemester, 45, 4.0, 15);
		expect(afterRecovery).toBeGreaterThan(afterBadSemester);
	});

	it('should throw error for invalid previous CGPA', () => {
		expect(() => calculateNewCGPA(5.0, 30, 3.5, 15)).toThrow(
			'Invalid previous CGPA',
		);
		expect(() => calculateNewCGPA(-1.0, 30, 3.5, 15)).toThrow(
			'Invalid previous CGPA',
		);
	});

	it('should throw error for invalid semester GPA', () => {
		expect(() => calculateNewCGPA(3.0, 30, 5.0, 15)).toThrow(
			'Invalid semester GPA',
		);
		expect(() => calculateNewCGPA(3.0, 30, -1.0, 15)).toThrow(
			'Invalid semester GPA',
		);
	});

	it('should throw error for negative credits', () => {
		expect(() => calculateNewCGPA(3.0, -10, 3.5, 15)).toThrow(
			'Invalid previous credits',
		);
		expect(() => calculateNewCGPA(3.0, 30, 3.5, -5)).toThrow(
			'Invalid semester credits',
		);
	});

	it('should round result to 2 decimal places', () => {
		// Force a calculation that needs rounding
		const cgpa = calculateNewCGPA(3.333, 30, 3.666, 15);
		// Check it's rounded to 2 decimals
		expect(cgpa.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
	});
});

describe('getGradeDescription', () => {
	it('should return correct description for A (4.00)', () => {
		expect(getGradeDescription(4.0)).toBe('A (Excellent)');
	});

	it('should return correct description for A- (3.67)', () => {
		expect(getGradeDescription(3.67)).toBe('A- (Excellent)');
		expect(getGradeDescription(3.7)).toBe('A- (Excellent)');
	});

	it('should return correct description for B+ (3.33)', () => {
		expect(getGradeDescription(3.33)).toBe('B+ (Very Good)');
		expect(getGradeDescription(3.5)).toBe('B+ (Very Good)');
	});

	it('should return correct description for B (3.00)', () => {
		expect(getGradeDescription(3.0)).toBe('B (Good)');
	});

	it('should return correct description for C (2.00)', () => {
		expect(getGradeDescription(2.0)).toBe('C (Satisfactory)');
	});

	it('should return correct description for D (1.00)', () => {
		expect(getGradeDescription(1.0)).toBe('D (Pass)');
	});

	it('should return correct description for F (0.00)', () => {
		expect(getGradeDescription(0.0)).toBe('F (Fail)');
		expect(getGradeDescription(0.5)).toBe('F (Fail)');
	});

	it('should handle edge cases between grades', () => {
		expect(getGradeDescription(3.66)).toBe('B+ (Very Good)');
		expect(getGradeDescription(2.99)).toBe('B- (Good)');
		expect(getGradeDescription(1.99)).toBe('C- (Pass)');
	});
});

describe('isValidCourse', () => {
	it('should validate correct course', () => {
		const course: Course = { grade: 3.5, credits: 3 };
		expect(isValidCourse(course)).toBe(true);
	});

	it('should reject grade above 4.0', () => {
		const course: Course = { grade: 5.0, credits: 3 };
		expect(isValidCourse(course)).toBe(false);
	});

	it('should reject negative grade', () => {
		const course: Course = { grade: -1.0, credits: 3 };
		expect(isValidCourse(course)).toBe(false);
	});

	it('should reject zero credits', () => {
		const course: Course = { grade: 3.5, credits: 0 };
		expect(isValidCourse(course)).toBe(false);
	});

	it('should reject credits above 4', () => {
		const course: Course = { grade: 3.5, credits: 5 };
		expect(isValidCourse(course)).toBe(false);
	});

	it('should reject negative credits', () => {
		const course: Course = { grade: 3.5, credits: -1 };
		expect(isValidCourse(course)).toBe(false);
	});

	it('should reject null', () => {
		expect(isValidCourse(null as unknown as Course)).toBe(false);
	});

	it('should reject undefined', () => {
		expect(isValidCourse(undefined as unknown as Course)).toBe(false);
	});

	it('should reject non-object', () => {
		expect(isValidCourse('invalid' as unknown as Course)).toBe(false);
		expect(isValidCourse(123 as unknown as Course)).toBe(false);
	});

	it('should reject course with missing fields', () => {
		expect(isValidCourse({ grade: 3.5 } as unknown as Course)).toBe(false);
		expect(isValidCourse({ credits: 3 } as unknown as Course)).toBe(false);
	});

	it('should validate all valid IIUM grade points', () => {
		const validGrades = [
			4.0, 3.67, 3.33, 3.0, 2.67, 2.33, 2.0, 1.67, 1.33, 1.0, 0.0,
		];
		const validCredits = [1, 2, 3, 4];

		for (const grade of validGrades) {
			for (const credits of validCredits) {
				expect(isValidCourse({ grade, credits })).toBe(true);
			}
		}
	});
});
