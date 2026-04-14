<template>
    <section class="!p-[50px_9] md:pb-0">
        <Breadcrumbs :links="breadcrumbsLinks" />
        <Templates />

        <div class="fixed bottom-[15px] left-[15px] right-[15px] z-20 md:hidden">
            <MobileChatTabbar />
        </div>
    </section>
</template>

<script setup lang="ts">

    import Breadcrumbs from '@/shared/ui/Breadcrumbs.vue';
    import MobileChatTabbar from '@/shared/layout/MobileChatTabbar.vue';
    import Templates from './documents/Templates.vue';

    const breadcrumbsLinks = [
        {
            path: '/',
            text: 'Домашняя'
        },

        {
            path: '/contracts/templates',
            text: 'Шаблоны документов'
        }
    ]

</script>
