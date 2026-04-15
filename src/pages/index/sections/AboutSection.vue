<template>
    <section class="about bg-white">
        <div class="container">
            <div class="about__content flex justify-around gap-[50px] md:!p-[100px_0] !p-[50px_0] flex-wrap">
                <div class="about__left">
                    <img src="@/assets/images/site/about.jpg" alt="Картинка" class="md:!max-w-[750px] md:max-h-[700px] w-full">
                </div>
                <div class="about__right flex flex-col justify-center">
                    <div class="about__right-top">
                        <h2 class="title about__title md:!text-[48px]">Миссия и подход</h2>
                        <span class="line w-[100px] h-[5px] bg-accent block !mt-[10px]"></span>
                    </div>
                    <div class="about__right-center max-w-[750px] md:!mt-[50px] !mt-[30px]">
                        <p class="text text-gray-500 md:text-[18px] text-[14px]">
                            LegalGuard AI — это инструмент для анализа и подготовки юридических документов, разработанный с учётом реальных задач бизнеса и частных пользователей. Наша цель — снизить количество юридических рисков за счёт автоматизации базовых проверок и повышения прозрачности условий договоров.
                        </p>
                        <p class="text text-gray-500 md:!text-[18px] !text-[14px] md:!mt-[30px] !mt-[10px]">
                            Система анализирует структуру документа, выявляет потенциально уязвимые или спорные положения и помогает быстрее ориентироваться в содержании. Это позволяет принимать решения на основе фактов, а не предположений, и экономить время на первичном разборе.
                        </p>
                        <p class="text text-gray-500 text-[18px] md:!text-[18px] md:!mt-[30px] !text-[14px] !mt-[10px]">
                            LegalGuard AI не заменяет профессиональную юридическую экспертизу, но значительно упрощает работу с документами и снижает вероятность типовых ошибок.
                        </p>
                    </div>
                    <div class="about__right-bottom !mt-[30px]">
                        <ul class="about__right-list flex gap-[30px]">
                            <li v-for="stat in stats" :key="stat.value" class="max-w-[300px]">
                                <h3 class="title about__right-subtitle !text-[32px] !text-primary">{{ stat.value }}</h3>
                                <p class="text md:!text-[16px] text-[14px]">{{ stat.label }}</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">

    import { ref } from 'vue';
    
    const stats = ref([
        {
            value: "70%",
            label: "Типовых ошибок выявляется автоматически"
        },
        {
            value: "92%",
            label: "Точность выявления рисков"
        },
    ]);

</script>
