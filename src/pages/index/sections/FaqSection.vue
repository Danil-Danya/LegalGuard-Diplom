<template>
    <section class="faq">
        <div class="container">
            <div class="faq__content py-[50px] md:py-[100px] flex flex-col items-center md:!pb-[100px] !pb-[50px]">
                <div class="faq__top mb-[24px] md:mb-[40px]">
                    <h2 class="title text-center">Часто задаваемые вопросы</h2>
                    <p class="text text-center text-primary">
                        Ответы на основные вопросы о работе LegalGuard AI
                    </p>
                </div>

                <div class="mx-auto flex !w-full flex-col items-center gap-[12px] !mt-[50px]">
                    <div
                        v-for="(item, index) in faq"
                        :key="item.question"
                        class="overflow-hidden rounded-[20px] !max-w-[950px] !w-full border !p-[30px] border-border bg-surface transition-all duration-300"
                        :class="openedIndex === index ? 'shadow-[0_20px_50px_rgba(45,51,56,0.08)]' : ''"
                    >
                        <button
                            type="button"
                            class="flex w-full items-center justify-between gap-[16px] px-[18px] py-[18px] text-left transition-all duration-300 md:px-[24px] md:py-[22px]"
                            @click="toggleFaq(index)"
                        >
                            <span
                                class="pr-[8px] text-[16px] leading-[150%] font-semibold text-text-primary md:text-[18px]"
                            >
                                {{ item.question }}
                            </span>

                            <span
                                class="flex h-[40px] min-h-[40px] w-[40px] min-w-[40px] items-center justify-center rounded-full border border-primary-20 bg-primary-10 transition-all duration-300"
                                :class="openedIndex === index ? 'rotate-180 bg-primary text-white border-primary' : ''"
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="transition-all duration-300"
                                >
                                    <path
                                        d="M6 9L12 15L18 9"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </span>
                        </button>

                        <Transition
                            enter-active-class="transition-all duration-300 ease-out"
                            enter-from-class="max-h-0 opacity-0"
                            enter-to-class="max-h-[300px] opacity-100"
                            leave-active-class="transition-all duration-300 ease-in"
                            leave-from-class="max-h-[300px] opacity-100"
                            leave-to-class="max-h-0 opacity-0"
                        >
                            <div
                                v-show="openedIndex === index"
                                class="overflow-hidden"
                            >
                                <div class="px-[18px] pb-[18px] md:px-[24px] md:pb-[24px]">
                                    <div class="mb-[14px] h-[1px] w-full bg-border !m-[10px_0]"></div>
                                    <p class="text-[14px] leading-[170%] text-text-secondary md:text-[16px]">
                                        {{ item.answer }}
                                    </p>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { ref } from 'vue';

    const openedIndex = ref<number | null>(0);

    const faq = ref([
        {
            question: "Насколько точен анализ документов?",
            answer: "LegalGuard AI использует обученные модели для выявления рисков и анализа структуры договора. В большинстве типовых случаев сервис помогает выявить ключевые проблемные места и упростить понимание условий."
        },
        {
            question: "Заменяет ли сервис юриста?",
            answer: "Нет. LegalGuard AI не заменяет юриста, а помогает быстрее разобраться в документе и снизить вероятность ошибок. Для сложных случаев рекомендуется дополнительная проверка."
        },
        {
            question: "Какие документы можно анализировать?",
            answer: "Сервис работает с договорами, соглашениями, офертами, актами и другими юридическими текстами. Чем структурированнее документ, тем точнее результат."
        },
        {
            question: "Безопасны ли мои данные?",
            answer: "Мы уделяем внимание защите данных. Документы обрабатываются с соблюдением стандартов безопасности и не используются без вашего согласия."
        },
        {
            question: "Нужно ли что-то устанавливать?",
            answer: "Нет, сервис доступен без сложной установки. Вы можете начать работу сразу после регистрации."
        },
        {
            question: "Подходит ли сервис для бизнеса?",
            answer: "Да, LegalGuard AI подходит как для частных пользователей, так и для компаний, которым важно быстро проверять документы и снижать юридические риски."
        }
    ]);

    const toggleFaq = (index: number): void => {
        if (openedIndex.value === index) {
            openedIndex.value = null;
        }
        else {
            openedIndex.value = index;
        }
    };
</script>