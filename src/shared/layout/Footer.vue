<template>
    <footer class="footer border-t border-[var(--color-border)] bg-white">
        <div class="container">
            <div class="footer__content !p-[30px_0] mx-auto flex w-full max-w-[1440px] items-center gap-[28px] py-[18px] max-lg:flex-wrap max-lg:justify-between max-lg:gap-[20px] max-sm:py-[16px]">
                <div class="footer__left shrink-0 md:w-auto w-full">
                    <RouterLink to="/" class="flex w-full justify-center items-center md:gap-[14px] text-[var(--color-text-primary)]">
                        <span class="flex h-[48px] w-[48px] items-center justify-center rounded-[14px] bg-[var(--color-primary-10)] p-[8px]">
                            <img src="@/assets/images/logo/logo.png" alt="Logo" class="footer__logo w-full">
                        </span>
                        <p class="text-[24px] font-semibold tracking-[-0.03em] max-lg:text-[22px]">LEGALGUARD AI</p>
                    </RouterLink>
                </div>
                <div class="footer__center min-w-0 flex-1 max-lg:order-3 max-lg:basis-full">
                    <p class="text-center text-[15px] leading-[1.5] text-[var(--color-text-secondary)]">
                        Проект разработал студент университета KIUT (ISE74R) Сабитов Данил Владиславович в 2025 г.
                    </p>
                </div>
                <div class="footer__right ml-auto flex shrink-0 items-center max-lg:ml-0 max-md:basis-full max-md:justify-center">
                    <nav class="footer__nav">
                        <ul class="flex items-center gap-[28px] max-md:flex-wrap max-md:justify-center max-md:gap-x-[20px] max-md:gap-y-[10px]">
                            <li v-for="link in links" :key="`${link.path}-${link.text}`">
                                <a :href="link.path" class="text-[15px] font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]">
                                    {{ link.text }}
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </footer>
</template>

<script lang="ts" setup>

    import { ref } from 'vue';

    const links = ref([
        {
            path: '/',
            text: 'Политика и конфеденциальность'
        },

        {
            path: 'tel:+998908709948',
            text: 'Телефон'
        },

        {
            path: 'https://www.instagram.com/dani.elweb',
            text: 'Портфолио'
        },
    ])

</script>
