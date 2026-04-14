import templatePreviewFallback from '@/assets/images/templates/7bb14f60526bd5058ede4b20e38a5c09.jpg';
import api from '@/api/axios';
import type {
    DocumentTemplateListItemResponse,
    DocumentTemplateResponse,
    PaginatedTemplatesResponse,
    TemplateDocument,
} from '@/entities/templates/lib/types';

const DEFAULT_CATEGORY = 'Скоро появится';
const DEFAULT_DURATION = 'Скоро появится';
const DEFAULT_VERIFIED_TEXT = 'Шаблон получен из каталога и готов к заполнению актуальными данными документа.';

const getPreviewBaseUrl = () => {
    return (import.meta.env.VITE_APP_STATIC_URL || import.meta.env.VITE_API_BASE_URL || '') as string;
};

const resolveTemplatePreviewPath = (preview: string) => {
    if (!preview) {
        return templatePreviewFallback;
    }

    if (/^https?:\/\//i.test(preview)) {
        return preview;
    }

    try {
        return new URL(preview, getPreviewBaseUrl()).href;
    }
    catch {
        return templatePreviewFallback;
    }
};

const formatTemplateDate = (value?: string) => {
    if (!value) {
        return '';
    }

    const parsedValue = new Date(value);

    if (Number.isNaN(parsedValue.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(parsedValue);
};

const getComplexityMeta = (sectionsCount: number) => {
    if (sectionsCount >= 6) {
        return {
            label: 'Высокая',
            bars: 3,
        };
    }

    if (sectionsCount >= 4) {
        return {
            label: 'Средняя',
            bars: 2,
        };
    }

    return {
        label: 'Низкая',
        bars: 1,
    };
};

const createTemplateFallback = (template: DocumentTemplateListItemResponse): TemplateDocument => {
    return {
        id: template.id,
        slug: template.slug,
        title: template.title,
        summary: template.description,
        previewPath: resolveTemplatePreviewPath(template.preview),
        createdAt: '',
        updatedAt: '',
        category: DEFAULT_CATEGORY,
        duration: DEFAULT_DURATION,
        complexityLabel: 'Средняя',
        complexityBars: 2,
        sidebarDescription: template.description,
        verifiedText: DEFAULT_VERIFIED_TEXT,
        description: [],
        sections: [],
        quote: '',
        quoteAuthor: '',
        templateSchema: null,
    };
};

const mapTemplateResponseToDocument = (template: DocumentTemplateResponse): TemplateDocument => {
    const complexityMeta = getComplexityMeta(template.template.body.length);

    return {
        id: template.id,
        slug: template.slug,
        title: template.title,
        summary: template.description,
        previewPath: resolveTemplatePreviewPath(template.preview),
        createdAt: formatTemplateDate(template.createdAt),
        updatedAt: template.updatedAt,
        category: DEFAULT_CATEGORY,
        duration: DEFAULT_DURATION,
        complexityLabel: complexityMeta.label,
        complexityBars: complexityMeta.bars,
        sidebarDescription: template.description,
        verifiedText: DEFAULT_VERIFIED_TEXT,
        description: template.content.description,
        sections: template.content.sections,
        quote: template.content.quote,
        quoteAuthor: template.content.quoteAuthor,
        templateSchema: template.template,
    };
};

export const getDocumentTemplates = async () => {
    const response = await api.get<PaginatedTemplatesResponse>(
        '/document-templates?order=asc&orderBy=createdAt&page=1&limit=10',
    );

    return {
        ...response.data,
        items: response.data.items.map(createTemplateFallback),
    };
};

export const getDocumentTemplateBySlug = async (slug: string) => {
    const response = await api.get<DocumentTemplateResponse>(`/document-templates/seo/${slug}`);

    return mapTemplateResponseToDocument(response.data);
};

export const getDocumentTemplateById = async (id: string) => {
    const response = await api.get<DocumentTemplateResponse>(`/document-templates/${id}`);

    return mapTemplateResponseToDocument(response.data);
};
