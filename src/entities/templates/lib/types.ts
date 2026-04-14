export interface TemplateSection {
    title: string;
    description: string;
}

export interface DocumentTemplateContent {
    quote: string;
    sections: TemplateSection[];
    description: string[];
    quoteAuthor: string;
}

export interface DocumentTemplateHeadField {
    title: string;
    text: string;
}

export interface DocumentTemplateBodyItem {
    number: string;
    title: string;
    text: string;
}

export interface DocumentTemplateBodySection {
    number: string;
    title: string;
    text: string;
    items: DocumentTemplateBodyItem[];
}

export interface DocumentTemplateGroundField {
    title: string;
    text: string;
}

export interface DocumentTemplateGroundParty {
    key: string;
    title: string;
    fields: DocumentTemplateGroundField[];
}

export interface DocumentTemplateSchema {
    body: DocumentTemplateBodySection[];
    head: Record<string, DocumentTemplateHeadField>;
    ground: {
        parties: DocumentTemplateGroundParty[];
    };
}

export interface DocumentTemplateListItemResponse {
    id: string;
    title: string;
    description: string;
    slug: string;
    preview: string;
}

export interface DocumentTemplateResponse extends DocumentTemplateListItemResponse {
    content: DocumentTemplateContent;
    template: DocumentTemplateSchema;
    createdAt: string;
    updatedAt: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export interface PaginatedTemplatesResponse {
    meta: PaginationMeta;
    items: DocumentTemplateListItemResponse[];
}

export interface TemplateDocument {
    id: string;
    slug: string;
    title: string;
    summary: string;
    previewPath: string;
    createdAt: string;
    updatedAt: string;
    category: string;
    duration: string;
    complexityLabel: string;
    complexityBars: number;
    sidebarDescription: string;
    verifiedText: string;
    description: string[];
    sections: TemplateSection[];
    quote: string;
    quoteAuthor: string;
    templateSchema: DocumentTemplateSchema | null;
}
