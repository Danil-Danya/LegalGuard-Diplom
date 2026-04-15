<template>
    <Transition name="auth-required-modal">
        <div
            v-if="isAuthRequiredModalOpen"
            class="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(17,24,39,0.42)] p-[16px]"
            @click.self="handleClose"
        >
            <div class="w-full !p-[30px] max-w-[460px] rounded-[22px] border border-[rgba(118,89,44,0.18)] bg-white p-[24px] shadow-[0_24px_80px_rgba(17,24,39,0.18)] max-sm:p-[18px]">
                <div class="flex items-start justify-between gap-[16px]">
                    <div>
                        <p class="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                            Требуется авторизация
                        </p>
                        <h2 class="!mt-[10px] !text-[28px] font-semibold leading-[1.02] tracking-[-0.03em] text-[var(--color-text-primary)] max-sm:!text-[24px]">
                            Войдите в аккаунт
                        </h2>
                    </div>

                    <button
                        type="button"
                        class="inline-flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[var(--color-border)] text-[22px] leading-none text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                        aria-label="Закрыть"
                        @click="handleClose"
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </div>

                <p class="!mt-[14px] text-[15px] leading-[24px] text-[var(--color-text-secondary)]">
                    Чтобы открыть {{ requestedLabel }}, нужно зарегистрироваться или войти в существующий аккаунт.
                </p>

                <div class="!mt-[22px] grid gap-[10px] sm:grid-cols-2">
                    <button
                        type="button"
                        class="inline-flex min-h-[48px] items-center justify-center rounded-[14px] bg-[var(--color-primary)] px-[18px] text-[15px] font-semibold text-white transition-colors hover:bg-accent"
                        @click="handleGoToLogin"
                    >
                        Войти
                    </button>

                    <button
                        type="button"
                        class="inline-flex min-h-[48px] items-center justify-center rounded-[14px] border border-[var(--color-primary-30)] bg-white px-[18px] text-[15px] font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-10)]"
                        @click="handleGoToRegistration"
                    >
                        Регистрация
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
    import { computed, watch } from 'vue';
    import { useRouter } from 'vue-router';

    import { closeAuthRequiredModal, useAuthGate } from '@/shared/lib/auth-gate';

    const router = useRouter();
    const authGate = useAuthGate();

    const isAuthRequiredModalOpen = computed(() => authGate.isAuthRequiredModalOpen.value);
    const requestedPath = computed(() => authGate.requestedPath.value);
    const requestedLabel = computed(() => authGate.requestedLabel.value);

    const handleClose = () => {
        closeAuthRequiredModal();
    };

    const handleGoToLogin = async () => {
        closeAuthRequiredModal();
        await router.push({
            path: '/login',
            query: {
                redirect: requestedPath.value,
            },
        });
    };

    const handleGoToRegistration = async () => {
        closeAuthRequiredModal();
        await router.push({
            path: '/registration',
            query: {
                redirect: requestedPath.value,
            },
        });
    };

    watch(isAuthRequiredModalOpen, (isOpen) => {
        if (typeof document === 'undefined') {
            return;
        }

        document.body.style.overflow = isOpen ? 'hidden' : '';
    }, { immediate: true });
</script>

<style scoped>
    .auth-required-modal-enter-active,
    .auth-required-modal-leave-active {
        transition: opacity 220ms ease, transform 220ms ease;
    }

    .auth-required-modal-enter-from,
    .auth-required-modal-leave-to {
        opacity: 0;
    }

    .auth-required-modal-enter-from > div,
    .auth-required-modal-leave-to > div {
        transform: translateY(18px);
    }

    .auth-required-modal-enter-active > div,
    .auth-required-modal-leave-active > div {
        transition: transform 220ms ease;
    }
</style>
