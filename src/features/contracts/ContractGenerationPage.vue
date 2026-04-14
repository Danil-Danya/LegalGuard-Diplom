<template>
    <section class="pb-[56px] pt-[24px] md:pb-[80px]">
        <Breadcrumbs :links="breadcrumbsLinks" />
        <div class="container">
            <div v-if="template" class="space-y-[24px]">

                <div class="rounded-[22px] border border-[var(--color-border)] !m-[30px_0] bg-white !p-[24px] max-md:!p-[18px]">
                    <div class="flex flex-wrap items-start justify-between gap-[16px] border-b border-[var(--color-border)] pb-[20px]">
                        <div class="max-w-[760px]">
                            <p class="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                                {{ currentStep.eyebrow }}
                            </p>
                            <h1 class="!mt-[10px] text-[38px] font-semibold leading-[1] tracking-[-0.04em] text-[var(--color-text-primary)] max-md:text-[30px]">
                                {{ currentStep.title }}
                            </h1>
                            <p class="!mt-[12px] max-w-[720px] text-[16px] leading-[26px] text-[var(--color-text-secondary)]">
                                {{ currentStep.description }}
                            </p>
                        </div>

                        <div class="flex items-center gap-[10px] rounded-[14px] bg-[var(--color-surface)] px-[14px] py-[12px]">
                            <span
                                v-for="stepItem in stepLabels"
                                :key="stepItem.step"
                                class="flex h-[34px] min-w-[34px] items-center justify-center rounded-full px-[10px] text-[13px] font-semibold"
                                :class="stepItem.step === step ? 'bg-[var(--color-primary)] text-white' : 'bg-white text-[var(--color-text-secondary)]'"
                            >
                                {{ stepItem.shortLabel }}
                            </span>
                        </div>
                    </div>

                    <div class="grid gap-[24px] pt-[24px] xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] xl:items-start !mt-[30px]">
                        <section class="min-w-0 rounded-[18px] bg-[var(--color-surface)] !p-[18px]">
                            <div class="grid gap-[16px] grid-cols-1">
                                <ContractFieldRenderer
                                    v-for="field in currentStep.fields"
                                    :key="field.key"
                                    :field="field"
                                    :model-value="resolveFieldValue(field.key)"
                                    @update:model-value="contractStore.setFieldValue(field.key, $event)"
                                />
                            </div>

                            <div class="!mt-[24px] flex flex-wrap items-center gap-[12px]">
                                <RouterLink
                                    v-if="previousPath"
                                    :to="previousPath"
                                    class="inline-flex !p-[10px_30px] items-center justify-center rounded-[10px] border border-[var(--color-primary-30)] px-[18px] text-[15px] font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-10)]"
                                >
                                    Назад
                                </RouterLink>

                                <RouterLink
                                    :to="nextPath"
                                    class="inline-flex !p-[10px_30px] !text-white items-center justify-center rounded-[10px] bg-[var(--color-primary)] px-[22px] text-[15px] font-semibold text-white transition-colors hover:bg-accent"
                                >
                                    {{ nextLabel }}
                                </RouterLink>
                            </div>
                        </section>

                        <ContractPreviewSheet
                            :attachment-file="attachmentFile"
                            :payload="previewPayload"
                            :signature-file="signatureFile"
                        />
                    </div>
                </div>
            </div>

            <div
                v-else
                class="rounded-[18px] border border-[var(--color-border)] bg-white p-[24px]"
            >
                <h1 class="text-[32px] font-semibold text-[var(--color-text-primary)]">
                    Шаблон не найден
                </h1>
                <p class="mt-[12px] text-[16px] leading-[26px] text-[var(--color-text-secondary)]">
                    Для этого маршрута нет шаблона. Вернитесь к каталогу и выберите документ заново.
                </p>
                <RouterLink
                    class="mt-[20px] inline-flex text-[16px] font-semibold text-[var(--color-primary)]"
                    to="/contracts/templates"
                >
                    Перейти к шаблонам
                </RouterLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { computed, watch } from 'vue';
    import { useRoute } from 'vue-router';

    import { buildContractPayload, buildContractStepSchemas } from '@/entities/contracts/lib/schema';
    import type { ContractDocumentPayload, ContractFieldValue, ContractStep, ContractStepSchema } from '@/entities/contracts/lib/types';
    import { useContractStore } from '@/entities/contracts/models/store';
    import { getTemplateBySlug } from '@/entities/templates/lib/catalog';
    import Breadcrumbs from '@/shared/ui/Breadcrumbs.vue';

    import ContractFieldRenderer from './ContractFieldRenderer.vue';
    import ContractPreviewSheet from './ContractPreviewSheet.vue';

    const props = defineProps<{
        step: ContractStep;
    }>();

    const route = useRoute();
    const contractStore = useContractStore();

    const templateSlug = computed(() => {
        const routeValue = Array.isArray(route.params.template_name) ? route.params.template_name[0] : route.params.template_name;
        return routeValue || '';
    });

    const template = computed(() => {
        return getTemplateBySlug(templateSlug.value);
    });

    watch(template, (nextTemplate) => {
        if (!nextTemplate) {
            return;
        }

        contractStore.initializeTemplate(nextTemplate);
    }, { immediate: true });

    const stepSchemas = computed(() => {
        return template.value ? buildContractStepSchemas(template.value) : [];
    });

    const emptyStep: ContractStepSchema = {
        step: props.step,
        eyebrow: '',
        title: '',
        description: '',
        fields: [],
    };

    const currentStep = computed(() => {
        return stepSchemas.value.find((stepItem) => stepItem.step === props.step) ?? stepSchemas.value[0] ?? emptyStep;
    });

    const resolveFieldValue = (key: string): ContractFieldValue => {
        return contractStore.values[key] ?? '';
    };

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
            { path: route.path, text: `Шаг ${props.step}` },
        ];
    });

    const previewPayload = computed(() => {
        if (!template.value) {
            return {
                templateSlug: '',
                title: '',
                documentDate: '',
                firstParty: '',
                secondParty: '',
                signatureLabel: '',
                description: [],
                sections: [],
                signatureFileName: null,
                attachmentFileName: null,
            } as ContractDocumentPayload;
        }

        return buildContractPayload(template.value, contractStore.values);
    });

    const signatureFile = computed(() => {
        const value = contractStore.values.signatureFile;
        return value instanceof File ? value : null;
    });

    const attachmentFile = computed(() => {
        const value = contractStore.values.attachmentFile;
        return value instanceof File ? value : null;
    });

    const previousPath = computed(() => {
        if (!template.value) {
            return '';
        }

        if (props.step === 1) {
            return `/template/${template.value.slug}`;
        }

        if (props.step === 2) {
            return `/contracts/templates/${template.value.slug}/contract_id/step-one`;
        }

        return `/contracts/templates/${template.value.slug}/contract_id/step-two`;
    });

    const nextPath = computed(() => {
        if (!template.value) {
            return '/contracts/templates';
        }

        if (props.step === 1) {
            return `/contracts/templates/${template.value.slug}/contract_id/step-two`;
        }

        if (props.step === 2) {
            return `/contracts/${template.value.slug}/contract_id/step-three`;
        }

        return `/template/${template.value.slug}`;
    });

    const nextLabel = computed(() => {
        return props.step === 3 ? 'Завершить' : 'Следующий шаг';
    });

    const stepLabels = computed(() => {
        return [
            { step: 1, shortLabel: '01' },
            { step: 2, shortLabel: '02' },
            { step: 3, shortLabel: '03' },
        ];
    });
</script>
