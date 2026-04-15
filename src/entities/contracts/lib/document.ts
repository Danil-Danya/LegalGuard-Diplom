import type {
    ContractCreatedDocument,
    ContractDocumentPayload,
    ContractPartyAssetSourcesMap,
    ContractPayloadParty,
    ContractTemplateDataGroundField,
    ContractTemplateDataGroundParty,
} from '@/entities/contracts/lib/types';

const getAssetBaseUrl = () => {
    return (import.meta.env.VITE_APP_STATIC_URL || import.meta.env.VITE_API_BASE_URL || '') as string;
};

const normalizeTextValue = (value?: string | null) => {
    return typeof value === 'string' ? value : '';
};

const isPartySignatureField = (title: string) => {
    return title.trim().toLowerCase().includes('подпись');
};

const isPartyStampField = (title: string) => {
    return title.trim().toLowerCase().includes('печат');
};

const isAssetPathLike = (value?: string | null) => {
    if (!value) {
        return false;
    }

    return /^https?:\/\//i.test(value)
        || value.startsWith('/')
        || /\.(png|jpe?g|webp|svg)$/i.test(value);
};

const resolveAssetUrl = (value?: string | null) => {
    if (!value) {
        return null;
    }

    if (/^https?:\/\//i.test(value)) {
        return value;
    }

    try {
        return new URL(value, getAssetBaseUrl()).href;
    }
    catch {
        return null;
    }
};

const getHeadFieldText = (document: ContractCreatedDocument, key: string) => {
    return normalizeTextValue(document.templateData?.head?.[key]?.text);
};

const getFieldTextValue = (field?: ContractTemplateDataGroundField) => {
    const text = normalizeTextValue(field?.text).trim();

    return text || null;
};

const buildDocumentParty = (party: ContractTemplateDataGroundParty): ContractPayloadParty => {
    const signatureField = party.fields.find((field) => isPartySignatureField(field.title));
    const stampField = party.fields.find((field) => isPartyStampField(field.title));

    return {
        key: party.key,
        title: party.title,
        fields: party.fields
            .filter((field) => !isPartySignatureField(field.title) && !isPartyStampField(field.title))
            .map((field) => ({
                title: field.title,
                text: normalizeTextValue(field.text),
            })),
        signing: {
            signatureTitle: signatureField?.title ?? null,
            signatureFieldKey: null,
            signatureFileName: getFieldTextValue(signatureField),
            stampTitle: stampField?.title ?? null,
            stampFieldKey: null,
            stampFileName: getFieldTextValue(stampField),
        },
    };
};

export const createEmptyContractPayload = (): ContractDocumentPayload => {
    return {
        templateSlug: '',
        title: '',
        documentDate: '',
        documentPlace: '',
        firstParty: '',
        secondParty: '',
        body: [],
        parties: [],
        signatureFileName: null,
        attachmentFileName: null,
    };
};

export const buildContractPayloadFromDocument = (
    document: ContractCreatedDocument,
    templateSlug = '',
) => {
    const templateData = document.templateData;
    const parties = (templateData?.ground?.parties ?? []).map(buildDocumentParty);

    return {
        templateSlug,
        title: normalizeTextValue(document.title) || getHeadFieldText(document, 'documentTitle'),
        documentDate: getHeadFieldText(document, 'documentDate'),
        documentPlace: getHeadFieldText(document, 'documentPlace'),
        firstParty: getHeadFieldText(document, 'person1'),
        secondParty: getHeadFieldText(document, 'person2'),
        body: (templateData?.body ?? []).map((section) => ({
            number: section.number,
            title: section.title,
            text: normalizeTextValue(section.text),
            items: (section.items ?? []).map((item) => ({
                number: item.number,
                title: item.title,
                text: normalizeTextValue(item.text),
            })),
        })),
        parties,
        signatureFileName: null,
        attachmentFileName: null,
    };
};

export const buildContractPartyAssetSourcesFromDocument = (
    document: ContractCreatedDocument,
) => {
    const templateData = document.templateData;
    const partyAssetSources = templateData?.partyAssetSources ?? {};
    const parties = templateData?.ground?.parties ?? [];

    return parties.reduce<ContractPartyAssetSourcesMap>((result, party) => {
        const storedAssetSources = partyAssetSources[party.key] ?? {};
        const signatureField = party.fields.find((field) => isPartySignatureField(field.title));
        const stampField = party.fields.find((field) => isPartyStampField(field.title));

        const signatureSrc = resolveAssetUrl(storedAssetSources.signatureSrc)
            || (isAssetPathLike(signatureField?.text) ? resolveAssetUrl(signatureField?.text) : null);
        const stampSrc = resolveAssetUrl(storedAssetSources.stampSrc)
            || (isAssetPathLike(stampField?.text) ? resolveAssetUrl(stampField?.text) : null);

        if (!signatureSrc && !stampSrc) {
            return result;
        }

        result[party.key] = {
            signatureSrc,
            stampSrc,
        };

        return result;
    }, {});
};
