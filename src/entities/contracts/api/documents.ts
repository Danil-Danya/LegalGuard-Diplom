import api from '@/api/axios';
import type { ContractCreatedDocument } from '@/entities/contracts/lib/types';

const MULTIPART_HEADERS = {
    'Content-Type': 'multipart/form-data',
    'X-Skip-Case-Transform': 'true',
};

export interface CreateDocumentRequest {
    templateId: string;
    title: string;
    description: string;
    templateData: Record<string, unknown>;
    person1Signature?: File | null;
    person1Stamp?: File | null;
    person2Signature?: File | null;
    person2Stamp?: File | null;
}

export interface DocumentFileResponse {
    blob: Blob;
    fileName: string | null;
}

const appendOptionalFile = (formData: FormData, key: string, file?: File | null) => {
    if (!file) {
        return;
    }

    formData.append(key, file);
};

const createDocumentFormData = (payload: CreateDocumentRequest) => {
    const formData = new FormData();

    formData.append('templateId', payload.templateId);
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    formData.append('templateData', JSON.stringify(payload.templateData));

    appendOptionalFile(formData, 'person1Signature', payload.person1Signature);
    appendOptionalFile(formData, 'person1Stamp', payload.person1Stamp);
    appendOptionalFile(formData, 'person2Signature', payload.person2Signature);
    appendOptionalFile(formData, 'person2Stamp', payload.person2Stamp);

    return formData;
};

export const createDocument = async (payload: CreateDocumentRequest) => {
    const response = await api.post<ContractCreatedDocument>(
        '/documents',
        createDocumentFormData(payload),
        {
            headers: MULTIPART_HEADERS,
        },
    );

    return response.data;
};

export const getDocumentById = async (id: string) => {
    const response = await api.get<ContractCreatedDocument>(`/documents/${id}`);

    return response.data;
};

const extractFileNameFromContentDisposition = (contentDisposition?: string) => {
    if (!contentDisposition) {
        return null;
    }

    const utf8FileNameMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);

    if (utf8FileNameMatch?.[1]) {
        try {
            return decodeURIComponent(utf8FileNameMatch[1]);
        }
        catch {
            return utf8FileNameMatch[1];
        }
    }

    const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
    return fileNameMatch?.[1] || null;
};

const getDocumentFile = async (id: string, format: 'pdf' | 'docx') => {
    const response = await api.get<Blob>(`/documents/${id}/${format}`, {
        responseType: 'blob',
    });

    return {
        blob: response.data,
        fileName: extractFileNameFromContentDisposition(response.headers['content-disposition']),
    } satisfies DocumentFileResponse;
};

export const getDocumentPdfFile = async (id: string) => {
    return getDocumentFile(id, 'pdf');
};

export const getDocumentDocxFile = async (id: string) => {
    return getDocumentFile(id, 'docx');
};
