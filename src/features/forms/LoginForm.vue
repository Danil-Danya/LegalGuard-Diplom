<template>
    <div class="login__form flex w-full flex-col rounded-[8px] bg-white !p-[30px] shadow-[0_24px_64px_rgba(45,51,56,0.08)] max-sm:!p-6 max-xs:!p-4">
        <div class="login__form-top flex flex-col items-center justify-center text-center">
            <img src="@/assets/images/logo/logo.png" alt="logo" class="login__logo w-[64px] max-sm:w-[56px] max-xs:w-[48px]">
            <h3 class="title max-sm:!text-[30px] max-sm:!leading-[34px] max-xs:!text-[26px] max-xs:!leading-[30px]">LegalGuard AI</h3>
            <p class="text text-accent !mt-[10px] max-w-[460px] text-center max-sm:text-[14px] max-sm:leading-[20px]">ВАШ ЛИЧНЫЙ ИИ ПОМОЩНИК В ЮРИДИЧЕСКИХ СФЕРАХ</p>
        </div>
        <div class="login__form-body !mt-[30px] max-sm:!mt-6">
            <form class="login__form-form flex flex-col gap-[20px]">
                <div class="login__form-input-container">
                    <Input label="Ваша почта" placeholder="example@mail.com" />
                </div>


                <div class="login__form-input-container">
                    <Input label="Ваш пароль" placeholder="********" class="min-w-0" />
                </div>


                <div class="login__form-button-container flex justify-center">
                    <Button class="max-xs:w-full" text="Войти" color="brown" />
                </div>
            </form>
        </div>
        <div class="login__form-end mt-6 flex justify-center">
            <p class="text-center text-[14px] leading-[20px] text-[var(--color-text-secondary)] max-xs:text-[13px]">
                У вас нет учетной записи? Тогда вы можете 
                <Link path="/registration" text="Зарегистрироваться"></Link>
                в нашей системе
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
    import Link from '@/shared/ui/Link.vue';
    import Input from '@/shared/ui/Input.vue';
    import Button from '@/shared/ui/Button.vue';
</script>
