<template>
    <section class="templates py-[10px] md:py-[20px]">
        <div class="container">
            <div class="templates__top max-w-[700px] max-md:max-w-full">
                <h1 class="templates-title font-semibold max-md:text-[32px] max-md:leading-[38px] max-sm:text-[28px] max-sm:leading-[34px]">
                    Шаблоны документов
                </h1>
                <p class="text text-[#596065] max-md:!mt-[14px] max-md:text-[15px] max-md:leading-[24px] max-sm:text-[14px] max-sm:leading-[22px]">
                    Готовые юридические шаблоны документов для бизнеса и личных задач с возможностью быстрой настройки, редактирования и удобного использования онлайн
                </p>
            </div>

            <div class="templates__content grid grid-cols-3 gap-[30px] !m-[50px_0] max-lg:grid-cols-2 max-lg:gap-[24px] max-md:!m-[32px_0_0] max-md:grid-cols-1 max-md:gap-[18px]">
                <TemplatesCard
                    v-for="template in templateCatalog"
                    :key="template.slug"
                    :path="`/template/${template.slug}`"
                    :preview-path="template.previewPath"
                    :text="template.summary"
                    :title="template.title"
                />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { templateCatalog } from '@/entities/templates/lib/catalog';
    import TemplatesCard from '@/shared/widgets/cards/TemplatesCard.vue';
</script>
