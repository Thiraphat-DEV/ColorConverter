import { describe, it, expect } from 'vitest';
import { parseColorInput, formatColor, OUTPUT_FORMAT_LABELS, type OutputFormat } from './color';

describe('parseColorInput', () => {
	it('returns null for empty or whitespace', () => {
		expect(parseColorInput('')).toBeNull();
		expect(parseColorInput('   ')).toBeNull();
	});

	it('parses #RGB (3 hex)', () => {
		expect(parseColorInput('#f00')).toEqual({ a: 255, r: 255, g: 0, b: 0 });
		expect(parseColorInput('f0f')).toEqual({ a: 255, r: 255, g: 0, b: 255 });
	});

	it('parses #RRGGBB (6 hex)', () => {
		expect(parseColorInput('#ff5500')).toEqual({ a: 255, r: 255, g: 85, b: 0 });
		expect(parseColorInput('#00FF00')).toEqual({ a: 255, r: 0, g: 255, b: 0 });
	});

	it('parses #RRGGBBAA (8 hex, alpha last)', () => {
		const c = parseColorInput('#ff000080');
		expect(c).toEqual({ a: 128, r: 255, g: 0, b: 0 });
	});

	it('parses 0x hex number (6 and 8 digits)', () => {
		expect(parseColorInput('0xFF5500')).toEqual({ a: 255, r: 255, g: 85, b: 0 });
		expect(parseColorInput('0x80FF0000')).toEqual({ a: 128, r: 255, g: 0, b: 0 });
	});

	it('parses ARGB as decimal integer', () => {
		// 0xFFFF5500 = (255<<24)|(255<<16)|(85<<8)|0 = 4294923520
		expect(parseColorInput('4294923520')).toEqual({ a: 255, r: 255, g: 85, b: 0 });
	});

	it('parses R,G,B (3 numbers)', () => {
		expect(parseColorInput('255, 85, 0')).toEqual({ a: 255, r: 255, g: 85, b: 0 });
		expect(parseColorInput('0 255 0')).toEqual({ a: 255, r: 0, g: 255, b: 0 });
	});

	it('parses A,R,G,B (4 numbers)', () => {
		expect(parseColorInput('128, 255, 0, 0')).toEqual({ a: 128, r: 255, g: 0, b: 0 });
	});

	it('returns null for invalid input', () => {
		expect(parseColorInput('notacolor')).toBeNull();
		expect(parseColorInput('#gggggg')).toBeNull();
		expect(parseColorInput('-1,0,0')).toBeNull();
	});
});

describe('formatColor', () => {
	const c = { a: 255, r: 255, g: 85, b: 0 };

	it('formats 0xARGB', () => {
		expect(formatColor(c, '0xARGB')).toBe('0xFFFF5500');
	});

	it('formats 0xRGB', () => {
		expect(formatColor(c, '0xRGB')).toBe('0xFF5500');
	});

	it('formats hex6 and hex8', () => {
		expect(formatColor(c, 'hex6')).toBe('#FF5500');
		expect(formatColor(c, 'hex8')).toBe('#FFFF5500');
	});

	it('formats rgb and rgba', () => {
		expect(formatColor(c, 'rgb')).toBe('rgb(255, 85, 0)');
		expect(formatColor(c, 'rgba')).toBe('rgba(255, 85, 0, 1.00)');
	});

	it('formats argb_int', () => {
		// (255<<24)|(255<<16)|(85<<8)|0 = 4294923520
		expect(formatColor(c, 'argb_int')).toBe('4294923520');
	});

	it('formats channels', () => {
		expect(formatColor(c, 'channels')).toBe('A:255 R:255 G:85 B:0');
	});
});

describe('OUTPUT_FORMAT_LABELS', () => {
	it('has labels for all OutputFormat keys', () => {
		const formats: OutputFormat[] = [
			'0xARGB', '0xRGB', 'hex8', 'hex6', 'rgb', 'rgba', 'argb_int', 'channels'
		];
		formats.forEach((f) => {
			expect(OUTPUT_FORMAT_LABELS[f]).toBeDefined();
			expect(typeof OUTPUT_FORMAT_LABELS[f]).toBe('string');
		});
	});
});
