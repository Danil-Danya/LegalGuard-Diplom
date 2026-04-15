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
                    <button
                        type="button"
                        class="relative inline-flex h-[40px] w-[40px] items-center justify-center rounded-[12px] border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                        aria-label="Уведомления"
                        title="Уведомления"
                    >
                        <NotificationsIcon />
                        <span class="absolute right-[9px] top-[9px] h-[7px] w-[7px] rounded-full bg-[#E37B48]" />
                    </button>

                    <RouterLink
                        to="/profile/create"
                        class="inline-flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-[12px] border border-[var(--color-border)] bg-white text-[var(--color-primary)] transition-colors hover:border-[var(--color-primary-30)] hover:bg-[var(--color-primary-10)]"
                        aria-label="Профиль"
                    >
                        <img
                            v-if="avatarUrl"
                            :src="avatarUrl"
                            alt="Аватар пользователя"
                            class="h-full w-full object-cover"
                        >
                        <span v-else class="text-[12px] font-semibold">{{ userInitials }}</span>
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
    import { computed } from 'vue';

    import { getStoredCurrentUser } from '@/entities/users/api/auth';
    import {
        resolveUserAvatarUrl,
        resolveUserDisplayName,
        resolveUserInitials,
        type UserDisplayProfileShape,
    } from '@/entities/users/lib/display';
    import { useUserStore } from '@/entities/users/models/store';
    import BurgerMenuIcon from '@/shared/icons/chat/BurgerMenu.vue';
    import NotificationsIcon from '@/shared/icons/navbar/Notifications.vue';

    const emit = defineEmits<{
        'menu-click': [];
    }>();

    const userStore = useUserStore();
    const staticUrl = import.meta.env.VITE_APP_STATIC_URL || '';

    const profile = computed(() => {
        return userStore.myProfile as UserDisplayProfileShape;
    });

    const displayUserName = computed(() => {
        return resolveUserDisplayName(profile.value, getStoredCurrentUser()?.email || '');
    });

    const userInitials = computed(() => {
        return resolveUserInitials(displayUserName.value);
    });

    const avatarUrl = computed(() => {
        return resolveUserAvatarUrl(profile.value, staticUrl);
    });
</script>
