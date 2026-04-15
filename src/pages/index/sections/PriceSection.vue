<template>
    <section class="prices">
        <div class="container">
            <div class="prices__content md:!p-[100px_0] !p-[50px_0]">
                <div class="prices__top mb-[40px]">
                    <h2 class="title text-center">Тарифы и партнерство</h2>
                    <p class="text text-center text-primary">
                        Прозрачное ценообразование для любых юридических задач
                    </p>
                </div>

                <div class="grid grid-cols-1 gap-[20px] md:grid-cols-3 !mt-[30px]">
                    <div
                        v-for="plan in plans"
                        :key="plan.name"
                        class="rounded-[10px] border border-border bg-surface !p-[24px] flex flex-col justify-between relative transition-all"
                        :class="plan.isPopular ? 'shadow-lg scale-[1.02]' : ''"
                    >
                        <div>
                            <div
                                v-if="plan.isPopular"
                                class="absolute top-[12px] !p-[5px_10px] right-[12px] bg-primary text-white text-[12px] px-[10px] py-[4px] rounded-[5px]"
                            >
                                популярный
                            </div>

                            <h3 class="text-[20px] font-semibold mb-[10px] text-text-primary">
                                {{ plan.name }}
                            </h3>

                            <div class="mb-[12px]">
                                <span class="text-[32px] font-bold text-primary">
                                    ${{ plan.price }}
                                </span>
                                <span class="text-text-secondary">
                                    /{{ plan.period }}
                                </span>
                            </div>

                            <p class="text-[14px] text-text-secondary mb-[16px]">
                                {{ plan.description }}
                            </p>

                            <ul class="flex flex-col gap-[8px] mb-[20px] !mt-[20px]">
                                <li
                                    v-for="feature in plan.features"
                                    :key="feature"
                                    class="text-[14px] text-text-primary flex items-start gap-[8px]"
                                >
                                    <span class="text-primary">✔</span>
                                    {{ feature }}
                                </li>
                            </ul>
                        </div>

                        <button
                            class="w-full rounded-[10px] py-[10px] !p-[10px] !mt-[20px] text-[14px] transition-all"
                            :class="plan.isPopular
                                ? 'bg-primary text-white hover:bg-primary-80'
                                : 'border border-primary text-primary hover:bg-primary-10'"
                        >
                            {{ plan.buttonText }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">

    import { ref } from 'vue';

    const plans = ref([
        {
            name: "Базовый",
            price: 30,
            period: "мес",
            isPopular: false,
            description: "Подходит для личного использования и редкой работы с договорами. Позволяет быстро проверить документ и выявить очевидные риски.",
            features: [
                "50 запросов в месяц",
                "Базовая языковая модель gpt-4.1 mini",
                "Стандартная поддержка",
                "Анализ простых договоров"
            ],
            buttonText: "Выбрать Базовый"
        },
        {
            name: "Профи",
            price: 50,
            period: "мес",
            isPopular: true,
            description: "Оптимальный вариант для специалистов и малого бизнеса. Расширенные возможности анализа и работа с большим количеством документов.",
            features: [
                "500 запросов в месяц",
                "Продвинутая модель gpt-4.1",
                "История поиска 1 год",
                "Пакетная обработка файлов"
            ],
            buttonText: "Выбрать Профи"
        },
        {
            name: "Партнер",
            price: 100,
            period: "мес",
            isPopular: false,
            description: "Решение для компаний с постоянной нагрузкой и высокими требованиями к скорости и точности. Поддержка, масштабируемость и интеграция в существующие системы.",
            features: [
                "Безлимитные запросы",
                "Флагманская AI модель gpt-5.4 pro",
                "Приоритетная поддержка 24/7",
                "Интеграция по API"
            ],
            buttonText: "Связаться с нами"
        }
    ]);

</script>