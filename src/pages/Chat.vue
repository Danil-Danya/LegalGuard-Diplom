<template>
    <section class="!pb-[120px] chat flex-col flex flex-1 items-center justify-center px-[32px] py-[32px] max-md:px-[20px] max-md:py-[20px]">
        <div class="chat__container !mt-[70px]">
            <div class="container">
                <h2 class="title max-w-[920px] text-center">Опишите ситуацию или загрузите договор — мы выявим риски, объясним последствия и предложим безопасное решение.</h2>
            </div>
        </div>
        <div class="w-full max-w-[920px] !mt-[70px]">
            <div class="chat__block" v-for="(chatMessage, index) in messages" :key="`${chatMessage.role}-${index}`">
                <ChatMessageAi :text="chatMessage.text" v-if="chatMessage.role === 'ai'" />
                <ChatMessageUser :text="chatMessage.text" v-else />
            </div>
        </div>
        <div class="w-full max-w-[920px] fixed bottom-[50px]">
            <ChatInput v-model="message" placeholder="Опишите задачу или вставьте текст документа..." />
        </div>
    </section>
</template>

<script setup lang="ts">
    import { ref } from 'vue';

    import ChatInput from '@/shared/ui/ChatInput.vue';

    import ChatMessageAi from '@/shared/widgets/ChatMessageAi.vue';
    import ChatMessageUser from '@/shared/widgets/ChatMessageUser.vue';

    const message = ref('');

    const messages = ref([
        {
            text: 'Я хочу подписать договор аренды офиса, можешь проверить риски?',
            role: 'user'
        },
        {
            text: 'Конечно. Пришлите текст договора или его ключевые условия — я проверю юридические риски и потенциальные проблемы.',
            role: 'ai'
        },
        {
            text: 'Вот часть договора: "Арендатор обязан оплачивать все коммунальные расходы, включая капитальный ремонт здания."',
            role: 'user'
        },
        {
            text: '⚠️ Найден риск:\n\nФормулировка "включая капитальный ремонт" перекладывает на вас расходы, которые обычно несет арендодатель.\n\n📌 Рекомендация:\nИсключить капитальный ремонт из обязательств арендатора или четко ограничить перечень расходов.',
            role: 'ai'
        },
        {
            text: 'А если я подпишу так, что может быть?',
            role: 'user'
        },
        {
            text: '📉 Возможные последствия:\n\n— Неожиданные крупные расходы (ремонт фасада, крыши и т.д.)\n— Отсутствие лимита по сумме\n— Сложность оспаривания в суде\n\n📌 Итог: это высокий финансовый риск.',
            role: 'ai'
        },
        {
            text: 'Окей, а как правильно переписать этот пункт?',
            role: 'user'
        },
        {
            text: '✅ Безопасная формулировка:\n\n"Арендатор оплачивает коммунальные услуги, непосредственно связанные с использованием помещения. Расходы на капитальный ремонт несет арендодатель."\n\nЭто защищает вас от неожиданных затрат.',
            role: 'ai'
        },
        {
            text: 'Спасибо, еще вопрос — есть пункт про штраф 10% за просрочку, это нормально?',
            role: 'user'
        },
        {
            text: '⚠️ Средний риск:\n\nШтраф 10% за просрочку — это выше средней рыночной практики.\n\n📊 Обычно:\n— 0.1% – 0.5% за каждый день\nили\n— фиксированная пеня\n\n📌 Рекомендация:\nПопробуйте снизить процент или добавить ограничение по максимальной сумме штрафа.',
            role: 'ai'
        }
    ]);
</script>
