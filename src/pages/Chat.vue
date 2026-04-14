<template>
    <section
        class="chat flex flex-1 flex-col px-[32px] py-[32px] max-md:px-[15px] max-md:py-[20px]"
        :class="showHero ? 'items-center justify-center' : 'items-center justify-start'"
        :style="{ paddingBottom: `${composerViewportOffset}px` }"
    >
        <div v-if="showHero" class="chat__container !mt-[70px]">
            <div class="container">
                <div class="mx-auto flex max-w-[920px] flex-col items-center">
                    <div class="inline-flex h-[56px] w-[56px] items-center justify-center rounded-[10px] border border-[var(--color-primary-10)] bg-white text-primary shadow-[0_16px_32px_rgba(45,51,56,0.08)]">
                        <ScalesHeroIcon />
                    </div>
                    <h2 class="title !mt-[24px] max-w-[920px] text-center text-balance !text-[20px] !leading-[26px] max-xs:!text-[18px] max-xs:!leading-[24px] md:!text-[28px] md:!leading-[34px] lg:!text-[36px] lg:!leading-[42px] xl:!text-[44px] xl:!leading-[50px]">
                        Опишите ситуацию или загрузите договор, а система сформирует ответ и историю переписки.
                    </h2>
                    <p class="!mt-[14px] max-w-[760px] text-center text-[13px] font-medium leading-[20px] text-text-muted md:text-[15px] md:leading-[24px]">
                        Ваш персональный юридический ИИ-ассистент, обученный на базе 50,000+ прецедентов.
                    </p>
                </div>
            </div>
        </div>

        <div v-if="uiMessages.length" class="w-full max-w-[920px]" :class="showHero ? '!mt-[70px]' : '!mt-[30px]'">
            <div class="chat__block" v-for="chatMessage in uiMessages" :key="chatMessage.id">
                <ChatMessageAi
                    v-if="chatMessage.role === 'ai'"
                    :text="chatMessage.text"
                    :time="formatMessageTime(chatMessage.createdAt)"
                    :created-at="chatMessage.createdAt"
                    :pending="chatMessage.pending"
                    :badges="chatMessage.badges"
                    :risks="chatMessage.risks"
                    :sources="chatMessage.sources"
                    :animate-text="chatMessage.animateText"
                    @animation-progress="handleAiAnimationProgress"
                    @animation-complete="handleAiAnimationComplete(chatMessage.id)"
                />
                <ChatMessageUser
                    v-else
                    :text="chatMessage.text"
                    :time="formatMessageTime(chatMessage.createdAt)"
                    :pending="chatMessage.pending"
                />
            </div>

            <div ref="messagesEndRef"></div>
        </div>

        <div ref="composerRef" class="fixed bottom-[50px] left-[60%] flex w-full max-w-[920px] -translate-x-1/2 flex-col gap-[10px] max-md:bottom-[15px] max-md:left-[15px] max-md:right-[15px] max-md:w-auto max-md:translate-x-0">
            <ErrorMessage v-if="submitError" :text="submitError" />
            <MobileChatTabbar class="order-2" />
            <ChatInput
                v-model="message"
                :disabled="chatStore.isSendingMessage || chatStore.isLoadingMessages"
                placeholder="Опишите задачу или вставьте документ..."
                mobile-placeholder="Опишите задачу или файл..."
                @submit="handleMessageSubmit"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
    import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router';

    import { useChatStore } from '@/entities/chats/models/store';
    import type { ChatMessage, UiChatMessage } from '@/entities/chats/lib/types';
    import { getAuthRequestErrorMessage } from '@/entities/users/api/auth';
    import ScalesHeroIcon from '@/shared/icons/chat/ScalesHero.vue';
    import MobileChatTabbar from '@/shared/layout/MobileChatTabbar.vue';
    import ChatInput from '@/shared/ui/ChatInput.vue';
    import ErrorMessage from '@/shared/ui/ErrorMessage.vue';
    import ChatMessageAi from '@/shared/widgets/ChatMessageAi.vue';
    import ChatMessageUser from '@/shared/widgets/ChatMessageUser.vue';

    const route = useRoute();
    const router = useRouter();
    const chatStore = useChatStore();

    const message = ref('');
    const submitError = ref('');
    const uiMessages = ref<UiChatMessage[]>([]);
    const messagesEndRef = ref<HTMLDivElement | null>(null);
    const composerRef = ref<HTMLDivElement | null>(null);
    const composerViewportOffset = ref(196);
    const animatedAiMessageIds = new Set<string>();
    let composerResizeObserver: ResizeObserver | null = null;

    const getChatScrollContainer = () => {
        if (typeof document === 'undefined') {
            return null;
        }

        return document.querySelector<HTMLElement>('[data-chat-scroll-container]');
    };

    const activeChatId = computed(() => {
        const { chat_id } = route.params;
        return Array.isArray(chat_id) ? chat_id[0] : chat_id || '';
    });

    const isNewChatRoute = computed(() => {
        return route.name === 'chat-new';
    });

    const showHero = computed(() => {
        return isNewChatRoute.value && !uiMessages.value.length;
    });

    const getDisplayUserMessage = (chatMessage: ChatMessage) => {
        return chatMessage.text || chatMessage.fileText || 'Файл без подписи';
    };

    const toUiMessages = (messages: ChatMessage[]) => {
        return messages.flatMap<UiChatMessage>((chatMessage) => {
            const nextMessages: UiChatMessage[] = [
                {
                    id: `${chatMessage.id}-user`,
                    role: 'user',
                    text: getDisplayUserMessage(chatMessage),
                    createdAt: chatMessage.createdAt,
                },
            ];

            if (chatMessage.aiResponse?.text) {
                nextMessages.push({
                    id: `${chatMessage.id}-ai`,
                    role: 'ai',
                    text: chatMessage.aiResponse.text,
                    createdAt: chatMessage.updatedAt || chatMessage.createdAt,
                    badges: chatMessage.aiResponse.badges ?? [],
                    risks: chatMessage.aiResponse.risks ?? [],
                    sources: chatMessage.aiResponse.sources ?? [],
                    animateText: animatedAiMessageIds.has(`${chatMessage.id}-ai`),
                });
            }

            return nextMessages;
        });
    };

    const syncMessagesFromStore = (chatId: string) => {
        const storedMessages = chatStore.messagesByChatId[chatId] ?? [];
        uiMessages.value = toUiMessages(storedMessages);
    };

    const scrollChatContainerToBottom = (behavior: ScrollBehavior = 'auto') => {
        const scrollContainer = getChatScrollContainer();

        if (!scrollContainer) {
            return;
        }

        scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior,
        });
    };

    const measureComposerViewportOffset = async () => {
        await nextTick();

        const scrollContainer = getChatScrollContainer();

        if (!composerRef.value || !scrollContainer) {
            return;
        }

        const composerBounds = composerRef.value.getBoundingClientRect();
        const scrollContainerBounds = scrollContainer.getBoundingClientRect();
        const viewportOffset = Math.max(0, scrollContainerBounds.bottom - composerBounds.top);
        composerViewportOffset.value = Math.max(160, Math.ceil(viewportOffset + 24));
    };

    const scrollToBottom = async (behavior: ScrollBehavior = 'auto') => {
        await nextTick();
        scrollChatContainerToBottom(behavior);
        requestAnimationFrame(() => {
            scrollChatContainerToBottom('auto');
        });
    };

    const formatMessageTime = (value?: string) => {
        if (!value) {
            return '';
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return '';
        }

        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const createOptimisticMessage = (text: string) => {
        return {
            id: `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            role: 'user' as const,
            text,
            pending: true,
            createdAt: new Date().toISOString(),
        };
    };

    const createPendingAiMessage = () => {
        return {
            id: `temp-ai-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            role: 'ai' as const,
            text: '',
            pending: true,
            createdAt: new Date().toISOString(),
        };
    };

    const rememberAnimatedAiMessage = (chatMessage: ChatMessage | null) => {
        if (!chatMessage?.aiResponse?.text) {
            return;
        }

        animatedAiMessageIds.add(`${chatMessage.id}-ai`);
    };

    const handleAiAnimationProgress = () => {
        void scrollToBottom('auto');
    };

    const handleAiAnimationComplete = (messageId: string) => {
        animatedAiMessageIds.delete(messageId);
        void scrollToBottom('auto');
    };

    const loadConversation = async () => {
        submitError.value = '';

        if (isNewChatRoute.value) {
            uiMessages.value = [];
            return;
        }

        if (!activeChatId.value) {
            uiMessages.value = [];
            return;
        }

        await chatStore.fetchChatMessages(activeChatId.value);
        syncMessagesFromStore(activeChatId.value);
        await scrollToBottom('auto');
    };

    const handleMessageSubmit = async (payload: { text: string; file: File | null }) => {
        const optimisticText = payload.text || (payload.file ? `Файл: ${payload.file.name}` : '');

        if (!optimisticText) {
            return;
        }

        submitError.value = '';

        const optimisticMessage = createOptimisticMessage(optimisticText);
        const pendingAiMessage = createPendingAiMessage();
        uiMessages.value = [...uiMessages.value, optimisticMessage, pendingAiMessage];
        await scrollToBottom('auto');

        try {
            if (isNewChatRoute.value || !activeChatId.value) {
                const result = await chatStore.createChatWithFirstMessage({
                    message: payload.text,
                    file: payload.file,
                });

                if (!result.chat.id) {
                    throw new Error('Чат не был создан.');
                }

                if (result.message) {
                    rememberAnimatedAiMessage(result.message);
                    uiMessages.value = toUiMessages([result.message]);
                    await scrollToBottom('auto');
                }

                await router.replace(`/chat/${result.chat.id}`);
                await chatStore.fetchChats();
                return;
            }

            const createdMessage = await chatStore.createChatMessage({
                chatId: activeChatId.value,
                text: payload.text,
                file: payload.file,
            });

            rememberAnimatedAiMessage(createdMessage);
            uiMessages.value = [
                ...uiMessages.value.filter((item) => item.id !== optimisticMessage.id && item.id !== pendingAiMessage.id),
                ...toUiMessages([createdMessage]),
            ];

            await chatStore.fetchChats();
            await scrollToBottom('auto');
        }
        catch (error) {
            uiMessages.value = uiMessages.value.filter((item) => item.id !== optimisticMessage.id && item.id !== pendingAiMessage.id);
            message.value = payload.text;
            submitError.value = getAuthRequestErrorMessage(
                error,
                'Не удалось отправить сообщение. Попробуйте еще раз.',
            );
        }
    };

    watch(() => route.fullPath, async () => {
        await loadConversation();
    }, { immediate: true });

    onMounted(async () => {
        await measureComposerViewportOffset();

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', measureComposerViewportOffset);
            window.visualViewport?.addEventListener('resize', measureComposerViewportOffset);
        }

        if (typeof ResizeObserver !== 'undefined' && composerRef.value) {
            composerResizeObserver = new ResizeObserver(() => {
                void measureComposerViewportOffset();
            });
            composerResizeObserver.observe(composerRef.value);
        }

        if (!chatStore.chats.length) {
            await chatStore.fetchChats();
        }
    });

    onBeforeUnmount(() => {
        composerResizeObserver?.disconnect();

        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', measureComposerViewportOffset);
            window.visualViewport?.removeEventListener('resize', measureComposerViewportOffset);
        }
    });
</script>
