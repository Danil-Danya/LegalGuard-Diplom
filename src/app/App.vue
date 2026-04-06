<template>
    <Component :is="layout">
        <RouterView />
    </Component>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { useRoute } from 'vue-router';

    import ChatLayout from '@/layout/ChatLayout.vue';
    import SiteLayout from '@/layout/SiteLayout.vue';
    import LoginLayout from '@/layout/LoginLayout.vue';
    import ContractLayout from '@/layout/ContractLayout.vue';

    const route = useRoute();

    const layouts = {
        chat: ChatLayout,
        site: SiteLayout,
        login: LoginLayout,
        contract: ContractLayout,
        contracts: ContractLayout,
    };

    const layout = computed(() => {
        return layouts[route.meta.layout as keyof typeof layouts] || SiteLayout;
    });
</script>
