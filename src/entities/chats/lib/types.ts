export interface AiRisk {
    title: string;
    severity: string;
    description: string;
    recommendation: string;
}

export interface AiBadge {
    type: string;
    label: string;
}

export interface AiSource {
    url: string;
    title: string;
}

export interface AiResponse {
    text: string;
    risks: AiRisk[];
    badges: AiBadge[];
    status: string;
    sources: AiSource[];
    chatTitle?: string;
}

export interface ChatMessage {
    id: string;
    chatId: string;
    tokens?: number;
    text: string;
    fileText: string | null;
    aiResponse?: AiResponse | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ChatItem {
    id: string;
    userId: string;
    title: string;
    messages?: ChatMessage[];
}

export interface PaginationMeta {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    meta: PaginationMeta;
    items: T[];
}

export interface CreateChatRequest {
    message: string;
    file?: File | null;
    fileText?: string;
}

export interface CreateMessageRequest {
    chatId: string;
    text: string;
    file?: File | null;
    fileText?: string;
}

export interface CreateChatResult {
    chat: ChatItem;
    message: ChatMessage | null;
}

export interface UiChatMessage {
    id: string;
    role: 'user' | 'ai';
    text: string;
    createdAt?: string;
    pending?: boolean;
    badges?: AiBadge[];
    risks?: AiRisk[];
    sources?: AiSource[];
    animateText?: boolean;
}
