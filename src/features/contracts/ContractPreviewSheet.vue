<template>
    <div class="space-y-[14px]">
        <div class="flex flex-wrap items-center justify-between gap-[12px] !mb-[20px]">
            <div>
                <p class="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                    Финальный лист
                </p>
                <p class="mt-[6px] text-[13px] text-[var(--color-text-secondary)]">
                    Вид документа перед отправкой
                </p>
            </div>

            <div
                v-if="previewPages.length > 1"
                class="flex items-center gap-[10px]"
            >
                <button
                    type="button"
                    aria-label="Предыдущая страница"
                    class="inline-flex h-[34px] min-w-[34px] items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-[12px] text-[13px] font-semibold text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40"
                    :disabled="activePageIndex === 0"
                    @click="goToPreviousPage"
                >
                    <span aria-hidden="true" class="text-[18px] leading-none">&lsaquo;</span>
                </button>

                <div class="flex items-center gap-[6px]">
                    <button
                        v-for="(page, index) in previewPages"
                        :key="page.key"
                        type="button"
                        class="h-[8px] w-[8px] rounded-full transition-all"
                        :class="index === activePageIndex ? 'w-[22px] bg-[var(--color-primary)]' : 'bg-[var(--color-primary-30)]'"
                        @click="goToPage(index)"
                    />
                </div>

                <button
                    type="button"
                    aria-label="Следующая страница"
                    class="inline-flex h-[34px] min-w-[34px] items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-[12px] text-[13px] font-semibold text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40"
                    :disabled="activePageIndex === previewPages.length - 1"
                    @click="goToNextPage"
                >
                    <span aria-hidden="true" class="text-[18px] leading-none">&rsaquo;</span>
                </button>
            </div>
        </div>

        <div class="overflow-hidden rounded-[18px] border border-black/10 bg-[#F4F1EA] !p-[18px] shadow-[0_24px_80px_rgba(20,20,20,0.08)] max-md:!p-[6px]">
            <div
                ref="previewViewportRef"
                class="mx-auto overflow-hidden"
                :style="viewportStyle"
            >
                <div
                    class="flex transition-transform duration-300 ease-out"
                    :style="trackStyle"
                >
                    <div
                        v-for="page in previewPages"
                        :key="page.key"
                        class="shrink-0"
                        :style="slideStyle"
                    >
                        <div
                            class="relative overflow-hidden"
                            :style="pageFrameStyle"
                        >
                            <article
                                class="contract-preview-sheet absolute left-0 top-0 bg-white text-black shadow-[0_10px_30px_rgba(20,20,20,0.08)]"
                                :style="sheetStyle"
                            >
                                <template v-if="page.includeHeader">
                                    <div class="contract-preview-sheet__header">
                                        <p
                                            v-if="documentPlace || formattedDate"
                                            class="contract-preview-sheet__meta"
                                        >
                                            <span v-if="documentPlace">{{ documentPlace }}</span>
                                            <span v-if="documentPlace && formattedDate">, </span>
                                            <span v-if="formattedDate">{{ formattedDate }}</span>
                                        </p>

                                        <h2 class="contract-preview-sheet__title">
                                            {{ payload.title }}
                                        </h2>
                                    </div>

                                    <section class="contract-preview-sheet__intro">
                                        <p class="contract-preview-sheet__paragraph">
                                            {{ firstParty }}
                                            <span class="text-black/55">и</span>
                                            {{ secondParty }}
                                            заключили настоящий документ на условиях, указанных ниже.
                                        </p>
                                    </section>
                                </template>

                                <section
                                    v-if="page.sections.length"
                                    class="contract-preview-sheet__sections"
                                >
                                    <article
                                        v-for="section in page.sections"
                                        :key="section.number"
                                        class="contract-preview-sheet__section"
                                    >
                                        <div class="contract-preview-sheet__section-header">
                                            <h3 class="contract-preview-sheet__section-title">
                                                {{ section.number }}. {{ section.title }}
                                            </h3>
                                        </div>

                                        <p
                                            v-if="section.text"
                                            class="contract-preview-sheet__section-text"
                                        >
                                            {{ section.text }}
                                        </p>

                                        <div
                                            v-if="section.items.length"
                                            class="contract-preview-sheet__items"
                                        >
                                            <article
                                                v-for="item in section.items"
                                                :key="item.number"
                                                class="contract-preview-sheet__item"
                                            >
                                                <p class="contract-preview-sheet__item-number">
                                                    {{ item.number }}
                                                </p>

                                                <div>
                                                    <p class="contract-preview-sheet__item-title">
                                                        {{ item.title }}
                                                    </p>
                                                    <p class="contract-preview-sheet__item-text">
                                                        {{ item.text }}
                                                    </p>
                                                </div>
                                            </article>
                                        </div>
                                    </article>
                                </section>

                                <section
                                    v-if="page.parties.length"
                                    class="contract-preview-sheet__parties"
                                >
                                    <h3 class="contract-preview-sheet__parties-title">
                                        Стороны документа
                                    </h3>

                                    <div class="contract-preview-sheet__party-grid">
                                        <article
                                            v-for="party in page.parties"
                                            :key="party.key"
                                            class="contract-preview-sheet__party-card"
                                        >
                                            <h4 class="contract-preview-sheet__party-title">
                                                {{ party.title }}
                                            </h4>

                                            <div class="contract-preview-sheet__party-fields">
                                                <div
                                                    v-for="field in party.fields"
                                                    :key="`${party.key}-${field.title}`"
                                                    class="contract-preview-sheet__party-field"
                                                >
                                                    <p class="contract-preview-sheet__party-field-label">
                                                        {{ field.title }}
                                                    </p>
                                                    <p class="contract-preview-sheet__party-field-text">
                                                        {{ field.text }}
                                                    </p>
                                                </div>
                                            </div>
                                        </article>
                                    </div>
                                </section>

                                <section
                                    v-if="page.showSigningAssets"
                                    class="contract-preview-sheet__signing"
                                >
                                    <div
                                        v-if="signaturePreviewUrl"
                                        class="contract-preview-sheet__signing-block"
                                    >
                                        <p class="contract-preview-sheet__signing-label">
                                            Подпись
                                        </p>
                                        <div class="contract-preview-sheet__signing-frame">
                                            <img
                                                :src="signaturePreviewUrl"
                                                alt="Подпись"
                                                class="contract-preview-sheet__signature-image"
                                            >
                                        </div>
                                    </div>

                                    <div
                                        v-if="stampPreviewUrl"
                                        class="contract-preview-sheet__signing-block"
                                    >
                                        <p class="contract-preview-sheet__signing-label">
                                            Печать
                                        </p>
                                        <div class="contract-preview-sheet__signing-frame">
                                            <img
                                                :src="stampPreviewUrl"
                                                alt="Печать"
                                                class="contract-preview-sheet__stamp-image"
                                            >
                                        </div>
                                    </div>
                                </section>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

    import type {
        ContractDocumentPayload,
        ContractPayloadBodyItem,
        ContractPayloadBodySection,
        ContractPayloadParty,
    } from '@/entities/contracts/lib/types';

    interface PreviewSection extends ContractPayloadBodySection {
        items: ContractPayloadBodyItem[];
    }

    interface PreviewPage {
        key: string;
        includeHeader: boolean;
        sections: PreviewSection[];
        parties: ContractPayloadParty[];
        showSigningAssets: boolean;
        remainingHeight: number;
    }

    const MM_TO_PX = 96 / 25.4;
    const mmToPx = (value: number) => value * MM_TO_PX;
    const toMm = (value: number) => `${value}mm`;

    const PAGE_WIDTH_MM = 210;
    const PAGE_HEIGHT_MM = 297;
    const PAGE_PADDING_TOP_MM = 14;
    const PAGE_PADDING_SIDE_MM = 12;
    const PAGE_PADDING_BOTTOM_MM = 14;
    const PAGE_GAP_MM = 5;
    const FIRST_PAGE_CAPACITY_MM = 201;
    const NEXT_PAGE_CAPACITY_MM = 241;
    const SECTION_BASE_HEIGHT_MM = 18.5;
    const SECTION_HEADER_HEIGHT_MM = 10;
    const BODY_TEXT_LINE_HEIGHT_MM = 6.9;
    const BODY_TEXT_BLOCK_GAP_MM = 3.2;
    const SECTION_ITEM_TOP_GAP_MM = 4.8;
    const ITEM_TITLE_LINE_HEIGHT_MM = 6.35;
    const ITEM_TEXT_LINE_HEIGHT_MM = 6.6;
    const PARTY_CARD_BASE_HEIGHT_MM = 20.1;
    const PARTY_FIELD_TOP_GAP_MM = 6.9;
    const PARTY_FIELD_LINE_HEIGHT_MM = 5.8;
    const PARTIES_SECTION_BASE_HEIGHT_MM = 31.8;
    const SIGNING_ASSETS_HEIGHT_MM = 63.5;

    const PAGE_WIDTH_PX = mmToPx(PAGE_WIDTH_MM);
    const PAGE_HEIGHT_PX = mmToPx(PAGE_HEIGHT_MM);
    const PAGE_GAP_PX = mmToPx(PAGE_GAP_MM);

    const props = defineProps<{
        payload: ContractDocumentPayload;
        signatureFile?: File | null;
        attachmentFile?: File | null;
    }>();

    const signaturePreviewUrl = ref('');
    const stampPreviewUrl = ref('');
    const previewViewportRef = ref<HTMLElement | null>(null);
    const previewViewportWidth = ref(PAGE_WIDTH_PX);
    const activePageIndex = ref(0);

    let resizeObserver: ResizeObserver | null = null;

    const revokeObjectUrl = (value: string) => {
        if (!value) {
            return;
        }

        URL.revokeObjectURL(value);
    };

    const updateViewportWidth = () => {
        previewViewportWidth.value = previewViewportRef.value?.getBoundingClientRect().width ?? PAGE_WIDTH_PX;
    };

    watch(() => props.signatureFile, (file) => {
        revokeObjectUrl(signaturePreviewUrl.value);
        signaturePreviewUrl.value = '';

        if (file && file.type.startsWith('image/')) {
            signaturePreviewUrl.value = URL.createObjectURL(file);
        }
    }, { immediate: true });

    watch(() => props.attachmentFile, (file) => {
        revokeObjectUrl(stampPreviewUrl.value);
        stampPreviewUrl.value = '';

        if (file && file.type.startsWith('image/')) {
            stampPreviewUrl.value = URL.createObjectURL(file);
        }
    }, { immediate: true });

    onMounted(() => {
        updateViewportWidth();

        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(() => {
                updateViewportWidth();
            });

            if (previewViewportRef.value) {
                resizeObserver.observe(previewViewportRef.value);
            }
        }
    });

    onBeforeUnmount(() => {
        revokeObjectUrl(signaturePreviewUrl.value);
        revokeObjectUrl(stampPreviewUrl.value);
        resizeObserver?.disconnect();
    });

    const formattedDate = computed(() => {
        if (!props.payload.documentDate) {
            return '';
        }

        const [year, month, day] = props.payload.documentDate.split('-');

        if (!year || !month || !day) {
            return props.payload.documentDate;
        }

        return `${day}.${month}.${year}`;
    });

    const documentPlace = computed(() => {
        return props.payload.documentPlace;
    });

    const firstParty = computed(() => {
        return props.payload.firstParty || 'Лицо 1 не указано';
    });

    const secondParty = computed(() => {
        return props.payload.secondParty || 'Лицо 2 не указано';
    });

    const visibleBodySections = computed<PreviewSection[]>(() => {
        return props.payload.body
            .map((section) => {
                const visibleItems = section.items.filter((item) => item.text.trim().length > 0);
                const hasSectionText = section.text.trim().length > 0;

                return {
                    ...section,
                    items: visibleItems,
                    hasContent: hasSectionText || visibleItems.length > 0,
                };
            })
            .filter((section) => section.hasContent)
            .map(({ hasContent, ...section }) => section);
    });

    const visibleParties = computed(() => {
        return props.payload.parties
            .map((party) => ({
                ...party,
                fields: party.fields.filter((field) => field.text.trim().length > 0),
            }))
            .filter((party) => party.fields.length > 0);
    });

    const hasSigningAssets = computed(() => {
        return Boolean(signaturePreviewUrl.value || stampPreviewUrl.value);
    });

    const estimateLines = (text: string, charsPerLine: number) => {
        return Math.max(1, Math.ceil(text.trim().length / charsPerLine));
    };

    const estimateSectionHeaderHeight = () => {
        return mmToPx(SECTION_HEADER_HEIGHT_MM);
    };

    const estimateSectionTextHeight = (text: string) => {
        if (!text.trim()) {
            return 0;
        }

        return mmToPx(estimateLines(text, 88) * BODY_TEXT_LINE_HEIGHT_MM + BODY_TEXT_BLOCK_GAP_MM);
    };

    const estimateSectionItemHeight = (item: ContractPayloadBodyItem) => {
        let height = mmToPx(SECTION_ITEM_TOP_GAP_MM);
        height += mmToPx(estimateLines(item.title, 72) * ITEM_TITLE_LINE_HEIGHT_MM);
        height += mmToPx(estimateLines(item.text, 88) * ITEM_TEXT_LINE_HEIGHT_MM);
        return height;
    };

    const estimateSectionHeight = (section: PreviewSection) => {
        let height = mmToPx(SECTION_BASE_HEIGHT_MM);

        if (section.text) {
            height += estimateSectionTextHeight(section.text);
        }

        section.items.forEach((item) => {
            height += estimateSectionItemHeight(item);
        });

        return height;
    };

    const estimatePartyCardHeight = (party: ContractPayloadParty) => {
        return mmToPx(PARTY_CARD_BASE_HEIGHT_MM) + party.fields.reduce((total, field) => {
            return total + mmToPx(PARTY_FIELD_TOP_GAP_MM + estimateLines(field.text, 46) * PARTY_FIELD_LINE_HEIGHT_MM);
        }, 0);
    };

    const estimatePartiesHeight = (parties: ContractPayloadParty[]) => {
        if (!parties.length) {
            return 0;
        }

        if (parties.length === 1) {
            const [firstPartyEntry] = parties;
            return firstPartyEntry ? mmToPx(PARTIES_SECTION_BASE_HEIGHT_MM) + estimatePartyCardHeight(firstPartyEntry) : 0;
        }

        return mmToPx(PARTIES_SECTION_BASE_HEIGHT_MM) + Math.max(...parties.map(estimatePartyCardHeight));
    };

    const estimateSigningAssetsHeight = () => {
        if (!hasSigningAssets.value) {
            return 0;
        }

        return mmToPx(SIGNING_ASSETS_HEIGHT_MM);
    };

    const createPage = (index: number, includeHeader: boolean): PreviewPage => {
        return {
            key: `page-${index}`,
            includeHeader,
            sections: [],
            parties: [],
            showSigningAssets: false,
            remainingHeight: includeHeader ? mmToPx(FIRST_PAGE_CAPACITY_MM) : mmToPx(NEXT_PAGE_CAPACITY_MM),
        };
    };

    const pageHasContent = (page: PreviewPage) => {
        return page.includeHeader || page.sections.length > 0 || page.parties.length > 0 || page.showSigningAssets;
    };

    const previewPages = computed<PreviewPage[]>(() => {
        const pages: PreviewPage[] = [];
        let pageIndex = 1;
        let currentPage = createPage(pageIndex, true);

        const pushCurrentPage = () => {
            pages.push({ ...currentPage });
            pageIndex += 1;
            currentPage = createPage(pageIndex, false);
        };

        visibleBodySections.value.forEach((section) => {
            const sectionItemsQueue = [...section.items];
            let sectionText = section.text;
            let isFirstChunk = true;

            while (isFirstChunk || sectionItemsQueue.length > 0) {
                let chunkHeight = estimateSectionHeaderHeight();
                const chunk: PreviewSection = {
                    ...section,
                    text: '',
                    items: [],
                };

                if (pageHasContent(currentPage) && chunkHeight > currentPage.remainingHeight) {
                    pushCurrentPage();
                }

                if (isFirstChunk && sectionText) {
                    const textHeight = estimateSectionTextHeight(sectionText);

                    if (chunkHeight + textHeight <= currentPage.remainingHeight || !pageHasContent(currentPage)) {
                        chunk.text = sectionText;
                        chunkHeight += textHeight;
                        sectionText = '';
                    }
                }

                while (sectionItemsQueue.length > 0) {
                    const nextItem = sectionItemsQueue[0];

                    if (!nextItem) {
                        break;
                    }

                    const itemHeight = estimateSectionItemHeight(nextItem);

                    if (chunkHeight + itemHeight <= currentPage.remainingHeight) {
                        chunk.items.push(nextItem);
                        chunkHeight += itemHeight;
                        sectionItemsQueue.shift();
                        continue;
                    }

                    break;
                }

                const isEmptyChunk = !chunk.text && chunk.items.length === 0;

                if (isEmptyChunk && pageHasContent(currentPage)) {
                    pushCurrentPage();
                    continue;
                }

                if (isEmptyChunk && sectionItemsQueue.length > 0) {
                    const forcedItem = sectionItemsQueue.shift();

                    if (forcedItem) {
                        chunk.items.push(forcedItem);
                        chunkHeight += estimateSectionItemHeight(forcedItem);
                    }
                }

                currentPage.sections.push(chunk);
                currentPage.remainingHeight -= chunkHeight;
                isFirstChunk = false;

                if (sectionItemsQueue.length > 0) {
                    pushCurrentPage();
                }
            }
        });

        const appendBlockToPage = (height: number, apply: (page: PreviewPage) => void) => {
            if (!height) {
                return;
            }

            if (height > currentPage.remainingHeight && pageHasContent(currentPage)) {
                pushCurrentPage();
            }

            apply(currentPage);
            currentPage.remainingHeight -= height;
        };

        appendBlockToPage(estimatePartiesHeight(visibleParties.value), (page) => {
            page.parties = visibleParties.value;
        });

        appendBlockToPage(estimateSigningAssetsHeight(), (page) => {
            page.showSigningAssets = true;
        });

        if (!pages.length || pageHasContent(currentPage)) {
            pages.push({ ...currentPage });
        }

        return pages;
    });

    watch(previewPages, (pages) => {
        if (activePageIndex.value > pages.length - 1) {
            activePageIndex.value = Math.max(0, pages.length - 1);
        }
    }, { immediate: true });

    const pageScale = computed(() => {
        return Math.min(1, previewViewportWidth.value / PAGE_WIDTH_PX);
    });

    const scaledPageWidth = computed(() => {
        return PAGE_WIDTH_PX * pageScale.value;
    });

    const scaledPageHeight = computed(() => {
        return PAGE_HEIGHT_PX * pageScale.value;
    });

    const viewportStyle = computed(() => {
        return {
            width: '100%',
        };
    });

    const slideStyle = computed(() => {
        return {
            width: `${previewViewportWidth.value}px`,
            marginRight: `${PAGE_GAP_PX}px`,
        };
    });

    const pageFrameStyle = computed(() => {
        return {
            width: `${scaledPageWidth.value}px`,
            height: `${scaledPageHeight.value}px`,
        };
    });

    const sheetStyle = computed(() => {
        return {
            width: toMm(PAGE_WIDTH_MM),
            minHeight: toMm(PAGE_HEIGHT_MM),
            padding: `${toMm(PAGE_PADDING_TOP_MM)} ${toMm(PAGE_PADDING_SIDE_MM)} ${toMm(PAGE_PADDING_BOTTOM_MM)}`,
            transform: `scale(${pageScale.value})`,
            transformOrigin: 'top left',
        };
    });

    const trackStyle = computed(() => {
        return {
            width: `${previewPages.value.length * (scaledPageWidth.value + PAGE_GAP_PX)}px`,
            transform: `translateX(-${activePageIndex.value * (scaledPageWidth.value + PAGE_GAP_PX)}px)`,
        };
    });

    const goToPage = (index: number) => {
        activePageIndex.value = Math.min(Math.max(index, 0), previewPages.value.length - 1);
    };

    const goToPreviousPage = () => {
        goToPage(activePageIndex.value - 1);
    };

    const goToNextPage = () => {
        goToPage(activePageIndex.value + 1);
    };
