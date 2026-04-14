<template>
    <aside
        class="sidebar !p-[20px] flex h-[100vh] w-[20%] flex-col border border-[var(--color-border)] bg-[linear-gradient(180deg,#F8F9FB_0%,#EEF1F5_100%)]"
    >
        <div class="sidebar__logo flex items-center gap-[14px] !mb-[20px]">
            <img src="@/assets/images/logo/logo.png" alt="Logo" class="sidebar__logo-img h-[70px] w-[70px] rounded-[6px] border-[var(--color-border)] border-1">
            <div class="sidebar__logo-text-container">
                <h3 class="title !text-[24px] font-[800] leading-none text-[var(--color-text-primary)]">LEGALGUARD AI</h3>
                <p class="text mt-[6px] text-[14px] leading-[18px] text-[var(--color-text-secondary)]">Чат для консультации</p>
            </div>
        </div>

        <div class="sidebar__buttons-container !pt-[28px] mt-[28px] border-t border-[var(--color-border)]">
            <RouterLink
                to="/chat/new-chat"
                class="inline-flex !p-[14px] w-full items-center justify-center gap-[10px] rounded-[10px] bg-[var(--color-primary)] px-[16px] py-[14px] !text-white transition-colors duration-300 hover:bg-[var(--color-primary-80)]"
            >
                <NewChatIcon class="shrink-0" />
                <span class="text-[16px] font-semibold leading-none !text-white">Создать чат</span>
            </RouterLink>
        </div>

        <div class="!mt-[34px] min-h-0 flex-1 overflow-y-auto pr-[4px]">
            <div
                v-for="(group, index) in chatGroups"
                :key="group.label"
                class="sidebar__chat-group"
                :class="{ '!mt-[20px]': index > 0 }"
            >
                <p class="px-[6px] text-[16px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                    {{ group.label }}
                </p>

                <div class="!mt-[18px] flex flex-col gap-[4px]">
                    <RouterLink
                        v-if="showNewChatShortcut"
                        to="/chat/new-chat"
                        class="block !p-[10px_10px] rounded-[6px] px-[12px] py-[10px] text-[16px] leading-[18px] text-[var(--color-text-secondary)] transition-colors duration-200 hover:bg-white hover:text-[var(--color-text-primary)]"
                        :class="{ 'bg-white font-medium text-[var(--color-text-primary)]': route.name === 'chat-new' }"
                    >
                        <span class="block truncate">Новый чат</span>
                    </RouterLink>

                    <RouterLink
                        v-for="chat in group.items"
                        :key="chat.id"
                        :to="chat.to"
                        class="block !p-[10px_10px] rounded-[6px] px-[12px] py-[10px] text-[16px] leading-[18px] text-[var(--color-text-secondary)] transition-colors duration-200 hover:bg-white hover:text-[var(--color-text-primary)]"
                        :class="{
                            'bg-white font-medium text-[var(--color-text-primary)]': activeChatId === chat.id,
                        }"
                    >
                        <span class="block truncate">{{ chat.title }}</span>
                    </RouterLink>

                    <p
                        v-if="!group.items.length"
                        class="rounded-[8px] bg-white/75 px-[12px] py-[12px] text-[14px] leading-[20px] text-[var(--color-text-muted)]"
                    >
                        История чатов появится после первого запроса.
                    </p>
                </div>
            </div>
        </div>

        <div class="!mt-[20px] border-t border-[var(--color-border)] pt-[18px]">
            <div class="flex flex-col gap-[4px]">
                <RouterLink
                    to="/chat/settings"
                    class="inline-flex items-center !p-[10px] gap-[10px] rounded-[8px] px-[10px] py-[10px] text-[16px] font-medium text-[var(--color-text-secondary)] transition-colors duration-200 hover:bg-white hover:text-[var(--color-text-primary)]"
                    :class="{ 'bg-white text-[var(--color-text-primary)]': route.path === '/chat/settings' }"
                >
                    <AccountSettingsIcon class="shrink-0" />
                    <span>Настройки аккаунта</span>
                </RouterLink>

                <RouterLink
                    to="/"
                    class="inline-flex items-center !p-[10px] gap-[10px] rounded-[8px] px-[10px] py-[10px] text-[16px] font-medium text-[var(--color-text-secondary)] transition-colors duration-200 hover:bg-white hover:text-[var(--color-text-primary)]"
                >
                    <MainMenuIcon class="shrink-0" />
                    <span>В главное меню</span>
                </RouterLink>
            </div>
        </div>
    </aside>
</template>

<script lang="ts" setup>

    import { computed, onMounted } from 'vue';
    import { useRoute } from 'vue-router';

    import { useChatStore } from '@/entities/chats/models/store';
    import AccountSettingsIcon from '@/shared/icons/chat/AccountSettings.vue';
    import MainMenuIcon from '@/shared/icons/chat/MainMenu.vue';
    import NewChatIcon from '@/shared/icons/chat/NewChat.vue';

    const route = useRoute();
    const chatStore = useChatStore();

    onMounted(async () => {
        if (!chatStore.chats.length && !chatStore.isLoadingChats) {
            await chatStore.fetchChats();
        }
    });

    const activeChatId = computed(() => {
        const { chat_id } = route.params;
        return Array.isArray(chat_id) ? chat_id[0] : chat_id;
    });

    const showNewChatShortcut = computed(() => {
        return route.name === 'chat-new';
    });

    const chatGroups = computed(() => {
        return [
            {
                label: 'Чаты',
                items: chatStore.chats.map((chat) => ({
                    id: chat.id,
                    title: chat.title,
                    to: `/chat/${chat.id}`,
                })),
            },
        ];
    });

</script>
