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

export interface ContractDocumentPayload {
    templateSlug: string;
    title: string;
    documentDate: string;
    firstParty: string;
    secondParty: string;
    signatureLabel: string;
    description: string[];
    sections: ContractPayloadSection[];
    signatureFileName: string | null;
    attachmentFileName: string | null;
}