</script>

<style scoped>
    .contract-preview-sheet {
        --sheet-font-body: 11pt;
        --sheet-font-small: 9pt;
        --sheet-font-label: 8pt;
        --sheet-font-title: 22pt;
        --sheet-font-section: 14pt;
        --sheet-font-subtitle: 12pt;
        --sheet-line-body: 16pt;
        --sheet-line-tight: 14pt;
        --sheet-line-section: 18pt;
        --sheet-radius: 3mm;
        --sheet-gap-xxs: 1mm;
        --sheet-gap-xs: 2mm;
        --sheet-gap-sm: 3mm;
        --sheet-gap-md: 4mm;
        --sheet-gap-lg: 6mm;
        box-sizing: border-box;
        font-family: inherit;
    }

    .contract-preview-sheet__header {
        border-bottom: 0.2mm solid rgba(0, 0, 0, 0.1);
        padding-bottom: 4mm;
        text-align: center;
    }

    .contract-preview-sheet__meta {
        color: rgba(0, 0, 0, 0.7);
        font-size: var(--sheet-font-small);
        line-height: var(--sheet-line-tight);
    }

    .contract-preview-sheet__title {
        margin-top: 3mm;
        color: #000;
        font-size: var(--sheet-font-title);
        font-weight: 700;
        line-height: 24pt;
        letter-spacing: -0.03em;
        text-transform: uppercase;
    }

    .contract-preview-sheet__intro {
        padding-top: 4mm;
    }

    .contract-preview-sheet__paragraph {
        color: rgba(0, 0, 0, 0.82);
        font-size: var(--sheet-font-body);
        line-height: var(--sheet-line-body);
    }

    .contract-preview-sheet__sections {
        display: grid;
        gap: 5mm;
        padding-top: 5mm;
    }

    .contract-preview-sheet__section {
        display: grid;
        gap: 2.5mm;
    }

    .contract-preview-sheet__section-header {
        border-bottom: 0.2mm solid rgba(0, 0, 0, 0.1);
        padding-bottom: 2mm;
    }

    .contract-preview-sheet__section-title {
        color: #000;
        font-size: var(--sheet-font-section);
        font-weight: 700;
        line-height: var(--sheet-line-section);
    }

    .contract-preview-sheet__section-text {
        color: rgba(0, 0, 0, 0.82);
        font-size: var(--sheet-font-body);
        line-height: 15.5pt;
    }

    .contract-preview-sheet__items {
        display: grid;
        gap: 2.5mm;
    }

    .contract-preview-sheet__item {
        display: grid;
        grid-template-columns: 15mm minmax(0, 1fr);
        gap: 2mm;
    }

    .contract-preview-sheet__item-number {
        color: #000;
        font-size: 10pt;
        font-weight: 700;
        line-height: var(--sheet-line-tight);
    }

    .contract-preview-sheet__item-title {
        color: #000;
        font-size: var(--sheet-font-body);
        font-weight: 600;
        line-height: var(--sheet-line-tight);
    }

    .contract-preview-sheet__item-text {
        margin-top: 1mm;
        color: rgba(0, 0, 0, 0.76);
        font-size: var(--sheet-font-body);
        line-height: var(--sheet-line-tight);
    }

    .contract-preview-sheet__parties {
        border-top: 0.2mm solid rgba(0, 0, 0, 0.1);
        padding-top: 6mm;
    }

    .contract-preview-sheet__parties-title {
        color: #000;
        font-size: var(--sheet-font-section);
        font-weight: 700;
        line-height: var(--sheet-line-section);
    }

    .contract-preview-sheet__party-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 4mm;
        margin-top: 4mm;
    }

    .contract-preview-sheet__party-card {
        border: 0.2mm solid rgba(0, 0, 0, 0.1);
        border-radius: var(--sheet-radius);
        background: #fff;
        padding: 4mm;
    }

    .contract-preview-sheet__party-title {
        color: #000;
        font-size: var(--sheet-font-subtitle);
        font-weight: 700;
        line-height: 15pt;
    }

    .contract-preview-sheet__party-fields {
        display: grid;
        gap: 2.5mm;
        margin-top: 3mm;
    }

    .contract-preview-sheet__party-field {
        display: grid;
        gap: 1mm;
    }

    .contract-preview-sheet__party-field-label {
        color: rgba(0, 0, 0, 0.45);
        font-size: var(--sheet-font-label);
        line-height: 10pt;
        letter-spacing: 0.16em;
        text-transform: uppercase;
    }

    .contract-preview-sheet__party-field-text {
        color: rgba(0, 0, 0, 0.82);
        font-size: 10pt;
        line-height: 14pt;
        white-space: pre-line;
    }

    .contract-preview-sheet__signing {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 5mm;
        border-top: 0.2mm solid rgba(0, 0, 0, 0.1);
        padding-top: 6mm;
    }

    .contract-preview-sheet__signing-block {
        display: grid;
        gap: 3.5mm;
    }

    .contract-preview-sheet__signing-label {
        color: rgba(0, 0, 0, 0.45);
        font-size: var(--sheet-font-label);
        line-height: 10pt;
        letter-spacing: 0.16em;
        text-transform: uppercase;
    }

    .contract-preview-sheet__signing-frame {
        border: 0.2mm dashed rgba(0, 0, 0, 0.15);
        border-radius: var(--sheet-radius);
        background: #fff;
        padding: 4mm;
    }

    .contract-preview-sheet__signature-image {
        display: block;
        width: auto;
        height: 24mm;
        object-fit: contain;
    }

    .contract-preview-sheet__stamp-image {
        display: block;
        width: auto;
        height: 29mm;
        object-fit: contain;
    }
</style>
