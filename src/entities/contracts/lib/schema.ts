import type { TemplateDocument } from '@/entities/templates/lib/types';

import type {
    ContractDocumentPayload,
    ContractFieldSchema,
    ContractFieldValue,
    ContractStepSchema,
} from './types';

type ContractFormValues = Record<string, ContractFieldValue>;

const stepOneFields: ContractFieldSchema[] = [
    {
        key: 'documentDate',
        label: 'Дата документа',
        type: 'date',
        step: 1,
        placeholder: 'Выберите дату',
    },
    {
        key: 'firstParty',
        label: 'Лицо 1',
        type: 'text',
        step: 1,
        placeholder: 'Введите первую сторону',
    },
    {
        key: 'secondParty',
        label: 'Лицо 2',
        type: 'text',
        step: 1,
        placeholder: 'Введите вторую сторону',
    },
    {
        key: 'signatureLabel',
        label: 'Подпись',
        type: 'text',
        step: 1,
        placeholder: 'Введите подпись для документа',
    },
];

const stepThreeFields: ContractFieldSchema[] = [
    {
        key: 'signatureFile',
        label: 'Загрузить подпись',
        type: 'file',
        step: 3,
        accept: 'image/png,image/jpeg,image/webp',
        description: 'PNG, JPG или WEBP с подписью для финального документа.',
    },
    {
        key: 'attachmentFile',
        label: 'Загрузить печать',
        type: 'file',
        step: 3,
        accept: 'image/png,image/jpeg,image/webp',
        description: 'PNG, JPG или WEBP с печатью для финального документа.',
    },
];

const normalizeTextValue = (value?: ContractFieldValue) => {
    return typeof value === 'string' ? value : '';
};

const normalizeFileValue = (value?: ContractFieldValue) => {
    return value instanceof File ? value : null;
};

export const buildContractStepSchemas = (template: TemplateDocument): ContractStepSchema[] => {
    const descriptionFields: ContractFieldSchema[] = template.description.map((paragraph, index) => ({
        key: `description_${index}`,
        label: `Описание документа ${index + 1}`,
        type: 'textarea',
        step: 2,
        placeholder: 'Введите текст абзаца',
        rows: 4,
        defaultValue: paragraph,
        span: 2,
    }));

    const sectionFields: ContractFieldSchema[] = template.sections.map((section, index) => ({
        key: `section_${index}`,
        label: section.title,
        type: 'textarea',
        step: 2,
        placeholder: 'Введите описание раздела',
        rows: 5,
        defaultValue: section.description,
        span: 2,
    }));

    return [
        {
            step: 1,
            eyebrow: 'Шаг 01',
            title: 'Основные данные документа',
            description: 'Укажите базовые реквизиты, которые попадут в титульную часть и подписи договора.',
            fields: stepOneFields,
        },
        {
            step: 2,
            eyebrow: 'Шаг 02',
            title: 'Содержание документа',
            description: 'Заполните текстовые блоки. Все изменения сразу отображаются на листе справа.',
            fields: [...descriptionFields, ...sectionFields],
        },
        {
            step: 3,
            eyebrow: 'Шаг 03',
            title: 'Подпись и печать',
            description: 'Загрузите подпись и печать. Пока файлы не добавлены, они не попадают в документ.',
            fields: stepThreeFields,
        },
    ];
};

export const buildContractInitialValues = (template: TemplateDocument) => {
    const values: ContractFormValues = {};

    buildContractStepSchemas(template)
        .flatMap((step) => step.fields)
        .forEach((field) => {
            values[field.key] = field.type === 'file' ? null : field.defaultValue ?? '';
        });

    return values;
};

export const buildContractPayload = (
    template: TemplateDocument,
    values: ContractFormValues,
): ContractDocumentPayload => {
    return {
        templateSlug: template.slug,
        title: template.title,
        documentDate: normalizeTextValue(values.documentDate),
        firstParty: normalizeTextValue(values.firstParty),
        secondParty: normalizeTextValue(values.secondParty),
        signatureLabel: normalizeTextValue(values.signatureLabel),
        description: template.description.map((_, index) => {
            return normalizeTextValue(values[`description_${index}`]);
        }),
        sections: template.sections.map((section, index) => ({
            title: section.title,
            description: normalizeTextValue(values[`section_${index}`]),
        })),
        signatureFileName: normalizeFileValue(values.signatureFile)?.name ?? null,
        attachmentFileName: normalizeFileValue(values.attachmentFile)?.name ?? null,
    };
};
