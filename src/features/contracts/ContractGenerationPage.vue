<template>
    <section class="pb-[188px] pt-[24px] md:pb-[80px]">
        <Breadcrumbs :links="breadcrumbsLinks" />
        <div class="container">
            <div v-if="resolvedTemplate" class="space-y-[24px]">
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
                                    v-for="field in regularFields"
                                    :key="field.key"
                                    :document-type="resolvedTemplate.title"
                                    :field="field"
                                    :hint-template-context="hintTemplateContext"
                                    :model-value="resolveFieldValue(field.key)"
                                    @update:model-value="contractStore.setFieldValue(field.key, $event)"
                                />
                            </div>

                            <div
                                v-if="fileFields.length"
                                class="grid grid-cols-1 gap-[16px] !mt-[16px]"
                            >
                                <ContractFieldRenderer
                                    v-for="field in fileFields"
                                    :key="field.key"
                                    :document-type="resolvedTemplate.title"
                                    :field="field"
                                    :hint-template-context="hintTemplateContext"
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

                        <div class="hidden md:block">
                            <ContractPreviewSheet
                                :attachment-file="attachmentFile"
                                :payload="previewPayload"
                                :signature-file="signatureFile"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div
                v-else-if="isLoadingTemplate"
                class="rounded-[18px] border border-[var(--color-border)] bg-white p-[24px]"
            >
                <h1 class="text-[32px] font-semibold text-[var(--color-text-primary)]">
                    Загрузка шаблона
                </h1>
                <p class="mt-[12px] text-[16px] leading-[26px] text-[var(--color-text-secondary)]">
                    Получаем структуру документа из API и собираем шаги формы.
                </p>
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

        <div
            v-if="resolvedTemplate"
            class="fixed bottom-[102px] left-[15px] right-[15px] z-20 md:hidden"
        >
            <button
                type="button"
                class="flex min-h-[56px] !p-[15px] w-full items-center justify-between rounded-[8px] border border-[var(--color-border)] bg-white/95 px-[18px] py-[14px] text-left shadow-[0_12px_28px_rgba(45,51,56,0.12)] backdrop-blur-[14px]"
                @click="openMobilePreview"
            >
                <div>
                    <p class="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                        Документ
                    </p>
                    <p class="mt-[4px] text-[15px] font-medium text-[var(--color-text-primary)]">
                        Развернуть документ
                    </p>
                </div>

                <span class="inline-flex h-[34px] min-w-[34px] items-center justify-center rounded-full bg-[var(--color-primary-10)] px-[10px] text-[13px] font-semibold text-[var(--color-primary)]">
                    A4
                </span>
            </button>
        </div>

        <div
            v-if="resolvedTemplate"
            class="fixed bottom-[15px] left-[15px] right-[15px] z-20 md:hidden"
        >
            <MobileChatTabbar />
        </div>

        <Transition name="contract-preview-modal">
            <div
                v-if="isMobilePreviewOpen"
                class="fixed inset-0 z-[90] bg-[rgba(17,24,39,0.42)] !p-[12px] md:hidden"
                @click.self="closeMobilePreview"
            >
                <div class="mx-auto flex h-full max-w-[520px] !p-[10px] flex-col overflow-hidden rounded-[8px] bg-white shadow-[0_24px_80px_rgba(20,20,20,0.28)]">
                    <div class="flex items-center justify-between border-b !mt-[10px] border-[var(--color-border)] px-[18px] py-[16px]">
                        <div>
                            <p class="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                                Документ
                            </p>
                            <p class="mt-[4px] text-[15px] font-medium text-[var(--color-text-primary)]">
                                Предпросмотр A4
                            </p>
                        </div>

                        <button
                            type="button"
                            aria-label="Закрыть предпросмотр документа"
                            class="inline-flex h-[38px] min-w-[38px] items-center justify-center rounded-full border border-[var(--color-border)] px-[12px] text-[22px] leading-none font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                            @click="closeMobilePreview"
                        >
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>

                    <div class="flex-1 overflow-y-auto bg-[var(--color-surface)] p-[12px] !mt-[10px]">
                        <ContractPreviewSheet
                            :attachment-file="attachmentFile"
                            :payload="previewPayload"
                            :signature-file="signatureFile"
                        />
                    </div>
                </div>
            </div>
        </Transition>
    </section>
</template>

