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
                    v-for="template in templates"
                    :key="template.id"
                    :path="`/template/${template.slug}`"
                    :preview-path="template.previewPath"
                    :text="template.summary"
                    :title="template.title"
                />
            </div>

            <p
                v-if="!isLoadingTemplates && !templates.length"
                class="text !m-[20px_0_0] !text-[#596065]"
            >
                Шаблоны пока не найдены.
            </p>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { computed, onMounted } from 'vue';

    import { useTemplatesStore } from '@/entities/templates/models/store';
    import TemplatesCard from '@/shared/widgets/cards/TemplatesCard.vue';

    const templatesStore = useTemplatesStore();

    const templates = computed(() => {
        return templatesStore.templates;
    });

    const isLoadingTemplates = computed(() => {
        return templatesStore.isLoadingTemplates;
    });

    onMounted(async () => {
        await templatesStore.fetchTemplates();
    });
</script>
