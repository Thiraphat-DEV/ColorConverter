export type ColorChannels = { a: number; r: number; g: number; b: number };

/** Parse various color inputs to ARGB 0-255 channels */
export function parseColorInput(input: string): ColorChannels | null {
	const raw = input.trim();
	if (!raw) return null;

	// #RGB / #RGBA / #RRGGBB / #RRGGBBAA
	const hexMatch = raw.match(/^#?([0-9a-fA-F]{3,8})$/);
	if (hexMatch) {
		const hex = hexMatch[1];
		if (hex.length === 3) {
			// #RGB -> RR GG BB, alpha = 255
			const r = parseInt(hex[0] + hex[0], 16);
			const g = parseInt(hex[1] + hex[1], 16);
			const b = parseInt(hex[2] + hex[2], 16);
			return { a: 255, r, g, b };
		}
		if (hex.length === 4) {
			// #RGBA
			const r = parseInt(hex[0] + hex[0], 16);
			const g = parseInt(hex[1] + hex[1], 16);
			const b = parseInt(hex[2] + hex[2], 16);
			const a = parseInt(hex[3] + hex[3], 16);
			return { a, r, g, b };
		}
		if (hex.length === 6) {
			const r = parseInt(hex.slice(0, 2), 16);
			const g = parseInt(hex.slice(2, 4), 16);
			const b = parseInt(hex.slice(4, 6), 16);
			return { a: 255, r, g, b };
		}
		if (hex.length === 8) {
			// CSS style: #RRGGBBAA (alpha สุดท้าย)
			const r = parseInt(hex.slice(0, 2), 16);
			const g = parseInt(hex.slice(2, 4), 16);
			const b = parseInt(hex.slice(4, 6), 16);
			const a = parseInt(hex.slice(6, 8), 16);
			return { a, r, g, b };
		}
	}

	// 0xFFFFFFFF or 0xFFFFFF (hex number)
	const hexNumMatch = raw.match(/^0x([0-9a-fA-F]{6,8})$/);
	if (hexNumMatch) {
		let v = parseInt(hexNumMatch[1], 16);
		if (hexNumMatch[1].length === 6) {
			return { a: 255, r: (v >> 16) & 0xff, g: (v >> 8) & 0xff, b: v & 0xff };
		}
		return {
			a: (v >> 24) & 0xff,
			r: (v >> 16) & 0xff,
			g: (v >> 8) & 0xff,
			b: v & 0xff
		};
	}

	// ARGB as single decimal (e.g. 4294967295)
	const num = parseInt(raw, 10);
	if (!Number.isNaN(num) && num >= 0 && num <= 0xffffffff) {
		return {
			a: (num >> 24) & 0xff,
			r: (num >> 16) & 0xff,
			g: (num >> 8) & 0xff,
			b: num & 0xff
		};
	}

	// A,R,G,B or R,G,B (0-255)
	const parts = raw.split(/[\s,]+/).map((s) => parseInt(s.trim(), 10));
	if (parts.length === 3 && parts.every((n) => !Number.isNaN(n) && n >= 0 && n <= 255)) {
		return { a: 255, r: parts[0], g: parts[1], b: parts[2] };
	}
	if (parts.length === 4 && parts.every((n) => !Number.isNaN(n) && n >= 0 && n <= 255)) {
		return { a: parts[0], r: parts[1], g: parts[2], b: parts[3] };
	}

	return null;
}

export type OutputFormat =
	| '0xARGB'
	| '0xRGB'
	| 'hex8'
	| 'hex6'
	| 'rgb'
	| 'rgba'
	| 'argb_int'
	| 'channels';

const pad = (n: number, len = 2) => n.toString(16).toUpperCase().padStart(len, '0');

export function formatColor(c: ColorChannels, format: OutputFormat): string {
	switch (format) {
		case '0xARGB':
			return `0x${pad(c.a)}${pad(c.r)}${pad(c.g)}${pad(c.b)}`;
		case '0xRGB':
			return `0x${pad(c.r)}${pad(c.g)}${pad(c.b)}`;
		case 'hex8':
			return `#${pad(c.a)}${pad(c.r)}${pad(c.g)}${pad(c.b)}`;
		case 'hex6':
			return `#${pad(c.r)}${pad(c.g)}${pad(c.b)}`;
		case 'rgb':
			return `rgb(${c.r}, ${c.g}, ${c.b})`;
		case 'rgba':
			return `rgba(${c.r}, ${c.g}, ${c.b}, ${(c.a / 255).toFixed(2)})`;
		case 'argb_int':
			return String(((c.a << 24) | (c.r << 16) | (c.g << 8) | c.b) >>> 0);
		case 'channels':
			return `A:${c.a} R:${c.r} G:${c.g} B:${c.b}`;
		default:
			return '';
	}
}

export const OUTPUT_FORMAT_LABELS: Record<OutputFormat, string> = {
	'0xARGB': '0xAARRGGBB (Hex)',
	'0xRGB': '0xRRGGBB (Hex ไม่มี Alpha)',
	hex8: '#AARRGGBB',
	hex6: '#RRGGBB',
	rgb: 'rgb(r, g, b)',
	rgba: 'rgba(r, g, b, a)',
	argb_int: 'ARGB (ตัวเลขเต็ม)',
	channels: 'A, R, G, B (0-255)'
};
