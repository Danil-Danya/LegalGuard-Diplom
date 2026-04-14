<template>
    <section class="site flex min-h-screen flex-col">
        <Header />
        <main class="flex-1">
            <slot />
        </main>
        <Footer />
    </section>
</template>

<script setup lang="ts">
    import Header from '@/shared/layout/Header.vue';
    import Footer from '@/shared/layout/Footer.vue';
</script>
