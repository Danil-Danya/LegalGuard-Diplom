<template>
    <section class="!pb-[108px] md:pb-0">
        <Breadcrumbs :links="breadcrumbsLinks" />

        <section class="pb-[56px] pt-[6px] md:pb-[80px] md:pt-[12px]">
            <div class="container">
                <div v-if="template" class="space-y-[32px] md:space-y-[44px]">
                    <div class="max-w-[980px]">
                        <h1 class="text-[44px] font-semibold leading-[0.98] tracking-[-0.04em] text-[var(--color-text-primary)] max-lg:text-[38px] max-md:text-[32px] max-sm:text-[28px]">
                            {{ template.title }}
                        </h1>
                    </div>

                    <div class="grid !p-[20px] gap-[18px] !mt-[20px] border-y border-[var(--color-border)] py-[22px] grid-cols-2 md:grid-cols-4 md:gap-[24px]">
                        <div
                            v-for="item in metaItems"
                            :key="item.label"
                            class="min-w-0"
                        >
                            <p class="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                                {{ item.label }}
                            </p>
                            <div v-if="item.type === 'complexity'" class="mt-[10px] flex items-center gap-[12px]">
                                <div class="flex items-center gap-[6px]">
                                    <span
                                        v-for="bar in 3"
                                        :key="bar"
                                        class="h-[4px] w-[20px] rounded-full"
                                        :class="bar <= template.complexityBars ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'"
                                    />
                                </div>
                                <span class="text-[15px] font-medium text-[var(--color-text-secondary)]">
                                    {{ item.value }}
                                </span>
                            </div>
                            <p
                                v-else
                                class="mt-[10px] text-[17px] font-medium leading-[24px] text-[var(--color-text-primary)]"
                            >
                                {{ item.value }}
                            </p>
                        </div>
                    </div>

                    <div class="grid gap-[24px] xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start !mt-[20px]">
                        <div class="space-y-[28px] md:space-y-[36px]">
                            <div class="overflow-hidden rounded-[18px] bg-white">
                                <img
                                    :alt="template.title"
                                    :src="template.previewPath"
                                    class="aspect-[16/10] w-full object-cover"
                                >
                            </div>

                            <section class="max-w-[860px] space-y-[18px] !mt-[20px]">
                                <h2 class="text-[34px] font-semibold leading-[1.02] tracking-[-0.03em] text-[var(--color-text-primary)] max-md:text-[28px] max-sm:text-[24px]">
                                    Описание документа
                                </h2>

                                <p
                                    v-for="paragraph in template.description"
                                    :key="paragraph"
                                    class="text-[16px] text-[var(--color-text-secondary)] max-md:text-[14px] !mt-[10px]"
                                >
                                    {{ paragraph }}
                                </p>
                            </section>

                            <section class="max-w-[860px] space-y-[22px] !mt-[20px]">
                                <h2 class="text-[34px] font-semibold leading-[1.02] tracking-[-0.03em] text-[var(--color-text-primary)] max-md:text-[28px] max-sm:text-[24px]">
                                    Ключевые разделы документа
                                </h2>

                                <div class="space-y-[18px] !mt-[20px]">
                                    <article
                                        v-for="(section, index) in template.sections"
                                        :key="section.title"
                                        class="grid gap-[10px] !mt-[20px] !p-[10px_0] border-b border-[var(--color-border)] pb-[18px] last:border-b-0 last:pb-0 md:grid-cols-[56px_minmax(0,1fr)]"
                                    >
                                        <p class="text-[42px] font-semibold leading-none tracking-[-0.04em] text-[var(--color-primary-30)]">
                                            {{ String(index + 1).padStart(2, '0') }}
                                        </p>
                                        <div class="space-y-[8px]">
                                            <h3 class="text-[24px] font-semibold leading-[30px] text-[var(--color-text-primary)] max-md:text-[20px]">
                                                {{ section.title }}
                                            </h3>
                                            <p class="text-[16px] !mt-[10px] leading-[28px] text-[var(--color-text-secondary)] max-md:text-[15px] max-md:leading-[25px]">
                                                {{ section.description }}
                                            </p>
                                        </div>
                                    </article>
                                </div>
                            </section>

                            <blockquote class="rounded-[18px] !p-[30px] border border-[var(--color-border)] border-l-[4px] border-l-[var(--color-primary)] bg-white px-[22px] py-[24px]">
                                <p class="text-[16px] italic text-[var(--color-text-secondary)] max-md:text-[17px] max-md:leading-[28px]">
                                    "{{ template.quote }}"
                                </p>
                                <p class="mt-[16px] text-[14px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                                    {{ template.quoteAuthor }}
                                </p>
                            </blockquote>
                        </div>

                        <aside class="space-y-[18px] xl:sticky xl:top-[24px]">
                            <div class="rounded-[8px] border border-[var(--color-border)] bg-white !p-[24px] max-md:p-[20px]">
                                <h2 class="text-[28px] font-semibold leading-[1.04] tracking-[-0.03em] text-[var(--color-text-primary)] max-md:text-[24px]">
                                    Начать работу
                                </h2>
                                <p class="!mt-[14px] text-[16px] leading-[28px] text-[var(--color-text-secondary)] max-md:text-[15px] max-md:leading-[25px]">
                                    {{ template.sidebarDescription }}
                                </p>

                                <RouterLink :to="createPath" class="!mt-[24px] block">
                                    <Button class="w-full !justify-center text-[16px] font-semibold" color="primary" padding="14px_24px" text="Использовать шаблон" />
                                </RouterLink>
                            </div>

                            <div class="rounded-[8px] bg-[#FAF7F2] !p-[22px] max-md:p-[20px] !mt-[20px]">
                                <p class="text-[14px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                                    Проверено LEGALGUARD AI
                                </p>
                                <p class="mt-[12px] text-[16px] !mt-[20px] text-[var(--color-text-secondary)] max-md:text-[15px] max-md:leading-[24px]">
                                    {{ template.verifiedText }}
                                </p>
                            </div>
                        </aside>
                    </div>
                </div>

                <div
                    v-else-if="isLoadingTemplate"
                    class="rounded-[18px] border border-[var(--color-border)] bg-white p-[24px] text-[var(--color-text-primary)]"
                >
                    <h1 class="text-[32px] font-semibold">Загрузка шаблона</h1>
                    <p class="mt-[12px] text-[17px] leading-[28px] text-[var(--color-text-secondary)]">
                        Получаем данные шаблона из API.
                    </p>
                </div>

                <div
                    v-else
                    class="rounded-[18px] border border-[var(--color-border)] bg-white p-[24px] text-[var(--color-text-primary)]"
                >
                    <h1 class="text-[32px] font-semibold">Шаблон не найден</h1>
                    <p class="mt-[12px] text-[17px] leading-[28px] text-[var(--color-text-secondary)]">
                        Такого шаблона сейчас нет в каталоге.
                    </p>
                    <RouterLink
                        class="mt-[20px] inline-flex text-[16px] font-semibold text-[var(--color-primary)]"
                        to="/contracts/templates"
                    >
                        Вернуться к шаблонам
                    </RouterLink>
                </div>
            </div>
        </section>

        <div class="fixed bottom-[15px] left-[15px] right-[15px] z-20 md:hidden">
            <MobileChatTabbar />
        </div>
    </section>
