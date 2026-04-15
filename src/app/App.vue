<template>
    <Component :is="layout">
        <RouterView />
    </Component>
    <AuthRequiredModal />
</template>

<script setup lang="ts">
    import { computed, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import { isAuthenticatedSession } from '@/entities/users/api/auth';
    import { useUserStore } from '@/entities/users/models/store';

    import ChatLayout from '@/layout/ChatLayout.vue';
    import SiteLayout from '@/layout/SiteLayout.vue';
    import LoginLayout from '@/layout/LoginLayout.vue';
    import ContractLayout from '@/layout/ContractLayout.vue';
    import AuthRequiredModal from '@/shared/ui/AuthRequiredModal.vue';

    const route = useRoute();
    const userStore = useUserStore();

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

    onMounted(async () =>{
        if (!isAuthenticatedSession()) {
            return;
        }

        try {
            await userStore.fetchProfile();
        }
        catch {
            return;
        }
    })

</script>
