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
                        <RouterLink to="/login">
                            <Button class="text-[15px] font-medium" color="gray" text="Войти" padding="10px_18px" />
                        </RouterLink>
                    </div>
                </div>
            </div>
        </section>
    </header>
</template>

<script lang="ts" setup>

    import { ref } from 'vue';

    import Notifications from '../icons/navbar/Notifications.vue';
    import Settings from '../icons/navbar/Settings.vue';
    import Button from '../ui/Button.vue';

    const links = ref([
        {
            path: '/',
            text: 'Чат консультации'
        },

        {
            path: '/',
            text: 'Шаблоны договоров'
        },

        {
            path: '/',
            text: 'Проверка компании'
        },
    ])

</script>
