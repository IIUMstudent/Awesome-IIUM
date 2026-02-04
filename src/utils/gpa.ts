/**
 * GPA Calculation Utilities
 *
 * Pure functions for GPA and CGPA calculations
 */

export interface Course {
	grade: number; // Grade point (0.00 to 4.00)
	credits: number; // Credit hours (typically 1-4)
}

/**
 * Calculate semester GPA from courses
 *
 * @param courses Array of courses with grades and credits
 * @returns Semester GPA rounded to 2 decimal places
 */
export function calculateSemesterGPA(courses: Course[]): number {
	if (!courses || courses.length === 0) {
		return 0;
	}

	let totalPoints = 0;
	let totalCredits = 0;

	for (const course of courses) {
		if (course.grade < 0 || course.grade > 4) {
			throw new Error(
				`Invalid grade: ${course.grade}. Must be between 0 and 4.`,
			);
		}

		if (course.credits < 0) {
			throw new Error(`Invalid credits: ${course.credits}. Must be positive.`);
		}

		totalPoints += course.grade * course.credits;
		totalCredits += course.credits;
	}

	if (totalCredits === 0) {
		return 0;
	}

	return Math.round((totalPoints / totalCredits) * 100) / 100;
}

/**
 * Calculate new CGPA after a semester
 *
 * @param previousCGPA Previous cumulative GPA
 * @param previousCredits Total credits earned before this semester
 * @param semesterGPA GPA for current semester
 * @param semesterCredits Credits from current semester
 * @returns New CGPA rounded to 2 decimal places
 */
export function calculateNewCGPA(
	previousCGPA: number,
	previousCredits: number,
	semesterGPA: number,
	semesterCredits: number,
): number {
	if (previousCGPA < 0 || previousCGPA > 4) {
		throw new Error(
			`Invalid previous CGPA: ${previousCGPA}. Must be between 0 and 4.`,
		);
	}

	if (previousCredits < 0) {
		throw new Error(
			`Invalid previous credits: ${previousCredits}. Must be non-negative.`,
		);
	}

	if (semesterGPA < 0 || semesterGPA > 4) {
		throw new Error(
			`Invalid semester GPA: ${semesterGPA}. Must be between 0 and 4.`,
		);
	}

	if (semesterCredits < 0) {
		throw new Error(
			`Invalid semester credits: ${semesterCredits}. Must be non-negative.`,
		);
	}

	const previousPoints = previousCGPA * previousCredits;
	const semesterPoints = semesterGPA * semesterCredits;
	const totalPoints = previousPoints + semesterPoints;
	const totalCredits = previousCredits + semesterCredits;

	if (totalCredits === 0) {
		return 0;
	}

	return Math.round((totalPoints / totalCredits) * 100) / 100;
}

/**
 * Get grade description from grade point
 *
 * @param grade Grade point (0.00 to 4.00)
 * @returns Grade letter and description
 */
export function getGradeDescription(grade: number): string {
	if (grade === 4.0) return 'A (Excellent)';
	if (grade >= 3.67) return 'A- (Excellent)';
	if (grade >= 3.33) return 'B+ (Very Good)';
	if (grade >= 3.0) return 'B (Good)';
	if (grade >= 2.67) return 'B- (Good)';
	if (grade >= 2.33) return 'C+ (Satisfactory)';
	if (grade >= 2.0) return 'C (Satisfactory)';
	if (grade >= 1.67) return 'C- (Pass)';
	if (grade >= 1.33) return 'D+ (Pass)';
	if (grade >= 1.0) return 'D (Pass)';
	return 'F (Fail)';
}

/**
 * Validate course data
 *
 * @param course Course object to validate
 * @returns True if valid, false otherwise
 */
export function isValidCourse(course: Course): boolean {
	return (
		course !== null &&
		typeof course === 'object' &&
		typeof course.grade === 'number' &&
		course.grade >= 0 &&
		course.grade <= 4 &&
		typeof course.credits === 'number' &&
		course.credits > 0 &&
		course.credits <= 4
	);
}
