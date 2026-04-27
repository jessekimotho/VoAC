import type { CommentNode } from './types';

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
	return decoded;
}

type CommentRow = Omit<CommentNode, 'replies'>;

export function buildCommentTree(rows: CommentRow[]): CommentNode[] {
	const byId = new Map<string, CommentNode>();
	const roots: CommentNode[] = [];

	for (const row of rows) {
		byId.set(row.id, { ...row, replies: [] });
	}

	for (const comment of byId.values()) {
		if (comment.parent_id && byId.has(comment.parent_id)) {
			byId.get(comment.parent_id)?.replies.push(comment);
		} else {
			roots.push(comment);
		}
	}

	return roots;
}
