<template>
    <section class="pb-[188px] pt-[24px] md:pb-[80px]">
        <Breadcrumbs :links="breadcrumbsLinks" />

        <div class="container">
            <div v-if="canRenderDocument" class="space-y-[24px]">
                <div class="rounded-[22px] border border-[var(--color-border)] !m-[30px_0] bg-white !p-[24px] max-md:!p-[18px]">
                    <div class="flex flex-wrap items-start justify-between gap-[16px] border-b border-[var(--color-border)] pb-[20px]">
                        <div class="max-w-[720px]">
                            <p class="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                                Готово
                            </p>
                            <h1 class="!mt-[10px] text-[38px] font-semibold leading-[1] tracking-[-0.04em] text-[var(--color-text-primary)] max-md:text-[30px]">
                                Документ готов
                            </h1>
                            <p class="!mt-[12px] max-w-[680px] text-[16px] leading-[26px] text-[var(--color-text-secondary)]">
                                Ваш договор сформирован и готов к выгрузке. Проверьте итоговый вид документа и выберите формат сохранения.
                            </p>
                        </div>

                        <div class="rounded-[10px] border !p-[5px_15px] border-[var(--color-primary-30)] bg-[var(--color-primary-10)] px-[14px] py-[8px] text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                            Шаблон собран
                        </div>
                    </div>

                    <div class="grid gap-[24px] pt-[24px] xl:grid-cols-[minmax(0,3fr)_360px] xl:items-start !mt-[30px]">
                        <section class="hidden md:block">
                            <ContractPreviewSheet
                                :party-files="partyFiles"
                                :party-asset-sources="previewPartyAssetSources"
                                :payload="previewPayload"
                            />
                        </section>

                        <aside class="space-y-[18px]">
                            <div class="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] !p-[20px]">
                                <div class="rounded-[10px] !p-[5px_15px] bg-[#F6EEDD] px-[12px] py-[8px] text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                                    Юридическая проверка пройдена
                                </div>

                                <h2 class="!mt-[18px] text-[28px] font-semibold leading-[1.02] tracking-[-0.03em] text-[var(--color-text-primary)]">
                                    Экспорт документа
                                </h2>
                                <p class="!mt-[10px] text-[15px] leading-[24px] text-[var(--color-text-secondary)]">
                                    Выберите формат сохранения готового шаблона.
                                </p>

                                <div class="grid !mt-[18px] space-y-[12px] gap-[20px]">
                                    <button
                                        type="button"
                                        class="flex w-full items-center gap-[14px] rounded-[14px] border border-[var(--color-border)] bg-white !p-[16px] text-left transition-colors hover:border-[var(--color-primary-30)] hover:bg-[var(--color-primary-10)] disabled:cursor-not-allowed disabled:opacity-70"
                                        :disabled="isPdfExporting"
                                        @click="handleExportPdf"
                                    >
                                        <span class="inline-flex h-[40px] min-w-[40px] items-center justify-center rounded-[12px] bg-[#FFF0EC] text-[12px] font-bold uppercase text-[#B94E2D]">
                                            PDF
                                        </span>

                                        <span class="min-w-0 flex-1">
                                            <span class="block text-[16px] font-semibold leading-[20px] text-[var(--color-text-primary)]">
                                                {{ isPdfExporting ? 'Подготавливаем PDF' : 'Скачать PDF' }}
                                            </span>
                                            <span class="!mt-[4px] block text-[13px] leading-[18px] text-[var(--color-text-secondary)]">
                                                Для сохранения и печати
                                            </span>
                                        </span>

                                        <span class="text-[18px] font-medium text-[var(--color-text-muted)]">
                                            ↓
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        class="flex w-full items-center gap-[14px] rounded-[14px] border border-[var(--color-border)] bg-white !p-[16px] text-left transition-colors hover:border-[var(--color-primary-30)] hover:bg-[var(--color-primary-10)] disabled:cursor-not-allowed disabled:opacity-70"
                                        :disabled="isDocExporting"
                                        @click="handleExportDoc"
                                    >
                                        <span class="inline-flex h-[40px] min-w-[40px] items-center justify-center rounded-[12px] bg-[#EEF3FF] text-[12px] font-bold uppercase text-[#365CC5]">
                                            DOC
                                        </span>

                                        <span class="min-w-0 flex-1">
                                            <span class="block text-[16px] font-semibold leading-[20px] text-[var(--color-text-primary)]">
                                                {{ isDocExporting ? 'Подготавливаем DOC' : 'Скачать DOC' }}
                                            </span>
                                            <span class="!mt-[4px] block text-[13px] leading-[18px] text-[var(--color-text-secondary)]">
                                                Для редактирования
                                            </span>
                                        </span>

                                        <span class="text-[18px] font-medium text-[var(--color-text-muted)]">
                                            ↓
                                        </span>
                                    </button>
                                </div>

                                <div class="!mt-[20px] border-t border-[var(--color-border)] pt-[18px]">
                                    <div class="flex !mt-[20px] items-center justify-between gap-[12px] text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                                        <span>Генерация файла</span>
                                        <span>100%</span>
                                    </div>

                                    <div class="!mt-[10px] h-[6px] overflow-hidden rounded-full bg-[var(--color-border)]">
                                        <div class="h-full w-full rounded-full bg-[var(--color-primary)]" />
                                    </div>
                                </div>

                                <div class="!mt-[18px] rounded-[14px] border border-[#CFE8D7] bg-[#F0FBF4] !p-[16px]">
                                    <p class="text-[15px] font-semibold text-[#177245]">
                                        Файл готов к выгрузке
                                    </p>
                                    <p class="!mt-[8px] break-all text-[14px] leading-[22px] text-[#177245]">
                                        {{ exportFileName }}
                                    </p>
                                </div>
                            </div>

                            <div class="rounded-[18px] bg-[#FAF7F2] !p-[20px]">
                                <h3 class="text-[20px] font-semibold text-[var(--color-text-primary)]">
                                    Что дальше
                                </h3>
                                <p class="!mt-[10px] text-[15px] leading-[24px] text-[var(--color-text-secondary)]">
                                    При необходимости вернитесь к шагам шаблона, исправьте данные и соберите документ заново.
                                </p>

                                <RouterLink
                                    :to="templatePath"
                                    class="!mt-[18px] inline-flex text-[15px] font-semibold text-[var(--color-primary)]"
                                >
                                    Вернуться к шаблону
                                </RouterLink>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>

            <div
                v-else-if="isLoadingView"
                class="rounded-[18px] border border-[var(--color-border)] bg-white p-[24px]"
            >
                <h1 class="text-[32px] font-semibold text-[var(--color-text-primary)]">
                    Загрузка шаблона
                </h1>
                <p class="mt-[12px] text-[16px] leading-[26px] text-[var(--color-text-secondary)]">
                    Получаем структуру документа и собираем финальный вид договора.
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
                <ErrorMessage v-if="documentLoadError" :text="documentLoadError" />
                <RouterLink
                    class="mt-[20px] inline-flex text-[16px] font-semibold text-[var(--color-primary)]"
                    to="/contracts/templates"
                >
                    Перейти к шаблонам
                </RouterLink>
            </div>
        </div>

        <div
            v-if="canRenderDocument"
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
            v-if="canRenderDocument"
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
                            :party-files="partyFiles"
                            :party-asset-sources="previewPartyAssetSources"
                            :payload="previewPayload"
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

    import { getDocumentById, getDocumentDocxFile, getDocumentPdfFile } from '@/entities/contracts/api/documents';
    import { buildContractPartyAssetSourcesFromDocument, buildContractPayloadFromDocument, createEmptyContractPayload } from '@/entities/contracts/lib/document';
    import { downloadContractDoc, openContractPdfPrint, readFileAsDataUrl } from '@/entities/contracts/lib/export';
    import { buildContractPartyFiles, buildContractPayload } from '@/entities/contracts/lib/schema';
    import type { ContractCreatedDocument, ContractDocumentPayload, ContractPartyAssetSourcesMap, ContractPartyFilesMap } from '@/entities/contracts/lib/types';
    import { useContractStore } from '@/entities/contracts/models/store';
    import { useTemplatesStore } from '@/entities/templates/models/store';
    import { getAuthRequestErrorMessage } from '@/entities/users/api/auth';
    import MobileChatTabbar from '@/shared/layout/MobileChatTabbar.vue';
    import Breadcrumbs from '@/shared/ui/Breadcrumbs.vue';
    import ErrorMessage from '@/shared/ui/ErrorMessage.vue';

    import ContractPreviewSheet from './ContractPreviewSheet.vue';

    const route = useRoute();
    const contractStore = useContractStore();
    const templatesStore = useTemplatesStore();

    const isMobilePreviewOpen = ref(false);
    const isPdfExporting = ref(false);
    const isDocExporting = ref(false);
    const isLoadingDocument = ref(false);
    const documentLoadError = ref('');
    const fetchedDocument = ref<ContractCreatedDocument | null>(null);
    let documentRequestId = 0;

    const templateSlug = computed(() => {
        const routeValue = Array.isArray(route.params.template_name) ? route.params.template_name[0] : route.params.template_name;
        return routeValue || '';
    });

    const documentId = computed(() => {
        const routeParamValue = Array.isArray(route.params.document_id) ? route.params.document_id[0] : route.params.document_id;

        if (typeof routeParamValue === 'string' && routeParamValue.trim()) {
            return routeParamValue;
        }

        const routeQueryValue = Array.isArray(route.query.documentId) ? route.query.documentId[0] : route.query.documentId;
        return typeof routeQueryValue === 'string' ? routeQueryValue : '';
    });

    const template = computed(() => {
        return templateSlug.value ? templatesStore.templateBySlug[templateSlug.value] : undefined;
    });

    const resolvedTemplate = computed(() => {
        return template.value?.templateSchema ? template.value : undefined;
    });

    const activeDocument = computed(() => {
        if (documentId.value) {
            if (fetchedDocument.value?.id === documentId.value) {
                return fetchedDocument.value;
            }

            if (contractStore.createdDocument?.id === documentId.value) {
                return contractStore.createdDocument;
            }
        }

        return fetchedDocument.value || contractStore.createdDocument;
    });

    const isLoadingTemplate = computed(() => {
        return templatesStore.isLoadingTemplate;
    });

    const isLoadingView = computed(() => {
        return isLoadingTemplate.value || isLoadingDocument.value;
    });

    const canRenderDocument = computed(() => {
        return Boolean(activeDocument.value?.templateData || resolvedTemplate.value);
    });

    watch(templateSlug, async (nextSlug) => {
        if (!nextSlug) {
            return;
        }

        await templatesStore.fetchTemplateBySlug(nextSlug);
    }, { immediate: true });

    watch(documentId, async (nextDocumentId) => {
        const requestId = documentRequestId + 1;
        documentRequestId = requestId;
        documentLoadError.value = '';

        if (!nextDocumentId) {
            fetchedDocument.value = null;
            return;
        }

        if (contractStore.createdDocument?.id === nextDocumentId && contractStore.createdDocument.templateData) {
            fetchedDocument.value = contractStore.createdDocument;
            return;
        }

        isLoadingDocument.value = true;

        try {
            const document = await getDocumentById(nextDocumentId);

            if (documentRequestId !== requestId) {
                return;
            }

            fetchedDocument.value = document;
            contractStore.setCreatedDocument(document);
        }
        catch (error) {
            if (documentRequestId !== requestId) {
                return;
            }

            fetchedDocument.value = null;
            documentLoadError.value = getAuthRequestErrorMessage(error, 'Не удалось загрузить документ');
        }
        finally {
            if (documentRequestId === requestId) {
                isLoadingDocument.value = false;
            }
        }
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

    const breadcrumbsLinks = computed(() => {
        if (resolvedTemplate.value) {
            return [
                { path: '/', text: 'Домашняя' },
                { path: '/contracts/templates', text: 'Шаблоны документов' },
                { path: `/template/${resolvedTemplate.value.slug}`, text: resolvedTemplate.value.title },
                { path: route.path, text: 'Документ готов' },
            ];
        }

        if (activeDocument.value?.title) {
            return [
                { path: '/', text: 'Домашняя' },
                { path: '/contracts/templates', text: 'Шаблоны документов' },
                { path: route.path, text: activeDocument.value.title },
            ];
        }

        return [
            { path: '/', text: 'Домашняя' },
            { path: '/contracts/templates', text: 'Шаблоны документов' },
        ];
    });

    const previewPayload = computed<ContractDocumentPayload>(() => {
        if (activeDocument.value?.templateData) {
            return buildContractPayloadFromDocument(activeDocument.value, resolvedTemplate.value?.slug || templateSlug.value);
        }

        if (resolvedTemplate.value) {
            return buildContractPayload(resolvedTemplate.value, contractStore.values);
        }

        return createEmptyContractPayload();
    });

    const previewPartyAssetSources = computed<ContractPartyAssetSourcesMap>(() => {
        if (!activeDocument.value?.templateData) {
            return {};
        }

        return buildContractPartyAssetSourcesFromDocument(activeDocument.value);
    });

    const partyFiles = computed<ContractPartyFilesMap>(() => {
        if (!resolvedTemplate.value) {
            return {};
        }

        return buildContractPartyFiles(resolvedTemplate.value, contractStore.values);
    });

    const templatePath = computed(() => {
        return resolvedTemplate.value ? `/template/${resolvedTemplate.value.slug}` : '/contracts/templates';
    });

    const exportFileName = computed(() => {
        const baseName = previewPayload.value.templateSlug || previewPayload.value.title || activeDocument.value?.id || 'document';
        return `${baseName}.pdf`;
    });

    const hasRemotePartyAssetSources = computed(() => {
        return Object.keys(previewPartyAssetSources.value).length > 0;
    });

    const createFallbackFileName = (extension: 'pdf' | 'docx') => {
        const baseName = previewPayload.value.templateSlug || previewPayload.value.title || activeDocument.value?.id || 'document';
        return `${baseName}.${extension}`;
    };

    const downloadBlobFile = (blob: Blob, fileName: string) => {
        const blobUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = fileName;
        downloadLink.click();

        window.setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
        }, 1000);
    };

    const createPartyObjectUrls = () => {
        return Object.entries(partyFiles.value).reduce<ContractPartyAssetSourcesMap>((result, [partyKey, files]) => {
            result[partyKey] = {
                signatureSrc: files.signatureFile ? URL.createObjectURL(files.signatureFile) : null,
                stampSrc: files.stampFile ? URL.createObjectURL(files.stampFile) : null,
            };

            return result;
        }, {});
    };

    const revokePartyObjectUrls = (partyAssetSources: ContractPartyAssetSourcesMap) => {
        Object.values(partyAssetSources).forEach((sources) => {
            if (sources.signatureSrc) {
                URL.revokeObjectURL(sources.signatureSrc);
            }

            if (sources.stampSrc) {
                URL.revokeObjectURL(sources.stampSrc);
            }
        });
    };

    const createPartyDataUrls = async () => {
        const entries = await Promise.all(
            Object.entries(partyFiles.value).map(async ([partyKey, files]) => {
                const [signatureSrc, stampSrc] = await Promise.all([
                    readFileAsDataUrl(files.signatureFile),
                    readFileAsDataUrl(files.stampFile),
                ]);

                return [
                    partyKey,
                    {
                        signatureSrc,
                        stampSrc,
                    },
                ] as const;
            }),
        );

        return Object.fromEntries(entries) as ContractPartyAssetSourcesMap;
    };

    const openMobilePreview = () => {
        isMobilePreviewOpen.value = true;
    };

    const closeMobilePreview = () => {
        isMobilePreviewOpen.value = false;
    };

    const handleExportPdf = async () => {
        if (!canRenderDocument.value || isPdfExporting.value) {
            return;
        }

        isPdfExporting.value = true;

        if (activeDocument.value?.id) {
            try {
                const file = await getDocumentPdfFile(activeDocument.value.id);

                downloadBlobFile(file.blob, file.fileName || createFallbackFileName('pdf'));
            }
            finally {
                isPdfExporting.value = false;
            }

            return;
        }

        if (hasRemotePartyAssetSources.value) {
            try {
                openContractPdfPrint(previewPayload.value, {
                    partyAssetSources: previewPartyAssetSources.value,
                });
            }
            finally {
                isPdfExporting.value = false;
            }

            return;
        }

        const partyAssetSources = createPartyObjectUrls();

        try {
            openContractPdfPrint(previewPayload.value, {
                partyAssetSources,
            });
        }
        finally {
            isPdfExporting.value = false;

            window.setTimeout(() => {
                revokePartyObjectUrls(partyAssetSources);
            }, 30000);
        }
    };

    const handleExportDoc = async () => {
        if (!canRenderDocument.value || isDocExporting.value) {
            return;
        }

        isDocExporting.value = true;

        try {
            if (activeDocument.value?.id) {
                const file = await getDocumentDocxFile(activeDocument.value.id);

                downloadBlobFile(file.blob, file.fileName || createFallbackFileName('docx'));
                return;
            }

            const partyAssetSources = hasRemotePartyAssetSources.value
                ? previewPartyAssetSources.value
                : await createPartyDataUrls();

            downloadContractDoc(previewPayload.value, {
                partyAssetSources,
            });
        }
        finally {
            isDocExporting.value = false;
        }
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
