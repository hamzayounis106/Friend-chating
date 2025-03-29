// Content block interface for flexible content
export interface ContentBlock {
  type: `paragraph` | `image-paragraph`;
  text?: string;
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
}

// Main blog data type
export interface BlogDataType {
  id: number;
  postTitle: string;
  postSlug: string;
  postDate: string;
  featureImage: string;
  imageTwo?: string;
  postPara1: string; // Introduction paragraph
  content: ContentBlock[]; // Flexible content blocks
  metaDescription?: string;
}

export type BlogDataTypeArray = BlogDataType[];