import api from '@/api/axios';
import type {
    ChatItem,
    ChatMessage,
    CreateChatRequest,
    CreateChatResult,
    CreateMessageRequest,
    PaginatedResponse,
} from '@/entities/chats/lib/types';

const MULTIPART_HEADERS = {
    'Content-Type': 'multipart/form-data',
    'X-Skip-Case-Transform': 'true',
};

const JSON_HEADERS = {
    'Content-Type': 'application/json',
};

const MESSAGE_LIST_QUERY = 'order=asc&orderBy=createdAt&page=1&limit=10';

const appendDefinedValue = (formData: FormData, key: string, value: string | undefined | null) => {
    if (typeof value !== 'string') {
        return;
    }

    formData.append(key, value);
};

const isChatMessage = (value: unknown): value is ChatMessage => {
    if (!value || typeof value !== 'object') {
        return false;
    }

    return typeof (value as ChatMessage).chatId === 'string';
};

const isChatItem = (value: unknown): value is ChatItem => {
    if (!value || typeof value !== 'object') {
        return false;
    }

    return typeof (value as ChatItem).title === 'string'
        && typeof (value as ChatItem).id === 'string'
        && !('chatId' in (value as Record<string, unknown>));
};

const createMultipartPayload = (payload: CreateChatRequest | CreateMessageRequest, includeChatId = false) => {
    const formData = new FormData();

    if (includeChatId && 'chatId' in payload) {
        appendDefinedValue(formData, 'chatId', payload.chatId);
    }

    appendDefinedValue(formData, 'message' in payload ? 'message' : 'text', 'message' in payload ? payload.message : payload.text);
    appendDefinedValue(formData, 'fileText', payload.fileText);

    if (payload.file) {
        formData.append('file', payload.file);
    }

    return formData;
};

const normalizeChatTitle = (chat: Partial<ChatItem>, message?: ChatMessage | null) => {
    return chat.title || message?.aiResponse?.chatTitle || message?.text || 'Новый чат';
};

const extractChatAndMessage = (payload: unknown): CreateChatResult => {
    const maybePayload = payload as Record<string, unknown> | undefined;

    const nestedChatCandidates = [
        maybePayload?.chat,
        maybePayload?.createdChat,
        maybePayload?.data,
        payload,
    ];

    const nestedMessageCandidates = [
        maybePayload?.message,
        maybePayload?.createdMessage,
        maybePayload?.firstMessage,
        maybePayload?.messages,
        maybePayload?.chat && typeof maybePayload.chat === 'object' ? (maybePayload.chat as ChatItem).messages?.[0] : undefined,
        payload,
    ];

    const message = nestedMessageCandidates.find((candidate) => {
        if (Array.isArray(candidate)) {
            return candidate.some(isChatMessage);
        }

        return isChatMessage(candidate);
    });

    const normalizedMessage = Array.isArray(message)
        ? message.find(isChatMessage) ?? null
        : isChatMessage(message)
            ? message
            : null;

    const chat = nestedChatCandidates.find(isChatItem);

    if (chat) {
        return {
            chat: {
                ...chat,
                title: normalizeChatTitle(chat, normalizedMessage),
            },
            message: normalizedMessage,
        };
    }

    if (normalizedMessage) {
        return {
            chat: {
                id: normalizedMessage.chatId,
                userId: '',
                title: normalizeChatTitle({}, normalizedMessage),
            },
            message: normalizedMessage,
        };
    }

    return {
        chat: {
            id: '',
            userId: '',
            title: 'Новый чат',
        },
        message: null,
    };
};

export const getChats = async (includeHistory = false) => {
    const response = await api.get<PaginatedResponse<ChatItem>>(
        includeHistory ? '/chats/?includeHistory=true' : '/chats/',
    );

    return response.data;
};

export const getMessagesByChatId = async (chatId: string) => {
    const response = await api.get<PaginatedResponse<ChatMessage>>(
        `/messages/?where=${encodeURIComponent(chatId)}&whereField=chatId&${MESSAGE_LIST_QUERY}`,
    );

    return response.data;
};

export const createChat = async (payload: CreateChatRequest) => {
    if (payload.file) {
        const response = await api.post(
            '/chats',
            createMultipartPayload(payload),
            {
                headers: MULTIPART_HEADERS,
            },
        );

        return extractChatAndMessage(response.data);
    }

    const response = await api.post(
        '/chats',
        JSON.stringify({
            message: payload.message,
            ...(payload.fileText ? { fileText: payload.fileText } : {}),
        }),
        {
            headers: JSON_HEADERS,
        },
    );

    return extractChatAndMessage(response.data);
};

export const createMessage = async (payload: CreateMessageRequest) => {
    if (payload.file) {
        const response = await api.post<ChatMessage>(
            '/messages',
            createMultipartPayload(payload, true),
            {
                headers: MULTIPART_HEADERS,
            },
        );

        return response.data;
    }

    const response = await api.post<ChatMessage>(
        '/messages',
        JSON.stringify({
            chatId: payload.chatId,
            text: payload.text,
            ...(payload.fileText ? { fileText: payload.fileText } : {}),
        }),
        {
            headers: JSON_HEADERS,
        },
    );

    return response.data;
};
