<template>
    <div class="login__form flex w-full flex-col rounded-[8px] bg-white !p-[30px] shadow-[0_24px_64px_rgba(45,51,56,0.08)] max-sm:!p-6 max-xs:!p-4">
        <div class="login__form-top flex flex-col items-center justify-center text-center">
            <img src="@/assets/images/logo/logo.png" alt="logo" class="login__logo w-[64px] max-sm:w-[56px] max-xs:w-[48px]">
            <h3 class="title max-sm:!text-[30px] max-sm:!leading-[34px] max-xs:!text-[26px] max-xs:!leading-[30px]">LegalGuard AI</h3>
            <p class="text text-accent !mt-[10px] max-w-[460px] text-center max-sm:text-[14px] max-sm:leading-[20px]">
                Войдите в аккаунт, чтобы продолжить работу с чатами и документами.
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

                <div class="login__form-input-container">
                    <Input
                        v-model="form.password"
                        :error-text="fieldErrors.password"
                        label="Ваш пароль"
                        placeholder="********"
                        type="password"
                        class="min-w-0"
                    />
                </div>

                <ErrorMessage v-if="submitError" :text="submitError" />

                <div class="login__form-button-container flex justify-center">
                    <Button
                        class="max-xs:w-full disabled:cursor-not-allowed disabled:opacity-60"
                        :disabled="isSubmitting"
                        :text="isSubmitting ? 'Вход...' : 'Войти'"
                        color="brown"
                    />
                </div>
            </form>
        </div>

        <div class="login__form-end mt-6 flex justify-center">
            <p class="text-center text-[14px] leading-[20px] text-[var(--color-text-secondary)] max-xs:text-[13px]">
                У вас нет учетной записи? Тогда вы можете
                <Link path="/registration" text="Зарегистрироваться" />
                в нашей системе
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { reactive, ref, watch } from 'vue';
    import { useRouter } from 'vue-router';

    import {
        getAuthRequestErrorMessage,
        loginUser,
        storeAuthSession,
    } from '@/entities/users/api/auth';
    import Button from '@/shared/ui/Button.vue';
    import ErrorMessage from '@/shared/ui/ErrorMessage.vue';
    import Input from '@/shared/ui/Input.vue';
    import Link from '@/shared/ui/Link.vue';

    const router = useRouter();

    const isSubmitting = ref(false);
    const submitError = ref('');

    const form = reactive({
        email: '',
        password: '',
    });

    const fieldErrors = reactive({
        email: '',
        password: '',
    });

    watch(() => form.email, () => {
        fieldErrors.email = '';
        submitError.value = '';
    });

    watch(() => form.password, () => {
        fieldErrors.password = '';
        submitError.value = '';
    });

    const validateForm = () => {
        fieldErrors.email = '';
        fieldErrors.password = '';

        if (!form.email.trim()) {
            fieldErrors.email = 'Введите email.';
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            fieldErrors.email = 'Введите корректный email.';
        }

        if (!form.password) {
            fieldErrors.password = 'Введите пароль.';
        }

        return !fieldErrors.email && !fieldErrors.password;
    };

    const handleSubmit = async () => {
        submitError.value = '';

        if (!validateForm()) {
            return;
        }

        isSubmitting.value = true;

        try {
            const loginResponse = await loginUser({
                email: form.email.trim(),
                password: form.password,
            });

            storeAuthSession(loginResponse);
            await router.push('/chat/new-chat');
        }
        catch (error) {
            submitError.value = getAuthRequestErrorMessage(
                error,
                'Не удалось выполнить вход. Проверьте email и пароль.',
            );
        }
        finally {
            isSubmitting.value = false;
        }
    };
</script>
