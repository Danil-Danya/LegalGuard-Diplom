<template>
    <header class="header border-b border-[var(--color-border)] bg-white !p-[10px_0]">
        <section class="navbar">
            <div class="container">
                <div class="navbar__content mx-auto flex w-full max-w-[1440px] items-center gap-[28px] py-[16px] max-lg:gap-[20px] max-sm:py-[14px]">
                    <div class="navbar__left shrink-0">
                        <RouterLink to="/" class="flex items-center gap-[14px] text-[var(--color-text-primary)]">
                            <span class="flex h-[48px] w-[48px] items-center justify-center rounded-[14px] bg-[var(--color-primary-10)] p-[8px]">
                                <img src="@/assets/images/logo/logo.png" alt="Logo" class="navbar__logo w-full">
                            </span>
                            <p class="text-[24px] font-semibold tracking-[-0.03em] max-lg:text-[22px]">LEGALGUARD AI</p>
                        </RouterLink>
                    </div>

                    <div class="navbar__center flex min-w-0 flex-1 justify-center max-md:hidden">
                        <nav class="navbar__nav h-full">
                            <ul class="flex h-full items-center gap-[36px]">
                                <li v-for="link in links" :key="`${link.path}-${link.text}`">
                                    <RouterLink :to="link.path" class="text-[16px] font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]">
                                        {{ link.text }}
                                    </RouterLink>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    <div class="navbar__right ml-auto flex shrink-0 items-center gap-[8px]">
                        <RouterLink to="/" class="flex h-[40px] w-[40px] items-center justify-center rounded-[12px] text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-hover-10)]">
                            <Notifications />
                        </RouterLink>

                        <RouterLink to="/" class="flex h-[40px] w-[40px] items-center justify-center rounded-[12px] text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-hover-10)] max-sm:hidden">
                            <Settings />
                        </RouterLink>

                        <RouterLink
                            v-if="isAuthenticated"
                            to="/profile/create"
                            class="flex items-center gap-[10px] rounded-[14px] bg-[var(--color-surface)] px-[10px] py-[6px] transition-colors hover:bg-[var(--color-primary-10)]"
                        >
                            <span class="inline-flex h-[42px] w-[42px] items-center justify-center overflow-hidden rounded-full border border-[var(--color-border)] bg-white text-[14px] font-semibold text-[var(--color-primary)]">
                                <img
                                    v-if="avatarUrl"
                                    :src="avatarUrl"
                                    alt="Аватар пользователя"
                                    class="h-full w-full object-cover"
                                >
                                <span v-else>{{ userInitials }}</span>
                            </span>

                            <span class="hidden max-w-[140px] truncate text-[15px] font-medium text-[var(--color-text-primary)] sm:inline">
                                {{ displayUserName }}
                            </span>
                        </RouterLink>

                        <RouterLink v-else to="/login">
                            <Button class="text-[15px] !p-[5px_18px] block font-medium" color="gray" text="Войти" padding="10px_18px" />
                        </RouterLink>
                    </div>
                </div>
            </div>
        </section>
    </header>
</template>

<script lang="ts" setup>
    import { computed, onMounted, ref } from 'vue';

    import { getStoredCurrentUser } from '@/entities/users/api/auth';
    import { useUserStore } from '@/entities/users/models/store';

    import Notifications from '../icons/navbar/Notifications.vue';
    import Settings from '../icons/navbar/Settings.vue';
    import Button from '../ui/Button.vue';

    interface HeaderProfileShape {
        firstName?: string;
        lastName?: string;
        avatarPath?: string | null;
        profile?: {
            firstName?: string;
            lastName?: string;
            avatarPath?: string | null;
        };
    }

    const links = ref([
        {
            path: '/chat/new-chat',
            text: 'Чат консультации',
        },
        {
            path: '/contracts/templates',
            text: 'Шаблоны договоров',
        },
        {
            path: '/company/counterparty-check',
            text: 'Проверка компании',
        },
    ]);

    const userStore = useUserStore();
    const accessToken = ref('');
    const storedUserEmail = ref('');
    const staticUrl = import.meta.env.VITE_APP_STATIC_URL;

    const profile = computed(() => {
        return userStore.myProfile as HeaderProfileShape;
    });

    const normalizeText = (value?: string | null) => {
        return typeof value === 'string' ? value.trim() : '';
    };

    const displayUserName = computed(() => {
        const firstName = normalizeText(profile.value?.firstName) || normalizeText(profile.value?.profile?.firstName);
        const lastName = normalizeText(profile.value?.lastName) || normalizeText(profile.value?.profile?.lastName);
        const fullName = [firstName, lastName].filter(Boolean).join(' ');

        return fullName || storedUserEmail.value || 'Аккаунт';
    });

    const userInitials = computed(() => {
        const parts = displayUserName.value
            .split(/\s+/)
            .map((item) => item.trim())
            .filter(Boolean)
            .slice(0, 2);

        if (!parts.length) {
            return 'LG';
        }

        return parts
            .map((item) => item[0]?.toUpperCase() || '')
            .join('');
    });

    const avatarUrl = computed(() => {
        const avatarPath = normalizeText(profile.value?.avatarPath) || normalizeText(profile.value?.profile?.avatarPath);

        if (!avatarPath || !staticUrl) {
            return '';
        }

        const normalizedBase = staticUrl.replace(/\/+$/, '');
        const normalizedPath = avatarPath.replace(/^\/+/, '');

        return `${normalizedBase}/${normalizedPath}`;
    });

    const isAuthenticated = computed(() => {
        return Boolean(accessToken.value);
    });

    onMounted(() => {
        if (typeof window === 'undefined') {
            return;
        }

        accessToken.value = window.localStorage.getItem('accessToken') || '';
        storedUserEmail.value = getStoredCurrentUser()?.email || '';
    });
</script>
