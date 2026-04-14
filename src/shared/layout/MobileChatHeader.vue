<template>
    <header class="sticky top-0 z-30 gap-[12px] !p-[10px_0] border-b border-[var(--color-border)] bg-[linear-gradient(180deg,#F6F8FA_0%,#EEF1F5_100%)] px-[15px] py-[12px] md:hidden">
        <div class="container">
            <div class="header__content flex items-center justify-between">
                <RouterLink to="/chat/new-chat" class="flex min-w-0 items-center gap-[10px] overflow-hidden text-[var(--color-text-primary)]">
                    <span class="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[12px] border border-[var(--color-border)] bg-white p-[6px]">
                        <img src="@/assets/images/logo/logo.png" alt="Logo" class="w-full object-contain">
                    </span>
                    <span class="truncate text-[16px] font-semibold tracking-[-0.03em]">LEGALGUARD AI</span>
                </RouterLink>
                <div class="flex shrink-0 items-center gap-[8px]">
                    <RouterLink
                        to="/chat/settings"
                        class="inline-flex h-[40px] w-[40px] items-center justify-center rounded-[12px] border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                        :class="{ 'text-[var(--color-primary)]': route.path === '/chat/settings' }"
                        aria-label="Настройки"
                        >
                        <SettingsIcon />
                    </RouterLink>
                    <button
                        type="button"
                        class="inline-flex h-[40px] w-[40px] items-center justify-center rounded-[12px] border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                        aria-label="Открыть меню чатов"
                        @click="emit('menu-click')"
                    >
                        <BurgerMenuIcon />
                    </button>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
    import { useRoute } from 'vue-router';

    import BurgerMenuIcon from '@/shared/icons/chat/BurgerMenu.vue';
    import SettingsIcon from '@/shared/icons/navbar/Settings.vue';

    const emit = defineEmits<{
        'menu-click': [];
    }>();

    const route = useRoute();
</script>
