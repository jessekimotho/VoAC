export type PostStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export type BlogPost = {
	id: string;
	title: string;
	slug: string;
	excerpt: string | null;
	content_html: string;
	status: PostStatus;
	post_type: 'post' | 'page';
	featured: boolean;
	published_at: string | null;
	author_name: string | null;
	category_name: string | null;
	category_slug: string | null;
	tags: string[];
	original_url: string | null;
};

export type CommentNode = {
	id: string;
	post_id: string;
	parent_id: string | null;
	author_name: string;
	body: string;
	created_at: string;
	replies: CommentNode[];
};

