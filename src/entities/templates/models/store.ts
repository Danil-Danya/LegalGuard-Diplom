import { defineStore } from 'pinia';

import {
    getDocumentTemplateById,
    getDocumentTemplateBySlug,
    getDocumentTemplates,
} from '@/entities/templates/api/templates';
import type { TemplateDocument } from '@/entities/templates/lib/types';

export const useTemplatesStore = defineStore('templates', {
    state: () => ({
        templates: [] as TemplateDocument[],
        templateBySlug: {} as Record<string, TemplateDocument>,
        templateById: {} as Record<string, TemplateDocument>,
        isLoadingTemplates: false,
        isLoadingTemplate: false,
    }),

    actions: {
        cacheTemplate(template: TemplateDocument) {
            this.templateBySlug[template.slug] = template;
            this.templateById[template.id] = template;

            const existingTemplateIndex = this.templates.findIndex((item) => item.slug === template.slug);

            if (existingTemplateIndex === -1) {
                this.templates.push(template);
                return;
            }

            this.templates.splice(existingTemplateIndex, 1, {
                ...this.templates[existingTemplateIndex],
                ...template,
            });
        },

        async fetchTemplates() {
            if (this.templates.length) {
                return this.templates;
            }

            this.isLoadingTemplates = true;

            try {
                const response = await getDocumentTemplates();

                this.templates = response.items;

                response.items.forEach((template) => {
                    this.templateBySlug[template.slug] = template;
                    this.templateById[template.id] = template;
                });

                return this.templates;
            }
            finally {
                this.isLoadingTemplates = false;
            }
        },

        async fetchTemplateBySlug(slug: string) {
            if (!slug) {
                return null;
            }

            const cachedTemplate = this.templateBySlug[slug];

            if (cachedTemplate?.templateSchema) {
                return cachedTemplate;
            }

            this.isLoadingTemplate = true;

            try {
                const template = await getDocumentTemplateBySlug(slug);
                this.cacheTemplate(template);
                return template;
            }
            finally {
                this.isLoadingTemplate = false;
            }
        },

        async fetchTemplateById(id: string) {
            if (!id) {
                return null;
            }

            const cachedTemplate = this.templateById[id];

            if (cachedTemplate?.templateSchema) {
                return cachedTemplate;
            }

            this.isLoadingTemplate = true;

            try {
                const template = await getDocumentTemplateById(id);
                this.cacheTemplate(template);
                return template;
            }
            finally {
                this.isLoadingTemplate = false;
            }
        },
    },
});
