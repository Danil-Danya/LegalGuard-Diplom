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
                to="/chat/new"
                class="inline-flex !p-[14px] w-full items-center justify-center gap-[10px] rounded-[10px] bg-[var(--color-primary)] px-[16px] py-[14px] !text-white transition-colors duration-300 hover:bg-[var(--color-primary-80)]"
            >
                <NewChatIcon class="shrink-0" />
                <span class="text-[16px] font-semibold leading-none !text-white">Создать чат</span>
            </RouterLink>
        </div>

        <div class="!mt-[34px] min-h-0 flex-1 overflow-y-auto pr-[4px]">
            <div
                v-for="group in chatGroups"
                :key="group.label"
                class="sidebar__chat-group"
                :class="{ '!mt-[20px]': group.label !== chatGroups[0].label }"
            >
                <p class="px-[6px] text-[16px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                    {{ group.label }}
                </p>

                <div class="!mt-[18px] flex flex-col gap-[4px]">
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

    import { computed } from 'vue';
    import { useRoute } from 'vue-router';

    import AccountSettingsIcon from '@/shared/icons/chat/AccountSettings.vue';
    import MainMenuIcon from '@/shared/icons/chat/MainMenu.vue';
    import NewChatIcon from '@/shared/icons/chat/NewChat.vue';

    const route = useRoute();

    const chatGroups = [
        {
            label: 'Сегодня',
            items: [
                {
                    id: 'new',
                    title: 'Новый чат',
                    to: '/chat/new',
                },
                {
                    id: 'contract-review',
                    title: 'Проверка договора на риски',
                    to: '/chat/contract-review',
                },
                {
                    id: 'nda-analysis',
                    title: 'Разбор NDA с подрядчиком',
                    to: '/chat/nda-analysis',
                },
            ],
        },
        {
            label: 'Ранее',
            items: [
                {
                    id: 'claim-draft',
                    title: 'Черновик претензии поставщику',
                    to: '/chat/claim-draft',
                },
                {
                    id: 'employment-check',
                    title: 'Проверка трудового договора',
                    to: '/chat/employment-check',
                },
                {
                    id: 'contract-summary',
                    title: 'Краткое резюме соглашения',
                    to: '/chat/contract-summary',
                },
            ],
        },
    ] as const;

    const activeChatId = computed(() => {
        const { chat_id } = route.params;
        return Array.isArray(chat_id) ? chat_id[0] : chat_id;
    });

</script>
