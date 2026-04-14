import api from '@/api/axios';

export interface GenerateContractHintRequest {
    userMessage: {
        fieldName: string;
        fieldText: string;
        documentType: string;
    };
    userJsonTemplate: Record<string, unknown>;
}

export interface GenerateContractHintResponse {
    fieldName: string;
    status: string;
    text: string;
    comment: string | null;
}

export const generateContractHint = async (payload: GenerateContractHintRequest) => {
    const response = await api.post<GenerateContractHintResponse>(
        '/hint/generate-hint',
        payload,
        {
            headers: {
                'X-Skip-Case-Transform': 'true',
            },
        },
    );

    return response.data;
};
