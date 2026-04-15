<template>
    <div class="login__form flex w-full flex-col rounded-[8px] bg-white !p-[30px] shadow-[0_24px_64px_rgba(45,51,56,0.08)] max-sm:!p-6 max-xs:!p-4">
        <div class="login__form-top flex flex-col items-center justify-center text-center">
            <img src="@/assets/images/logo/logo.png" alt="logo" class="login__logo w-[64px] max-sm:w-[56px] max-xs:w-[48px]">
            <h3 class="title max-sm:!text-[30px] max-sm:!leading-[34px] max-xs:!text-[26px] max-xs:!leading-[30px]">Профиль</h3>
            <p class="text text-accent !mt-[10px] max-w-[520px] text-center max-sm:text-[14px] max-sm:leading-[20px]">
                Заполните профиль, чтобы завершить настройку аккаунта и перейти к работе в LegalGuard AI.
            </p>
        </div>

        <div class="login__form-body !mt-[30px] max-sm:!mt-6">
            <form class="login__form-form flex flex-col gap-[20px]" @submit.prevent="handleSubmit">
                <div class="login__form-input-container">
                    <FileUpload
                        v-model="form.avatar"
                        :error-text="fieldErrors.avatar"
                        label="Аватар"
                        placeholder="Аватар еще не загружен"
                        description="Поддерживаются PNG, JPG и WEBP. Аватар можно добавить сейчас или позже."
                    />
                </div>

                <div class="login__form-input-container flex gap-[20px] max-sm:flex-col">
                    <Input
                        v-model="form.firstName"
                        :error-text="fieldErrors.firstName"
                        label="Имя"
                        placeholder="Например Данил"
                        class="w-1/2 max-sm:w-full"
                    />
                    <Input
                        v-model="form.lastName"
                        :error-text="fieldErrors.lastName"
                        label="Фамилия"
                        placeholder="Например Сабитов"
                        class="w-1/2 max-sm:w-full"
                    />
                </div>

                <div class="login__form-input-container">
                    <Select
                        v-model="form.position"
                        :error-text="fieldErrors.position"
                        label="Позиция"
                        placeholder="Выберите позицию"
                        :options="positionOptions"
                    />
                </div>

                <div class="login__form-input-container">
                    <TextArea
                        v-model="form.biography"
                        :error-text="fieldErrors.biography"
                        label="Биография"
                        placeholder="Коротко расскажите о себе, опыте и специализации"
                        :rows="6"
                    />
                </div>

                <ErrorMessage v-if="submitError" :text="submitError" />

                <div class="login__form-button-container flex justify-center">
                    <Button
                        class="max-xs:w-full disabled:cursor-not-allowed disabled:opacity-60"
                        :disabled="isSubmitting"
                        :text="isSubmitting ? 'Сохранение...' : 'Сохранить профиль'"
                        color="brown"
                    />
                </div>
            </form>
        </div>

        <div class="login__form-end mt-6 flex justify-center">
            <p class="text-center text-[14px] leading-[20px] text-[var(--color-text-secondary)] max-xs:text-[13px]">
                Эти данные будут отображаться в вашем аккаунте и использоваться внутри LegalGuard AI.
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, reactive, ref, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router';

    import { getAuthRequestErrorMessage } from '@/entities/users/api/auth';
    import { createProfile } from '@/entities/users/api/profile';
    import { ProfilePosition, type ProfileFormState } from '@/entities/users/lib/types';
    import { resolveAuthRedirectPath } from '@/shared/lib/auth-gate';
    import Button from '@/shared/ui/Button.vue';
    import ErrorMessage from '@/shared/ui/ErrorMessage.vue';
    import FileUpload from '@/shared/ui/FileUpload.vue';
    import Input from '@/shared/ui/Input.vue';
    import Select from '@/shared/ui/Select.vue';
    import TextArea from '@/shared/ui/TextArea.vue';

    const router = useRouter();
    const route = useRoute();

    const isSubmitting = ref(false);
    const submitError = ref('');

    const form = reactive<ProfileFormState>({
        avatar: null,
        firstName: '',
        lastName: '',
        position: '',
        biography: '',
    });

    const fieldErrors = reactive({
        avatar: '',
        firstName: '',
        lastName: '',
        position: '',
        biography: '',
    });

    const redirectPath = computed(() => {
        const redirect = Array.isArray(route.query.redirect) ? route.query.redirect[0] : route.query.redirect;
        return resolveAuthRedirectPath(redirect, '/chat/new-chat');
    });

    watch(() => form.avatar, () => {
        fieldErrors.avatar = '';
        submitError.value = '';
    });

    watch(() => form.firstName, () => {
        fieldErrors.firstName = '';
        submitError.value = '';
    });

    watch(() => form.lastName, () => {
        fieldErrors.lastName = '';
        submitError.value = '';
    });

    watch(() => form.position, () => {
        fieldErrors.position = '';
        submitError.value = '';
    });

    watch(() => form.biography, () => {
        fieldErrors.biography = '';
        submitError.value = '';
    });

    const positionOptions = [
        {
            label: 'Юрист',
            value: ProfilePosition.LAWYER,
        },
        {
            label: 'Личный',
            value: ProfilePosition.INDIVIDUAL,
        },
        {
            label: 'Бизнес',
            value: ProfilePosition.BUSINESS_OWNER,
        },
    ];

    const validateForm = () => {
        fieldErrors.avatar = '';
        fieldErrors.firstName = '';
        fieldErrors.lastName = '';
        fieldErrors.position = '';
        fieldErrors.biography = '';

        if (!form.firstName.trim()) {
            fieldErrors.firstName = 'Введите имя.';
        }

        if (!form.lastName.trim()) {
            fieldErrors.lastName = 'Введите фамилию.';
        }

        if (!form.position) {
            fieldErrors.position = 'Выберите позицию.';
        }

        if (!form.biography.trim()) {
            fieldErrors.biography = 'Введите биографию.';
        }

        return !fieldErrors.firstName && !fieldErrors.lastName && !fieldErrors.position && !fieldErrors.biography;
    };

    const handleSubmit = async () => {
        submitError.value = '';

        if (!validateForm()) {
            return;
        }

        isSubmitting.value = true;

        try {
            await createProfile({
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                position: form.position as ProfilePosition,
                biography: form.biography.trim(),
                avatar: form.avatar,
            });

            await router.push(redirectPath.value);
        }
        catch (error) {
            submitError.value = getAuthRequestErrorMessage(
                error,
                'Не удалось сохранить профиль. Попробуйте еще раз.',
            );
        }
        finally {
            isSubmitting.value = false;
        }
    };
</script>
