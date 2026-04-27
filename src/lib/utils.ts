export function decodeHtmlEntities(text: string): string {
	const entityMap: Record<string, string> = {
		'&nbsp;': ' ',
		'&amp;': '&',
		'&lt;': '<',
		'&gt;': '>',
		'&quot;': '"',
		'&#39;': "'",
		'&apos;': "'"
	};

	let decoded = text;
	for (const [entity, char] of Object.entries(entityMap)) {
		decoded = decoded.replace(new RegExp(entity, 'g'), char);
	}

	// Decode decimal numeric entities: &#128514; -> emoji
	decoded = decoded.replace(/&#(\d+);/g, (_, code) => {
		try {
			return String.fromCodePoint(Number(code));
		} catch {
			return _;
		}
	});

	// Decode hexadecimal numeric entities: &#x1F600; -> emoji
	decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
		try {
			return String.fromCodePoint(parseInt(hex, 16));
		} catch {
			return _;
		}
	});

	return decoded;
}

export function generateExcerptFromHtml(html: string, maxLength: number = 200): string {
	// Remove HTML tags
	const text = html.replace(/<[^>]*>/g, ' ');
	// Decode HTML entities
	const decoded = decodeHtmlEntities(text);
	// Collapse whitespace
	const cleaned = decoded.replace(/\s+/g, ' ').trim();
	// Truncate to max length
	if (cleaned.length <= maxLength) return cleaned;
	return cleaned.slice(0, maxLength).trim() + '...';
}
