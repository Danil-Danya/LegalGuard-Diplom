import { defineStore } from 'pinia';

import { buildContractInitialValues, buildContractStepSchemas } from '@/entities/contracts/lib/schema';
import type { ContractFieldValue } from '@/entities/contracts/lib/types';
import type { TemplateDocument } from '@/entities/templates/lib/types';

export const useContractStore = defineStore('contracts', {
    state: () => ({
        activeTemplateSlug: '',
        values: {} as Record<string, ContractFieldValue>,
    }),

    actions: {
        initializeTemplate(template: TemplateDocument) {
            const initialValues = buildContractInitialValues(template);

            if (this.activeTemplateSlug !== template.slug) {
                this.activeTemplateSlug = template.slug;
                this.values = initialValues;
                return;
            }

            buildContractStepSchemas(template)
                .flatMap((step) => step.fields)
                .forEach((field) => {
                    if (!(field.key in this.values)) {
                        this.values[field.key] = initialValues[field.key] ?? null;
                    }
                });
        },

        setFieldValue(key: string, value: ContractFieldValue) {
            this.values[key] = value;
        },

        resetTemplate() {
            this.activeTemplateSlug = '';
            this.values = {};
        },
    },
});
