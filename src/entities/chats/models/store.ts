import { defineStore } from 'pinia';

import { createChat, createMessage, getChats, getMessagesByChatId } from '@/entities/chats/api/chat';
import type {
    ChatItem,
    ChatMessage,
    CreateChatRequest,
    CreateMessageRequest,
} from '@/entities/chats/lib/types';

const normalizeChatTitle = (chat: ChatItem) => {
    return chat.title || chat.messages?.[0]?.aiResponse?.chatTitle || chat.messages?.[0]?.text || 'Новый чат';
};

const getMessageTimestamp = (message: ChatMessage) => {
    const timestamp = message.createdAt ? new Date(message.createdAt).getTime() : Number.NaN;
    return Number.isNaN(timestamp) ? 0 : timestamp;
};

const sortMessagesByCreatedAt = (messages: ChatMessage[]) => {
    return [...messages].sort((left, right) => getMessageTimestamp(left) - getMessageTimestamp(right));
};

export const useChatStore = defineStore('chats', {
    state: () => ({
        chats: [] as ChatItem[],
        messagesByChatId: {} as Record<string, ChatMessage[]>,
        isLoadingChats: false,
        isLoadingMessages: false,
        isSendingMessage: false,
    }),

    actions: {
        setChatMessages(chatId: string, messages: ChatMessage[]) {
            this.messagesByChatId[chatId] = sortMessagesByCreatedAt(messages);
        },

        upsertChat(chat: ChatItem) {
            const normalizedChat = {
                ...chat,
                title: normalizeChatTitle(chat),
            };

            const existingChatIndex = this.chats.findIndex((item) => item.id === normalizedChat.id);

            if (existingChatIndex === -1) {
                this.chats.unshift(normalizedChat);
                return;
            }

            const existingChat = this.chats[existingChatIndex];
            this.chats.splice(existingChatIndex, 1);
            this.chats.unshift({
                ...existingChat,
                ...normalizedChat,
            });
        },

        async fetchChats(includeHistory = false) {
            this.isLoadingChats = true;

            try {
                const response = await getChats(includeHistory);

                this.chats = response.items.map((chat) => ({
                    ...chat,
                    title: normalizeChatTitle(chat),
                }));

                if (includeHistory) {
                    response.items.forEach((chat) => {
                        this.messagesByChatId[chat.id] = sortMessagesByCreatedAt(chat.messages ?? []);
                    });
                }

                return this.chats;
            }
            finally {
                this.isLoadingChats = false;
            }
        },

        async fetchChatMessages(chatId: string) {
            if (!chatId) {
                return [];
            }

            this.isLoadingMessages = true;

            try {
                const response = await getMessagesByChatId(chatId);
                this.setChatMessages(chatId, response.items);
                return response.items;
            }
            finally {
                this.isLoadingMessages = false;
            }
        },

        async createChatWithFirstMessage(payload: CreateChatRequest) {
            this.isSendingMessage = true;

            try {
                const result = await createChat(payload);

                if (result.chat.id) {
                    this.upsertChat(result.chat);

                    if (result.message) {
                        this.setChatMessages(result.chat.id, [result.message]);
                    }
                }

                return result;
            }
            finally {
                this.isSendingMessage = false;
            }
        },

        async createChatMessage(payload: CreateMessageRequest) {
            this.isSendingMessage = true;

            try {
                const message = await createMessage(payload);
                const currentMessages = this.messagesByChatId[payload.chatId] ?? [];

                this.setChatMessages(payload.chatId, [...currentMessages, message]);

                const existingChat = this.chats.find((chat) => chat.id === payload.chatId);

                if (existingChat) {
                    this.upsertChat({
                        ...existingChat,
                        title: message.aiResponse?.chatTitle || existingChat.title,
                    });
                }

                return message;
            }
            finally {
                this.isSendingMessage = false;
            }
        },
    },
});
