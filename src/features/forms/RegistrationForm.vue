<template>
    <div class="login__form flex w-full flex-col rounded-[8px] bg-white !p-[30px] shadow-[0_24px_64px_rgba(45,51,56,0.08)] max-sm:!p-6 max-xs:!p-4">
        <div class="login__form-top flex flex-col items-center justify-center text-center">
            <img src="@/assets/images/logo/logo.png" alt="logo" class="login__logo w-[64px] max-sm:w-[56px] max-xs:w-[48px]">
            <h3 class="title max-sm:!text-[30px] max-sm:!leading-[34px] max-xs:!text-[26px] max-xs:!leading-[30px]">LegalGuard AI</h3>
            <p class="text text-accent !mt-[10px] max-w-[520px] text-center max-sm:text-[14px] max-sm:leading-[20px]">
                Создайте аккаунт, чтобы перейти к заполнению профиля и работе с системой.
            </p>
        </div>

        <div class="login__form-body !mt-[30px] max-sm:!mt-6">
            <form class="login__form-form flex flex-col gap-[20px]" @submit.prevent="handleSubmit">
                <div class="login__form-input-container">
                    <Input
                        v-model="form.email"
                        :error-text="fieldErrors.email"
                        label="Ваша почта"
                        placeholder="example@mail.com"
                        type="email"
                    />
                </div>

                <div class="login__form-input-container flex gap-[20px] max-sm:flex-col">
                    <Input
                        v-model="form.password"
                        :error-text="fieldErrors.password"
                        label="Ваш пароль"
                        placeholder="********"
                        type="password"
                        class="w-1/2 max-sm:w-full"
                    />
                    <Input
                        v-model="form.confirmPassword"
                        :error-text="fieldErrors.confirmPassword"
                        label="Повторите пароль"
                        placeholder="********"
                        type="password"
                        class="w-1/2 max-sm:w-full"
                    />
                </div>

                <ErrorMessage v-if="submitError" :text="submitError" />

                <div class="login__form-button-container flex justify-center">
                    <Button
                        class="max-xs:w-full disabled:cursor-not-allowed disabled:opacity-60"
                        :disabled="isSubmitting"
                        :text="isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'"
                        color="brown"
                    />
                </div>
            </form>
        </div>

        <div class="login__form-end mt-6 flex justify-center">
            <p class="text-center text-[14px] leading-[20px] text-[var(--color-text-secondary)] max-xs:text-[13px]">
                У вас уже есть учетная запись?
                <Link :path="loginPath" text="Войти" />
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, reactive, ref, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router';

    import {
        DEFAULT_REGISTRATION_ROLE_ID,
        getAuthRequestErrorMessage,
        registerUser,
        storeAuthSession,
    } from '@/entities/users/api/auth';
    import { resolveAuthRedirectPath } from '@/shared/lib/auth-gate';
    import Button from '@/shared/ui/Button.vue';
    import ErrorMessage from '@/shared/ui/ErrorMessage.vue';
    import Input from '@/shared/ui/Input.vue';
    import Link from '@/shared/ui/Link.vue';

    const router = useRouter();
    const route = useRoute();

    const isSubmitting = ref(false);
    const submitError = ref('');

    const form = reactive({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const fieldErrors = reactive({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const redirectPath = computed(() => {
        const redirect = Array.isArray(route.query.redirect) ? route.query.redirect[0] : route.query.redirect;
        return resolveAuthRedirectPath(redirect, '/chat/new-chat');
    });

    const loginPath = computed(() => {
        return `/login?redirect=${encodeURIComponent(redirectPath.value)}`;
    });

    watch(() => form.email, () => {
        fieldErrors.email = '';
        submitError.value = '';
    });

    watch(() => form.password, () => {
        fieldErrors.password = '';
        submitError.value = '';
    });

    watch(() => form.confirmPassword, () => {
        fieldErrors.confirmPassword = '';
        submitError.value = '';
    });

    const validateForm = () => {
        fieldErrors.email = '';
        fieldErrors.password = '';
        fieldErrors.confirmPassword = '';

        if (!form.email.trim()) {
            fieldErrors.email = 'Введите email.';
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            fieldErrors.email = 'Введите корректный email.';
        }

        if (!form.password) {
            fieldErrors.password = 'Введите пароль.';
        }
        else if (form.password.length < 8) {
            fieldErrors.password = 'Пароль должен содержать минимум 8 символов.';
        }

        if (!form.confirmPassword) {
            fieldErrors.confirmPassword = 'Повторите пароль.';
        }
        else if (form.password !== form.confirmPassword) {
            fieldErrors.confirmPassword = 'Пароли не совпадают.';
        }

        return !fieldErrors.email && !fieldErrors.password && !fieldErrors.confirmPassword;
    };

    const handleSubmit = async () => {
        submitError.value = '';

        if (!validateForm()) {
            return;
        }

        isSubmitting.value = true;

        try {
            const registrationResponse = await registerUser({
                email: form.email.trim(),
                password: form.password,
                roleId: DEFAULT_REGISTRATION_ROLE_ID,
            });

            storeAuthSession(registrationResponse, registrationResponse.createdUser);
            await router.push({
                path: '/profile/create',
                query: {
                    redirect: redirectPath.value,
                },
            });
        }
        catch (error) {
            submitError.value = getAuthRequestErrorMessage(
                error,
                'Не удалось зарегистрироваться. Попробуйте еще раз.',
            );
        }
        finally {
            isSubmitting.value = false;
        }
    };
</script>
