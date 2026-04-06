<template>
    <div class="login__form flex w-full flex-col rounded-[8px] bg-white !p-[30px] shadow-[0_24px_64px_rgba(45,51,56,0.08)] max-sm:!p-6 max-xs:!p-4">
        <div class="login__form-top flex flex-col items-center justify-center text-center">
            <img src="@/assets/images/logo/logo.png" alt="logo" class="login__logo w-[64px] max-sm:w-[56px] max-xs:w-[48px]">
            <h3 class="title max-sm:!text-[30px] max-sm:!leading-[34px] max-xs:!text-[26px] max-xs:!leading-[30px]">LegalGuard AI</h3>
            <p class="text text-accent !mt-[10px] max-w-[520px] text-center max-sm:text-[14px] max-sm:leading-[20px]">ВАШ ЛИЧНЫЙ ИИ ПОМОЩНИК В ЮРИДИЧЕСКИХ СФЕРАХ</p>
        </div>
        <div class="login__form-body !mt-[30px] max-sm:!mt-6">
            <form class="login__form-form flex flex-col gap-[20px]">
                <div class="login__form-input-container">
                    <Input label="Ваша почта" placeholder="example@mail.com" />
                </div>

                <div class="login__form-input-container flex gap-[20px] max-sm:flex-col">
                    <Input label="Ваше имя" placeholder="Например Данил" class="w-1/2 max-sm:w-full" />
                    <Input label="Ваша фамилия" placeholder="Например Сабитов" class="w-1/2 max-sm:w-full" />
                </div>

                <div class="login__form-input-container flex gap-[20px] max-sm:flex-col">
                    <Input label="Ваш пароль" placeholder="********" class="w-1/2 max-sm:w-full" />
                    <Input label="Повторите пароль" placeholder="********" class="w-1/2 max-sm:w-full" />
                </div>

                <div class="login__form-input-container">
                    <Select
                        label="Ваш рабочий статус"
                        placeholder="Выберите статус"
                        :options="workStatusOptions"
                    />
                </div>

                <div class="login__form-button-container flex justify-center">
                    <Button class="max-xs:w-full" text="Зарегистрироваться" color="brown" />
                </div>
            </form>
        </div>
        <div class="login__form-end mt-6 flex justify-center">
            <p class="text-center text-[14px] leading-[20px] text-[var(--color-text-secondary)] max-xs:text-[13px]">
                У вас уже есть учетная запись?
                <Link path="/login" text="Войти"></Link>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
    import Link from '@/shared/ui/Link.vue';
    import Input from '@/shared/ui/Input.vue';
    import Select from '@/shared/ui/Select.vue';
    import Button from '@/shared/ui/Button.vue';

    const workStatusOptions = [
        'Юрист',
        'Адвокат',
        'Нотариус',
        'Предприниматель',
        'Самозанятый',
        'Физ лицо',
        'Другое',
    ];
</script>
