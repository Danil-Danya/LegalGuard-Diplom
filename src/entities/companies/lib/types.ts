export type CompanyStatus = 'ACTIVE' | 'ON_REVIEW' | 'LIQUIDATED' | string;

export interface CompaniesPaginationMeta {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export interface CompanySearchListItem {
    id: string;
    inn: string;
    name: string;
    founder: string;
    director: string;
    companyStatus: CompanyStatus;
    texDebt: boolean;
}

export interface CompanySearchResponse {
    meta: CompaniesPaginationMeta;
    items: CompanySearchListItem[];
}

export interface CompanyAiBadge {
    type: 'risk' | 'warning' | 'info' | string;
    label: string;
}

export interface CompanyAiFinding {
    title: string;
    description: string;
    severity: 'high' | 'medium' | 'low' | string;
}

export interface CompanyAiResult {
    companyName: string;
    verdict: 'low_risk' | 'medium_risk' | 'high_risk' | string;
    riskScore: number;
    summary: string;
    badges: CompanyAiBadge[];
    findings: CompanyAiFinding[];
    recommendations: string[];
    disclaimer: string;
}

export interface CompanyDetailsRecord {
    id: string;
    name: string;
    inn: string;
    phone: string;
    email: string;
    address: string;
    founder: string;
    texDebt: boolean;
    director: string;
    companyStatus: CompanyStatus;
    stabilityRating: string;
    authorizedFund: string;
    registrationDate: string;
    aiResult?: CompanyAiResult | null;
}

export interface SearchCompaniesRequest {
    search: string;
    order?: 'asc' | 'desc';
    orderBy?: string;
    page?: number;
    limit?: number;
}
