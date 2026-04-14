export interface TemplateSection {
    title: string;
    description: string;
}

export interface TemplateDocument {
    slug: string;
    title: string;
    summary: string;
    previewPath: string;
    createdAt: string;
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
}
