import type { TemplateDocument } from '@/entities/templates/lib/types';

import type {
    ContractDocumentPayload,
    ContractFieldSchema,
    ContractFieldValue,
    ContractPayloadParty,
    ContractStepSchema,
} from './types';

type ContractFormValues = Record<string, ContractFieldValue>;

const stepThreeUploadFields: ContractFieldSchema[] = [
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

const resolveTemplateHeadEntries = (template: TemplateDocument) => {
    const head = template.templateSchema?.head;

    if (!head) {
        return [];
    }

    const preferredOrder = ['documentTitle', 'documentDate', 'documentPlace', 'person1', 'person2'];

    return preferredOrder
        .map((key) => {
            const field = head[key];

            if (!field) {
                return null;
            }

            return { key, ...field };
        })
        .filter(Boolean) as Array<{ key: string; title: string; text: string }>;
};

const isPartySignatureField = (title: string) => {
    const normalizedTitle = title.trim().toLowerCase();
    return normalizedTitle.includes('подпись');
};

const isPartyStampField = (title: string) => {
    const normalizedTitle = title.trim().toLowerCase();
    return normalizedTitle.includes('печат');
};

const buildHeadStepFields = (template: TemplateDocument): ContractFieldSchema[] => {
    const headFields = resolveTemplateHeadEntries(template);

    if (!headFields.length) {
        return [
            {
                key: 'documentDate',
                label: 'Дата документа',
                type: 'date',
                step: 1,
                placeholder: 'Выберите дату',
            },
            {
                key: 'person1',
                label: 'Лицо 1',
                type: 'text',
                step: 1,
                placeholder: 'Введите первую сторону',
            },
            {
                key: 'person2',
                label: 'Лицо 2',
                type: 'text',
                step: 1,
                placeholder: 'Введите вторую сторону',
            },
        ];
    }

    return headFields.map((field) => ({
        key: field.key,
        label: field.title,
        type: field.key === 'documentDate' ? 'date' : 'text',
        step: 1,
        placeholder: field.key === 'documentDate' ? 'Выберите дату' : `Введите значение для поля "${field.title}"`,
        defaultValue: field.text,
    }));
};

const buildBodyStepFields = (template: TemplateDocument): ContractFieldSchema[] => {
    const body = template.templateSchema?.body ?? [];

    return body.flatMap((section, sectionIndex) => {
        const fields: ContractFieldSchema[] = [
            {
                key: `body_${sectionIndex}_text`,
                label: `${section.number}. ${section.title}`,
                type: 'textarea',
                step: 2,
                placeholder: `Введите текст для раздела "${section.title}"`,
                rows: 4,
                defaultValue: section.text,
                span: 2,
            },
        ];

        section.items.forEach((item, itemIndex) => {
            fields.push({
                key: `body_${sectionIndex}_item_${itemIndex}_text`,
                label: `${item.number}. ${item.title}`,
                type: 'textarea',
                step: 2,
                placeholder: `Введите текст для пункта "${item.title}"`,
                rows: 4,
                defaultValue: item.text,
                span: 2,
            });
        });

        return fields;
    });
};

const buildGroundStepFields = (template: TemplateDocument): ContractFieldSchema[] => {
    const parties = template.templateSchema?.ground?.parties ?? [];

    const generatedFields = parties.flatMap((party) => {
        return party.fields.flatMap((field, fieldIndex) => {
            if (isPartySignatureField(field.title) || isPartyStampField(field.title)) {
                return [];
            }

            const isRequisitesField = field.title.trim().toLowerCase().includes('реквизит');
            const fieldType: ContractFieldSchema['type'] = isRequisitesField ? 'textarea' : 'text';

            return {
                key: `ground_${party.key}_${fieldIndex}`,
                label: `${party.title}: ${field.title}`,
                type: fieldType,
                step: 3 as const,
                placeholder: `Введите значение для поля "${field.title}"`,
                rows: isRequisitesField ? 4 : undefined,
                defaultValue: field.text,
                span: 2 as const,
            };
        });
    });

    return [...generatedFields, ...stepThreeUploadFields];
};

export const buildContractStepSchemas = (template: TemplateDocument): ContractStepSchema[] => {
    const bodyFields = buildBodyStepFields(template);

    return [
        {
            step: 1,
            eyebrow: 'Шаг 01',
            title: 'Основные данные документа',
            description: 'Заполните титульную часть договора. Эти значения сразу попадут в верхнюю часть финального листа.',
            fields: buildHeadStepFields(template),
        },
        {
            step: 2,
            eyebrow: 'Шаг 02',
            title: 'Содержание документа',
            description: 'Заполните текст разделов и пунктов. Справа показывается итоговый вид договора с учетом структуры шаблона.',
            fields: bodyFields,
        },
        {
            step: 3,
            eyebrow: 'Шаг 03',
            title: 'Реквизиты, подпись и печать',
            description: 'Добавьте реквизиты сторон и при необходимости загрузите подпись и печать. Пока файлы не загружены, они не выводятся в документ.',
            fields: buildGroundStepFields(template),
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

const resolvePartyDefaultName = (partyKey: string, values: ContractFormValues) => {
    if (partyKey === 'person1') {
        return normalizeTextValue(values.person1 || values.firstParty);
    }

    if (partyKey === 'person2') {
        return normalizeTextValue(values.person2 || values.secondParty);
    }

    return '';
};

const buildPayloadParties = (template: TemplateDocument, values: ContractFormValues): ContractPayloadParty[] => {
    const parties = template.templateSchema?.ground?.parties ?? [];

    return parties.map((party) => {
        const visibleFields = party.fields.flatMap((field, fieldIndex) => {
            if (isPartySignatureField(field.title) || isPartyStampField(field.title)) {
                return [];
            }

            const rawValue = normalizeTextValue(values[`ground_${party.key}_${fieldIndex}`]);
            const fallbackValue = field.title.trim().toLowerCase() === 'фио'
                ? resolvePartyDefaultName(party.key, values)
                : '';

            return {
                title: field.title,
                text: rawValue || fallbackValue || field.text,
            };
        });

        return {
            key: party.key,
            title: party.title,
            fields: visibleFields,
        };
    });
};

export const buildContractPayload = (
    template: TemplateDocument,
    values: ContractFormValues,
): ContractDocumentPayload => {
    const body = template.templateSchema?.body ?? [];
    const head = template.templateSchema?.head;

    return {
        templateSlug: template.slug,
        title: normalizeTextValue(values.documentTitle) || head?.documentTitle?.text || template.title,
        documentDate: normalizeTextValue(values.documentDate),
        documentPlace: normalizeTextValue(values.documentPlace) || head?.documentPlace?.text || '',
        firstParty: normalizeTextValue(values.person1 || values.firstParty) || head?.person1?.text || '',
        secondParty: normalizeTextValue(values.person2 || values.secondParty) || head?.person2?.text || '',
        body: body.map((section, sectionIndex) => ({
            number: section.number,
            title: section.title,
            text: normalizeTextValue(values[`body_${sectionIndex}_text`]) || section.text,
            items: section.items.map((item, itemIndex) => ({
                number: item.number,
                title: item.title,
                text: normalizeTextValue(values[`body_${sectionIndex}_item_${itemIndex}_text`]) || item.text,
            })),
        })),
        parties: buildPayloadParties(template, values),
        signatureFileName: normalizeFileValue(values.signatureFile)?.name ?? null,
        attachmentFileName: normalizeFileValue(values.attachmentFile)?.name ?? null,
    };
};

export const buildHintTemplateContext = (
    template: TemplateDocument,
    values: ContractFormValues,
) => {
    const head = template.templateSchema?.head;
    const body = template.templateSchema?.body ?? [];
    const parties = template.templateSchema?.ground?.parties ?? [];

    return {
        documentTitle: normalizeTextValue(values.documentTitle) || head?.documentTitle?.text || template.title,
        head: {
            documentDate: normalizeTextValue(values.documentDate) || head?.documentDate?.text || '',
            documentPlace: normalizeTextValue(values.documentPlace) || head?.documentPlace?.text || '',
            person1: normalizeTextValue(values.person1) || head?.person1?.text || '',
            person2: normalizeTextValue(values.person2) || head?.person2?.text || '',
        },
        parties: {
            person1: normalizeTextValue(values.person1) || head?.person1?.text || '',
            person2: normalizeTextValue(values.person2) || head?.person2?.text || '',
        },
        body: body.map((section, sectionIndex) => ({
            number: section.number,
            title: section.title,
            text: normalizeTextValue(values[`body_${sectionIndex}_text`]) || section.text,
            items: section.items.map((item, itemIndex) => ({
                number: item.number,
                title: item.title,
                text: normalizeTextValue(values[`body_${sectionIndex}_item_${itemIndex}_text`]) || item.text,
            })),
        })),
        ground: {
            parties: parties.map((party) => ({
                key: party.key,
                title: party.title,
                fields: party.fields
                    .map((field, fieldIndex) => ({
                        field,
                        fieldIndex,
                    }))
                    .filter(({ field }) => !isPartySignatureField(field.title) && !isPartyStampField(field.title))
                    .map(({ field, fieldIndex }) => ({
                        title: field.title,
                        text: normalizeTextValue(values[`ground_${party.key}_${fieldIndex}`]) || field.text,
                    })),
            })),
        },
        assets: {
            signatureFileName: normalizeFileValue(values.signatureFile)?.name ?? null,
            attachmentFileName: normalizeFileValue(values.attachmentFile)?.name ?? null,
        },
    };
};
