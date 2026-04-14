<template>
    <section class="chat flex min-h-screen bg-white">
        <Sidebar class="max-md:hidden" />

        <Transition name="mobile-sidebar-backdrop">
            <div
                v-if="isMobileSidebarOpen"
                class="fixed inset-0 z-50 bg-[rgba(45,51,56,0.32)] backdrop-blur-[2px] md:hidden"
                @click="closeMobileSidebar"
            />
        </Transition>

        <Transition name="mobile-sidebar-panel">
            <div
                v-if="isMobileSidebarOpen"
                class="fixed inset-y-0 left-0 z-[60] md:hidden"
                @click.stop
            >
                <Sidebar
                    class="!h-[100dvh] !w-[min(320px,calc(100vw-28px))] !border-y-0 !border-l-0 !border-r border-r-[var(--color-border)] shadow-[0_18px_44px_rgba(45,51,56,0.18)]"
                />
            </div>
        </Transition>

        <main data-chat-scroll-container class="flex min-w-0 flex-1 flex-col h-[100vh] bg-white overflow-y-scroll">
            <MobileChatHeader @menu-click="toggleMobileSidebar" />
            <slot />
        </main>
    </section>
</template>

<script setup lang="ts">
    import { ref, watch } from 'vue';
    import { useRoute } from 'vue-router';

    import MobileChatHeader from '@/shared/layout/MobileChatHeader.vue';
    import Sidebar from '@/shared/layout/Sidebar.vue';

    const route = useRoute();
    const isMobileSidebarOpen = ref(false);

    const closeMobileSidebar = () => {
        isMobileSidebarOpen.value = false;
    };

    const toggleMobileSidebar = () => {
        isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
    };

    watch(() => route.fullPath, () => {
        closeMobileSidebar();
    });
</script>

<style scoped>
    .mobile-sidebar-backdrop-enter-active,
    .mobile-sidebar-backdrop-leave-active {
        transition: opacity 220ms ease, backdrop-filter 220ms ease;
    }

    .mobile-sidebar-backdrop-enter-from,
    .mobile-sidebar-backdrop-leave-to {
        opacity: 0;
        backdrop-filter: blur(0);
    }

    .mobile-sidebar-panel-enter-active,
    .mobile-sidebar-panel-leave-active {
        transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease;
    }

    .mobile-sidebar-panel-enter-from,
    .mobile-sidebar-panel-leave-to {
        opacity: 0;
        transform: translateX(-20px);
    }
</style>