</template>

<script setup lang="ts">
    import { computed, watch } from 'vue';
    import { useRoute } from 'vue-router';

    import { useTemplatesStore } from '@/entities/templates/models/store';
    import MobileChatTabbar from '@/shared/layout/MobileChatTabbar.vue';
    import Breadcrumbs from '@/shared/ui/Breadcrumbs.vue';
    import Button from '@/shared/ui/Button.vue';

    const route = useRoute();
    const templatesStore = useTemplatesStore();

    const slug = computed(() => {
        const routeSlug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug;
        return routeSlug || '';
    });

    const template = computed(() => {
        const currentTemplate = slug.value ? templatesStore.templateBySlug[slug.value] : undefined;
        return currentTemplate?.templateSchema ? currentTemplate : undefined;
    });

    const isLoadingTemplate = computed(() => {
        return templatesStore.isLoadingTemplate;
    });

    watch(slug, async (nextSlug) => {
        if (!nextSlug) {
            return;
        }

        await templatesStore.fetchTemplateBySlug(nextSlug);
    }, { immediate: true });

    const breadcrumbsLinks = computed(() => {
        if (!template.value) {
            return [
                { path: '/', text: 'Домашняя' },
                { path: '/contracts/templates', text: 'Шаблоны документов' },
            ];
        }

        return [
            { path: '/', text: 'Домашняя' },
            { path: '/contracts/templates', text: 'Шаблоны документов' },
            { path: `/template/${template.value.slug}`, text: template.value.title },
        ];
    });

    const metaItems = computed(() => {
        if (!template.value) {
            return [];
        }

        return [
            { label: 'Дата создания', value: template.value.createdAt, type: 'text' },
            { label: 'Категория', value: template.value.category, type: 'text' },
            { label: 'Длительность', value: template.value.duration, type: 'text' },
            { label: 'Сложность', value: template.value.complexityLabel, type: 'complexity' },
        ];
    });

    const createPath = computed(() => {
        if (!template.value) {
            return '/contracts/templates';
        }

        return `/contracts/templates/${template.value.slug}/contract_id/step-one`;
    });
</script>
