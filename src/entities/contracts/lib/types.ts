export type ContractStep = 1 | 2 | 3;

export type ContractFieldType = 'text' | 'date' | 'textarea' | 'file';

export type ContractFieldValue = string | File | null;

export interface ContractFieldSchema {
    key: string;
    label: string;
    type: ContractFieldType;
    step: ContractStep;
    placeholder?: string;
    rows?: number;
    accept?: string;
    description?: string;
    defaultValue?: string;
    span?: 1 | 2;
}

export interface ContractStepSchema {
    step: ContractStep;
    eyebrow: string;
    title: string;
    description: string;
    fields: ContractFieldSchema[];
}

export interface ContractPayloadSection {
    title: string;
    description: string;
}

export interface ContractPayloadBodyItem {
    number: string;
    title: string;
    text: string;
}

export interface ContractPayloadBodySection {
    number: string;
    title: string;
    text: string;
    items: ContractPayloadBodyItem[];
}

export interface ContractPayloadPartyField {
    title: string;
    text: string;
}

export interface ContractPayloadPartySigning {
    signatureTitle: string | null;
    signatureFieldKey: string | null;
    signatureFileName: string | null;
    stampTitle: string | null;
    stampFieldKey: string | null;
    stampFileName: string | null;
}

export interface ContractPayloadParty {
    key: string;
    title: string;
    fields: ContractPayloadPartyField[];
    signing: ContractPayloadPartySigning;
}

export interface ContractDocumentPayload {
    templateSlug: string;
    title: string;
    documentDate: string;
    documentPlace: string;
    firstParty: string;
    secondParty: string;
    body: ContractPayloadBodySection[];
    parties: ContractPayloadParty[];
    signatureFileName: string | null;
    attachmentFileName: string | null;
}

export interface ContractPartyFiles {
    signatureFile: File | null;
    stampFile: File | null;
}

export type ContractPartyFilesMap = Record<string, ContractPartyFiles>;

export interface ContractPartyAssetSource {
    signatureSrc?: string | null;
    stampSrc?: string | null;
}

export type ContractPartyAssetSourcesMap = Record<string, ContractPartyAssetSource>;

export interface ContractTemplateDataHeadField {
    title: string;
    text: string;
}

export interface ContractTemplateDataGroundField {
    title: string;
    text: string;
}

export interface ContractTemplateDataGroundParty {
    key: string;
    title: string;
    fields: ContractTemplateDataGroundField[];
}

export interface ContractTemplateData {
    head?: Record<string, ContractTemplateDataHeadField>;
    body?: ContractPayloadBodySection[];
    ground?: {
        parties?: ContractTemplateDataGroundParty[];
    };
    partyAssetSources?: ContractPartyAssetSourcesMap;
}

export interface ContractCreatedDocument {
    id?: string;
    userId?: string;
    templateId?: string;
    title?: string;
    description?: string;
    templateData?: ContractTemplateData | null;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown;
}
