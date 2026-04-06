<template>
    <section class="chat flex min-h-screen bg-white">
        <Sidebar class="max-md:hidden" />
        <main class="flex min-w-0 flex-1 flex-col  h-[100vh] bg-white overflow-y-scroll">
            <slot />
        </main>
    </section>
</template>

<script setup lang="ts">
    import Sidebar from '@/shared/layout/Sidebar.vue';
</script>
