<template>
    <section class="head">
        <div class="container">
            <div class="head__content flex items-center h-screen justify-center flex-col">
                <p class="mt-[16px] text-[14px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">LEGALGUARD AI</p>
                <h1 class="head__title title !mt-[10px] !text-[32px] md:!text-[78px] !leading-[32px] md:!leading-[72px] !text-center">Юридическая точность, доведённая до идеала.</h1>
                <p class="text md:!text-[24px] max-w-[700px] text-center !mt-[30px]">Премиальное пространство для современной юридической работы - ясность и структура в каждом процессе.</p>
                <div class="head__button-container flex gap-[30px] !mt-[30px]">
                    <Button
                        text="Попробовать консультацию"
                        color="brown"
                        padding="10px_20px"
                        paddingMd="20px_50px"
                        @click="goToChat"
                    />
                    <!-- <Button 
                        text="Перейти к шаблонам" 
                        color="gray" 
                        padding="10px_20px"
                        paddingMd="20px_50px"
                    /> -->
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">

    import Button from '@/shared/ui/Button.vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const goToChat = () => {
        router.push('/chat/new-chat')
    }

</script>