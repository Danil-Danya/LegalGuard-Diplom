import type { TemplateDocument } from '@/entities/templates/lib/types';

import type {
    ContractDocumentPayload,
    ContractFieldSchema,
    ContractFieldValue,
    ContractPartyFilesMap,
    ContractPayloadParty,
    ContractStepSchema,
} from './types';

type ContractFormValues = Record<string, ContractFieldValue>;

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
    return title.trim().toLowerCase().includes('подпись');
};

const isPartyStampField = (title: string) => {
    return title.trim().toLowerCase().includes('печат');
};

const getGroundFieldKey = (partyKey: string, fieldIndex: number) => {
    return `ground_${partyKey}_${fieldIndex}`;
};

const getGroundAssetKey = (partyKey: string, fieldIndex: number) => {
    return `ground_${partyKey}_${fieldIndex}_file`;
};

const resolvePartyDisplayTitle = (partyKey: string, partyIndex?: number) => {
    if (partyKey === 'person1') {
        return 'Лицо 1';
    }

    if (partyKey === 'person2') {
        return 'Лицо 2';
    }

    if (typeof partyIndex === 'number') {
        return `Лицо ${partyIndex + 1}`;
    }

    return 'Сторона';
};

const resolveHeadFieldLabel = (fieldKey: string, fieldTitle: string) => {
    if (fieldKey === 'person1') {
        return 'Лицо 1';
    }

    if (fieldKey === 'person2') {
        return 'Лицо 2';
    }

    return fieldTitle;
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

    return headFields.map((field) => {
        const label = resolveHeadFieldLabel(field.key, field.title);

        return {
            key: field.key,
            label,
            type: field.key === 'documentDate' ? 'date' : 'text',
            step: 1,
            placeholder: field.key === 'documentDate'
                ? 'Выберите дату'
                : `Введите значение для поля "${label}"`,
            defaultValue: field.text,
        };
    });
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

    return parties.flatMap((party, partyIndex) => {
        const partyDisplayTitle = resolvePartyDisplayTitle(party.key, partyIndex);

        return party.fields.flatMap((field, fieldIndex) => {
            if (isPartySignatureField(field.title)) {
                return {
                    key: getGroundAssetKey(party.key, fieldIndex),
                    label: `${partyDisplayTitle}: загрузить подпись`,
                    type: 'file' as const,
                    step: 3 as const,
                    accept: 'image/png,image/jpeg,image/webp',
                    description: 'PNG, JPG или WEBP с подписью для этой стороны документа.',
                    span: 2 as const,
                };
            }

            if (isPartyStampField(field.title)) {
                return {
                    key: getGroundAssetKey(party.key, fieldIndex),
                    label: `${partyDisplayTitle}: загрузить печать`,
                    type: 'file' as const,
                    step: 3 as const,
                    accept: 'image/png,image/jpeg,image/webp',
                    description: 'PNG, JPG или WEBP с печатью для этой стороны документа.',
                    span: 2 as const,
                };
            }

            const isRequisitesField = field.title.trim().toLowerCase().includes('реквизит');
            const fieldType: ContractFieldSchema['type'] = isRequisitesField ? 'textarea' : 'text';

            return {
                key: getGroundFieldKey(party.key, fieldIndex),
                label: `${partyDisplayTitle}: ${field.title}`,
                type: fieldType,
                step: 3 as const,
                placeholder: `Введите значение для поля "${field.title}"`,
                rows: isRequisitesField ? 4 : undefined,
                defaultValue: field.text,
                span: 2 as const,
            };
        });
    });
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
            title: 'Реквизиты, подписи и печати сторон',
            description: 'Добавьте реквизиты сторон и при необходимости загрузите подписи и печати для каждой стороны. Пока файлы не загружены, они не выводятся в документ.',
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

const buildPayloadParties = (
    template: TemplateDocument,
    values: ContractFormValues,
): ContractPayloadParty[] => {
    const parties = template.templateSchema?.ground?.parties ?? [];

    return parties.map((party, partyIndex) => {
        let signatureTitle: string | null = null;
        let signatureFieldKey: string | null = null;
        let signatureFileName: string | null = null;
        let stampTitle: string | null = null;
        let stampFieldKey: string | null = null;
        let stampFileName: string | null = null;

        const visibleFields = party.fields.flatMap((field, fieldIndex) => {
            if (isPartySignatureField(field.title)) {
                signatureTitle = field.title;
                signatureFieldKey = getGroundAssetKey(party.key, fieldIndex);
                signatureFileName = normalizeFileValue(values[signatureFieldKey])?.name ?? null;
                return [];
            }

            if (isPartyStampField(field.title)) {
                stampTitle = field.title;
                stampFieldKey = getGroundAssetKey(party.key, fieldIndex);
                stampFileName = normalizeFileValue(values[stampFieldKey])?.name ?? null;
                return [];
            }

            const rawValue = normalizeTextValue(values[getGroundFieldKey(party.key, fieldIndex)]);
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
            title: resolvePartyDisplayTitle(party.key, partyIndex),
            fields: visibleFields,
            signing: {
                signatureTitle,
                signatureFieldKey,
                signatureFileName,
                stampTitle,
                stampFieldKey,
                stampFileName,
            },
        };
    });
};

export const buildContractPartyFiles = (
    template: TemplateDocument,
    values: ContractFormValues,
): ContractPartyFilesMap => {
    const parties = template.templateSchema?.ground?.parties ?? [];

    return parties.reduce<ContractPartyFilesMap>((result, party) => {
        let signatureFile: File | null = null;
        let stampFile: File | null = null;

        party.fields.forEach((field, fieldIndex) => {
            const fileValue = normalizeFileValue(values[getGroundAssetKey(party.key, fieldIndex)]);

            if (!fileValue) {
                return;
            }

            if (isPartySignatureField(field.title)) {
                signatureFile = fileValue;
                return;
            }

            if (isPartyStampField(field.title)) {
                stampFile = fileValue;
            }
        });

        result[party.key] = {
            signatureFile,
            stampFile,
        };

        return result;
    }, {});
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
        signatureFileName: null,
        attachmentFileName: null,
    };
};

export const buildContractTemplateData = (
    template: TemplateDocument,
    values: ContractFormValues,
) => {
    const templateSchema = template.templateSchema;

    return {
        head: Object.fromEntries(
            Object.entries(templateSchema?.head ?? {}).map(([key, field]) => {
                return [
                    key,
                    {
                        ...field,
                        text: normalizeTextValue(values[key]) || field.text,
                    },
                ];
            }),
        ),
        body: (templateSchema?.body ?? []).map((section, sectionIndex) => ({
            ...section,
            text: normalizeTextValue(values[`body_${sectionIndex}_text`]) || section.text,
            items: section.items.map((item, itemIndex) => ({
                ...item,
                text: normalizeTextValue(values[`body_${sectionIndex}_item_${itemIndex}_text`]) || item.text,
            })),
        })),
        ground: {
            parties: (templateSchema?.ground?.parties ?? []).map((party) => ({
                ...party,
                fields: party.fields.map((field, fieldIndex) => {
                    if (isPartySignatureField(field.title) || isPartyStampField(field.title)) {
                        const uploadedAsset = normalizeFileValue(values[getGroundAssetKey(party.key, fieldIndex)]);

                        return {
                            ...field,
                            text: uploadedAsset?.name ?? '',
                        };
                    }

                    return {
                        ...field,
                        text: normalizeTextValue(values[getGroundFieldKey(party.key, fieldIndex)]) || field.text,
                    };
                }),
            })),
        },
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
            parties: parties.map((party, partyIndex) => ({
                key: party.key,
                title: resolvePartyDisplayTitle(party.key, partyIndex),
                fields: party.fields
                    .map((field, fieldIndex) => ({
                        field,
                        fieldIndex,
                    }))
                    .filter(({ field }) => !isPartySignatureField(field.title) && !isPartyStampField(field.title))
                    .map(({ field, fieldIndex }) => ({
                        title: field.title,
                        text: normalizeTextValue(values[getGroundFieldKey(party.key, fieldIndex)]) || field.text,
                    })),
            })),
        },
        assets: {
            parties: parties.map((party) => {
                const signatureFieldIndex = party.fields.findIndex((field) => isPartySignatureField(field.title));
                const stampFieldIndex = party.fields.findIndex((field) => isPartyStampField(field.title));

                return {
                    key: party.key,
                    signatureFileName: signatureFieldIndex >= 0
                        ? normalizeFileValue(values[getGroundAssetKey(party.key, signatureFieldIndex)])?.name ?? null
                        : null,
                    stampFileName: stampFieldIndex >= 0
                        ? normalizeFileValue(values[getGroundAssetKey(party.key, stampFieldIndex)])?.name ?? null
                        : null,
                };
            }),
        },
    };
};
