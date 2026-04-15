<template>
    <nav class="grid grid-cols-3 gap-[8px] rounded-[20px] border border-[var(--color-border)] bg-white/92 p-[8px] shadow-[0_12px_28px_rgba(45,51,56,0.08)] backdrop-blur-[14px] md:hidden">
        <RouterLink
            v-for="item in items"
            :key="item.label"
            :to="item.to"
            class="flex min-h-[64px] flex-col items-center justify-center gap-[6px] rounded-[14px] px-[6px] py-[8px] text-center text-[var(--color-text-muted)] transition-colors duration-200"
            :class="item.active ? 'bg-[var(--color-primary-10)] text-[var(--color-primary)]' : 'hover:bg-[var(--color-hover-10)] hover:text-[var(--color-text-primary)]'"
        >
            <component :is="item.icon" class="shrink-0" />
            <span class="text-[10px] font-medium leading-[12px]">{{ item.label }}</span>
        </RouterLink>
    </nav>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { useRoute } from 'vue-router';

    import AnalyticsTabIcon from '@/shared/icons/chat/AnalyticsTab.vue';
    import CounterpartyTabIcon from '@/shared/icons/chat/CounterpartyTab.vue';
    import CreateContractTabIcon from '@/shared/icons/chat/CreateContractTab.vue';

    const route = useRoute();

    const activeChatId = computed(() => {
        const { chat_id } = route.params;
        return Array.isArray(chat_id) ? chat_id[0] : chat_id;
    });

    const isChatPage = computed(() => {
        return route.path === '/chat/new-chat' || /^\/chat\/[^/]+$/.test(route.path);
    });

    const items = computed(() => [
        {
            label: 'Чат консультации',
            to: '/chat/new-chat',
            icon: AnalyticsTabIcon,
            active: activeChatId.value === 'analytic' || isChatPage.value,
        },
        {
            label: 'Проверка компании',
            to: '/company/counterparty-check',
            icon: CounterpartyTabIcon,
            active: route.path.startsWith('/company'),
        },
        {
            label: 'Договора',
            to: '/contracts/templates',
            icon: CreateContractTabIcon,
            active: route.path.startsWith('/contracts') || route.path.startsWith('/template/'),
        },
    ]);
</script>