<script setup lang="ts">
    import { computed, onBeforeUnmount, ref, watch } from 'vue';
    import { useRoute } from 'vue-router';

    import { buildContractPayload, buildContractStepSchemas, buildHintTemplateContext } from '@/entities/contracts/lib/schema';
    import type { ContractDocumentPayload, ContractFieldValue, ContractStep, ContractStepSchema } from '@/entities/contracts/lib/types';
    import { useContractStore } from '@/entities/contracts/models/store';
    import { useTemplatesStore } from '@/entities/templates/models/store';
    import MobileChatTabbar from '@/shared/layout/MobileChatTabbar.vue';
    import Breadcrumbs from '@/shared/ui/Breadcrumbs.vue';

    import ContractFieldRenderer from './ContractFieldRenderer.vue';
    import ContractPreviewSheet from './ContractPreviewSheet.vue';

    const props = defineProps<{
        step: ContractStep;
    }>();

    const route = useRoute();
    const contractStore = useContractStore();
    const templatesStore = useTemplatesStore();
    const isMobilePreviewOpen = ref(false);

    const templateSlug = computed(() => {
        const routeValue = Array.isArray(route.params.template_name) ? route.params.template_name[0] : route.params.template_name;
        return routeValue || '';
    });

    const template = computed(() => {
        return templateSlug.value ? templatesStore.templateBySlug[templateSlug.value] : undefined;
    });

    const resolvedTemplate = computed(() => {
        return template.value?.templateSchema ? template.value : undefined;
    });

    const isLoadingTemplate = computed(() => {
        return templatesStore.isLoadingTemplate;
    });

    watch(templateSlug, async (nextSlug) => {
        if (!nextSlug) {
            return;
        }

        await templatesStore.fetchTemplateBySlug(nextSlug);
    }, { immediate: true });

    watch(resolvedTemplate, (nextTemplate) => {
        if (!nextTemplate) {
            return;
        }

        contractStore.initializeTemplate(nextTemplate);
    }, { immediate: true });

    watch(isMobilePreviewOpen, (isOpen) => {
        if (typeof document === 'undefined') {
            return;
        }

        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    onBeforeUnmount(() => {
        if (typeof document !== 'undefined') {
            document.body.style.overflow = '';
        }
    });

    const stepSchemas = computed(() => {
        return resolvedTemplate.value ? buildContractStepSchemas(resolvedTemplate.value) : [];
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

    const regularFields = computed(() => {
        return currentStep.value.fields.filter((field) => field.type !== 'file');
    });

    const fileFields = computed(() => {
        return currentStep.value.fields.filter((field) => field.type === 'file');
    });

    const breadcrumbsLinks = computed(() => {
        if (!resolvedTemplate.value) {
            return [
                { path: '/', text: 'Домашняя' },
                { path: '/contracts/templates', text: 'Шаблоны документов' },
            ];
        }

        return [
            { path: '/', text: 'Домашняя' },
            { path: '/contracts/templates', text: 'Шаблоны документов' },
            { path: `/template/${resolvedTemplate.value.slug}`, text: resolvedTemplate.value.title },
            { path: route.path, text: `Шаг ${props.step}` },
        ];
    });

    const previewPayload = computed(() => {
        if (!resolvedTemplate.value) {
            return {
                templateSlug: '',
                title: '',
                documentDate: '',
                documentPlace: '',
                firstParty: '',
                secondParty: '',
                body: [],
                parties: [],
                signatureFileName: null,
                attachmentFileName: null,
            } as ContractDocumentPayload;
        }

        return buildContractPayload(resolvedTemplate.value, contractStore.values);
    });

    const hintTemplateContext = computed(() => {
        if (!resolvedTemplate.value) {
            return {};
        }

        return buildHintTemplateContext(resolvedTemplate.value, contractStore.values);
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
        if (!resolvedTemplate.value) {
            return '';
        }

        if (props.step === 1) {
            return `/template/${resolvedTemplate.value.slug}`;
        }

        if (props.step === 2) {
            return `/contracts/templates/${resolvedTemplate.value.slug}/contract_id/step-one`;
        }

        return `/contracts/templates/${resolvedTemplate.value.slug}/contract_id/step-two`;
    });

    const nextPath = computed(() => {
        if (!resolvedTemplate.value) {
            return '/contracts/templates';
        }

        if (props.step === 1) {
            return `/contracts/templates/${resolvedTemplate.value.slug}/contract_id/step-two`;
        }

        if (props.step === 2) {
            return `/contracts/${resolvedTemplate.value.slug}/contract_id/step-three`;
        }

        return `/template/${resolvedTemplate.value.slug}`;
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

    const openMobilePreview = () => {
        isMobilePreviewOpen.value = true;
    };

    const closeMobilePreview = () => {
        isMobilePreviewOpen.value = false;
    };
</script>

<style scoped>
    .contract-preview-modal-enter-active,
    .contract-preview-modal-leave-active {
        transition: opacity 220ms ease, transform 220ms ease;
    }

    .contract-preview-modal-enter-from,
    .contract-preview-modal-leave-to {
        opacity: 0;
    }

    .contract-preview-modal-enter-from > div,
    .contract-preview-modal-leave-to > div {
        transform: translateY(18px);
    }

    .contract-preview-modal-enter-active > div,
    .contract-preview-modal-leave-active > div {
        transition: transform 220ms ease;
    }
</style>
