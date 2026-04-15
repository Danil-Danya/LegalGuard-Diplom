import api from '@/api/axios';
import type {
    CompanyDetailsRecord,
    CompanySearchResponse,
    SearchCompaniesRequest,
} from '@/entities/companies/lib/types';

const buildCompaniesSearchPath = (params: SearchCompaniesRequest) => {
    const searchParams = new URLSearchParams({
        search: params.search,
        order: params.order || 'desc',
        orderBy: params.orderBy || 'name',
        page: String(params.page || 1),
        limit: String(params.limit || 10),
    });

    return `/companies?${searchParams.toString()}`;
};

export const searchCompanies = async (params: SearchCompaniesRequest) => {
    const response = await api.get<CompanySearchResponse>(buildCompaniesSearchPath(params));

    return response.data;
};

export const getCompanyById = async (id: string) => {
    const response = await api.get<CompanyDetailsRecord>(`/companies/${id}`);

    return response.data;
};
