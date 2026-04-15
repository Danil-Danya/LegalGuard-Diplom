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
                                    v-if="page.signingParties.length"
                                    class="contract-preview-sheet__signing"
                                >
                                    <div
                                        v-if="false"
                                        class="contract-preview-sheet__signing-block"
                                    >
                                        <p class="contract-preview-sheet__signing-label">
                                            Подпись
                                        </p>
                                        <div class="contract-preview-sheet__signing-frame">
                                            <img
                                                :src="undefined"
                                                alt="Подпись"
                                                class="contract-preview-sheet__signature-image"
                                            >
                                        </div>
                                    </div>

                                    <div
                                        v-if="false"
                                        class="contract-preview-sheet__signing-block"
                                    >
                                        <p class="contract-preview-sheet__signing-label">
                                            Печать
                                        </p>
                                        <div class="contract-preview-sheet__signing-frame">
                                            <img
                                                :src="undefined"
                                                alt="Печать"
                                                class="contract-preview-sheet__stamp-image"
                                            >
                                        </div>
                                    </div>

                                    <article
                                        v-for="party in page.signingParties"
                                        :key="`${party.key}-signing`"
                                        class="contract-preview-sheet__signing-party"
                                    >
                                        <h4 class="contract-preview-sheet__signing-party-title">
                                            {{ party.title }}
                                        </h4>

                                        <div class="contract-preview-sheet__signing-assets">
                                            <div
                                                v-if="resolvePartySignaturePreviewUrl(party.key)"
                                                class="contract-preview-sheet__signing-block"
                                            >
                                                <p class="contract-preview-sheet__signing-label">
                                                    {{ party.signing.signatureTitle || 'Подпись' }}
                                                </p>
                                                <div class="contract-preview-sheet__signing-frame">
                                                    <img
                                                        :src="resolvePartySignaturePreviewUrl(party.key) || undefined"
                                                        :alt="party.signing.signatureTitle || 'Подпись'"
                                                        class="contract-preview-sheet__signature-image"
                                                    >
                                                </div>
                                            </div>

                                            <div
                                                v-if="resolvePartyStampPreviewUrl(party.key)"
                                                class="contract-preview-sheet__signing-block"
                                            >
                                                <p class="contract-preview-sheet__signing-label">
                                                    {{ party.signing.stampTitle || 'Печать' }}
                                                </p>
                                                <div class="contract-preview-sheet__signing-frame">
                                                    <img
                                                        :src="resolvePartyStampPreviewUrl(party.key) || undefined"
                                                        :alt="party.signing.stampTitle || 'Печать'"
                                                        class="contract-preview-sheet__stamp-image"
                                                    >
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                </section>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div
            aria-hidden="true"
            class="contract-preview-sheet__measure-root"
        >
            <article
                class="contract-preview-sheet contract-preview-sheet--measure bg-white text-black"
                :style="measurementSheetStyle"
            >
                <div ref="measurementHostRef" />
            </article>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

    import type {
        ContractDocumentPayload,
        ContractPartyAssetSourcesMap,
        ContractPartyFilesMap,
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
        signingParties: ContractPayloadParty[];
        remainingHeight: number;
    }

    interface PartyPreviewUrls {
        signatureUrl: string;
        stampUrl: string;
    }

    const MM_TO_PX = 96 / 25.4;
    const PT_TO_MM = 25.4 / 72;
    const mmToPx = (value: number) => value * MM_TO_PX;
    const toMm = (value: number) => `${value}mm`;
    const ptToPx = (value: number) => mmToPx(value * PT_TO_MM);

    const PAGE_WIDTH_MM = 210;
    const PAGE_HEIGHT_MM = 297;
    const PAGE_PADDING_TOP_MM = 14;
    const PAGE_PADDING_SIDE_MM = 12;
    const PAGE_PADDING_BOTTOM_MM = 14;
    const PAGE_GAP_MM = 5;

    const PAGE_WIDTH_PX = mmToPx(PAGE_WIDTH_MM);
    const PAGE_HEIGHT_PX = mmToPx(PAGE_HEIGHT_MM);
    const PAGE_GAP_PX = mmToPx(PAGE_GAP_MM);
    const PAGE_CONTENT_HEIGHT_PX = mmToPx(PAGE_HEIGHT_MM - PAGE_PADDING_TOP_MM - PAGE_PADDING_BOTTOM_MM);
    const SECTIONS_PADDING_TOP_PX = mmToPx(5);
    const SECTIONS_GAP_PX = mmToPx(5);

    const props = withDefaults(defineProps<{
        payload: ContractDocumentPayload;
        partyFiles?: ContractPartyFilesMap;
        partyAssetSources?: ContractPartyAssetSourcesMap;
    }>(), {
        partyFiles: () => ({}),
        partyAssetSources: () => ({}),
    });

    const previewViewportRef = ref<HTMLElement | null>(null);
    const measurementHostRef = ref<HTMLElement | null>(null);
    const previewViewportWidth = ref(PAGE_WIDTH_PX);
    const activePageIndex = ref(0);
    const localPartyPreviewUrls = ref<Record<string, PartyPreviewUrls>>({});
    const measurementVersion = ref(0);

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

    const refreshMeasurements = () => {
        measurementVersion.value += 1;
    };

    const clearPartyPreviewUrls = () => {
        Object.values(localPartyPreviewUrls.value).forEach((entry) => {
            revokeObjectUrl(entry.signatureUrl);
            revokeObjectUrl(entry.stampUrl);
        });

        localPartyPreviewUrls.value = {};
    };

    watch(() => props.partyFiles, (partyFiles) => {
        clearPartyPreviewUrls();

        const nextUrls: Record<string, PartyPreviewUrls> = {};

        Object.entries(partyFiles || {}).forEach(([partyKey, files]) => {
            nextUrls[partyKey] = {
                signatureUrl: files.signatureFile && files.signatureFile.type.startsWith('image/')
                    ? URL.createObjectURL(files.signatureFile)
                    : '',
                stampUrl: files.stampFile && files.stampFile.type.startsWith('image/')
                    ? URL.createObjectURL(files.stampFile)
                    : '',
            };
        });

        localPartyPreviewUrls.value = nextUrls;
    }, { immediate: true, deep: true });

    onMounted(() => {
        updateViewportWidth();
        refreshMeasurements();

        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(() => {
                updateViewportWidth();
            });

            if (previewViewportRef.value) {
                resizeObserver.observe(previewViewportRef.value);
            }
        }

        if (typeof document !== 'undefined' && 'fonts' in document) {
            void document.fonts.ready.then(() => {
                refreshMeasurements();
            });
        }
    });

    onBeforeUnmount(() => {
        clearPartyPreviewUrls();
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

    const resolvePartySignaturePreviewUrl = (partyKey: string) => {
        return props.partyAssetSources?.[partyKey]?.signatureSrc || localPartyPreviewUrls.value[partyKey]?.signatureUrl || '';
    };

    const resolvePartyStampPreviewUrl = (partyKey: string) => {
        return props.partyAssetSources?.[partyKey]?.stampSrc || localPartyPreviewUrls.value[partyKey]?.stampUrl || '';
    };

    const partyHasSigningAssets = (party: ContractPayloadParty) => {
        return Boolean(resolvePartySignaturePreviewUrl(party.key) || resolvePartyStampPreviewUrl(party.key));
    };

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
            .filter((party) => party.fields.length > 0 || partyHasSigningAssets(party));
    });

    const visibleSigningParties = computed(() => {
        return visibleParties.value.filter((party) => partyHasSigningAssets(party));
    });

    const createElement = <K extends keyof HTMLElementTagNameMap>(
        tag: K,
        className?: string,
        text?: string,
    ) => {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (typeof text === 'string') {
            element.textContent = text;
        }

        return element;
    };

    const measureBlockHeight = (builder: () => HTMLElement) => {
        const host = measurementHostRef.value;

        if (!host || typeof document === 'undefined') {
            return 0;
        }

        host.replaceChildren();

        const block = builder();
        host.appendChild(block);

        const height = block.getBoundingClientRect().height;
        host.replaceChildren();

        return height;
    };

    const createSectionItemNode = (item: ContractPayloadBodyItem) => {
        const itemNode = createElement('article', 'contract-preview-sheet__item');
        const itemNumberNode = createElement('p', 'contract-preview-sheet__item-number', item.number);
        const itemBodyNode = createElement('div');
        const itemTitleNode = createElement('p', 'contract-preview-sheet__item-title', item.title);
        const itemTextNode = createElement('p', 'contract-preview-sheet__item-text', item.text);

        itemBodyNode.append(itemTitleNode, itemTextNode);
        itemNode.append(itemNumberNode, itemBodyNode);

        return itemNode;
    };

    const createSectionChunkNode = (
        section: PreviewSection,
        text: string,
        items: ContractPayloadBodyItem[],
    ) => {
        const sectionNode = createElement('article', 'contract-preview-sheet__section');
        const sectionHeaderNode = createElement('div', 'contract-preview-sheet__section-header');
        const sectionTitleNode = createElement('h3', 'contract-preview-sheet__section-title', `${section.number}. ${section.title}`);

        sectionHeaderNode.append(sectionTitleNode);
        sectionNode.append(sectionHeaderNode);

        if (text.trim()) {
            sectionNode.append(createElement('p', 'contract-preview-sheet__section-text', text));
        }

        if (items.length) {
            const itemsNode = createElement('div', 'contract-preview-sheet__items');

            items.forEach((item) => {
                itemsNode.append(createSectionItemNode(item));
            });

            sectionNode.append(itemsNode);
        }

        return sectionNode;
    };

    const createPartyCardNode = (party: ContractPayloadParty) => {
        const partyNode = createElement('article', 'contract-preview-sheet__party-card');
        const partyTitleNode = createElement('h4', 'contract-preview-sheet__party-title', party.title);
        const partyFieldsNode = createElement('div', 'contract-preview-sheet__party-fields');

        party.fields.forEach((field) => {
            const fieldNode = createElement('div', 'contract-preview-sheet__party-field');
            fieldNode.append(
                createElement('p', 'contract-preview-sheet__party-field-label', field.title),
                createElement('p', 'contract-preview-sheet__party-field-text', field.text),
            );
            partyFieldsNode.append(fieldNode);
        });

        partyNode.append(partyTitleNode, partyFieldsNode);

        return partyNode;
    };

    const createSigningPartyNode = (party: ContractPayloadParty) => {
        const signingPartyNode = createElement('article', 'contract-preview-sheet__signing-party');
        const signingPartyTitleNode = createElement('h4', 'contract-preview-sheet__signing-party-title', party.title);
        const signingAssetsNode = createElement('div', 'contract-preview-sheet__signing-assets');

        if (resolvePartySignaturePreviewUrl(party.key)) {
            const signatureNode = createElement('div', 'contract-preview-sheet__signing-block');
            const signatureFrameNode = createElement('div', 'contract-preview-sheet__signing-frame');
            const signatureImageNode = createElement('img', 'contract-preview-sheet__signature-image');
            signatureImageNode.alt = party.signing.signatureTitle || 'Подпись';
            signatureFrameNode.append(signatureImageNode);
            signatureNode.append(
                createElement('p', 'contract-preview-sheet__signing-label', party.signing.signatureTitle || 'Подпись'),
                signatureFrameNode,
            );
            signingAssetsNode.append(signatureNode);
        }

        if (resolvePartyStampPreviewUrl(party.key)) {
            const stampNode = createElement('div', 'contract-preview-sheet__signing-block');
            const stampFrameNode = createElement('div', 'contract-preview-sheet__signing-frame');
            const stampImageNode = createElement('img', 'contract-preview-sheet__stamp-image');
            stampImageNode.alt = party.signing.stampTitle || 'Печать';
            stampFrameNode.append(stampImageNode);
            stampNode.append(
                createElement('p', 'contract-preview-sheet__signing-label', party.signing.stampTitle || 'Печать'),
                stampFrameNode,
            );
            signingAssetsNode.append(stampNode);
        }

        signingPartyNode.append(signingPartyTitleNode, signingAssetsNode);

        return signingPartyNode;
    };

    const measureHeaderIntroHeight = () => {
        return measureBlockHeight(() => {
            const wrapper = createElement('div');
            const headerNode = createElement('div', 'contract-preview-sheet__header');
            const headerMetaText = [documentPlace.value, formattedDate.value]
                .filter(Boolean)
                .join(', ');

            if (headerMetaText) {
                headerNode.append(createElement('p', 'contract-preview-sheet__meta', headerMetaText));
            }

            headerNode.append(createElement('h2', 'contract-preview-sheet__title', props.payload.title));

            const introNode = createElement('section', 'contract-preview-sheet__intro');
            introNode.append(
                createElement(
                    'p',
                    'contract-preview-sheet__paragraph',
                    `${firstParty.value} и ${secondParty.value} заключили настоящий документ на условиях, указанных ниже.`,
                ),
            );

            wrapper.append(headerNode, introNode);

            return wrapper;
        });
    };

    const measureSectionChunkHeight = (
        section: PreviewSection,
        text: string,
        items: ContractPayloadBodyItem[],
    ) => {
        return measureBlockHeight(() => createSectionChunkNode(section, text, items));
    };

    const measurePartiesHeight = (parties: ContractPayloadParty[]) => {
        if (!parties.length) {
            return 0;
        }

        return measureBlockHeight(() => {
            const sectionNode = createElement('section', 'contract-preview-sheet__parties');
            const titleNode = createElement('h3', 'contract-preview-sheet__parties-title', 'Стороны документа');
            const gridNode = createElement('div', 'contract-preview-sheet__party-grid');

            parties.forEach((party) => {
                gridNode.append(createPartyCardNode(party));
            });

            sectionNode.append(titleNode, gridNode);

            return sectionNode;
        });
    };

    const measureSigningPartiesHeight = (parties: ContractPayloadParty[]) => {
        if (!parties.length) {
            return 0;
        }

        return measureBlockHeight(() => {
            const sectionNode = createElement('section', 'contract-preview-sheet__signing');

            parties.forEach((party) => {
                sectionNode.append(createSigningPartyNode(party));
            });

            return sectionNode;
        });
    };

    const createPage = (index: number, includeHeader: boolean): PreviewPage => {
        const headerIntroHeight = includeHeader ? measureHeaderIntroHeight() : 0;

        return {
            key: `page-${index}`,
            includeHeader,
            sections: [],
            parties: [],
            signingParties: [],
            remainingHeight: Math.max(0, PAGE_CONTENT_HEIGHT_PX - headerIntroHeight),
        };
    };

    const pageHasContent = (page: PreviewPage) => {
        return page.includeHeader || page.sections.length > 0 || page.parties.length > 0 || page.signingParties.length > 0;
    };

    const previewPages = computed<PreviewPage[]>(() => {
        measurementVersion.value;

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
                const chunk: PreviewSection = {
                    ...section,
                    text: '',
                    items: [],
                };
                let chunkHeight = measureSectionChunkHeight(section, chunk.text, chunk.items);

                if (isFirstChunk && sectionText.trim()) {
                    const textHeight = measureSectionChunkHeight(section, sectionText, []);
                    const sectionPlacementOffset = currentPage.sections.length ? SECTIONS_GAP_PX : SECTIONS_PADDING_TOP_PX;
                    const fitsTextChunk = textHeight + sectionPlacementOffset <= currentPage.remainingHeight;
                    const shouldForceText = !pageHasContent(currentPage);

                    if (fitsTextChunk || shouldForceText) {
                        chunk.text = sectionText;
                        chunkHeight = textHeight;
                        sectionText = '';
                    }
                }

                while (sectionItemsQueue.length > 0) {
                    const nextItem = sectionItemsQueue[0];

                    if (!nextItem) {
                        break;
                    }

                    const nextChunkItems = [...chunk.items, nextItem];
                    const nextChunkHeight = measureSectionChunkHeight(section, chunk.text, nextChunkItems);
                    const sectionPlacementOffset = currentPage.sections.length ? SECTIONS_GAP_PX : SECTIONS_PADDING_TOP_PX;
                    const fitsNextChunk = nextChunkHeight + sectionPlacementOffset <= currentPage.remainingHeight;
                    const shouldForceItem = !pageHasContent(currentPage) && chunk.items.length === 0 && !chunk.text;

                    if (fitsNextChunk || shouldForceItem) {
                        chunk.items = nextChunkItems;
                        chunkHeight = nextChunkHeight;
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
                        chunkHeight = measureSectionChunkHeight(section, chunk.text, chunk.items);
                    }
                }

                const sectionPlacementOffset = currentPage.sections.length ? SECTIONS_GAP_PX : SECTIONS_PADDING_TOP_PX;

                if (chunkHeight + sectionPlacementOffset > currentPage.remainingHeight && pageHasContent(currentPage)) {
                    pushCurrentPage();
                }

                currentPage.sections.push(chunk);
                currentPage.remainingHeight -= sectionPlacementOffset + chunkHeight;
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

        appendBlockToPage(measurePartiesHeight(visibleParties.value), (page) => {
            page.parties = visibleParties.value;
        });

        appendBlockToPage(measureSigningPartiesHeight(visibleSigningParties.value), (page) => {
            page.signingParties = visibleSigningParties.value;
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

    const measurementSheetStyle = computed(() => {
        return {
            width: toMm(PAGE_WIDTH_MM),
            minHeight: 'auto',
            padding: `${toMm(PAGE_PADDING_TOP_MM)} ${toMm(PAGE_PADDING_SIDE_MM)} ${toMm(PAGE_PADDING_BOTTOM_MM)}`,
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

    .contract-preview-sheet__measure-root {
        position: fixed;
        top: 0;
        left: -99999px;
        visibility: hidden;
        pointer-events: none;
    }

    .contract-preview-sheet--measure {
        position: static;
        box-shadow: none;
        transform: none !important;
    }

    .contract-preview-sheet__header {
        border-bottom: 0.2mm solid rgba(0, 0, 0, 0.1);
        padding-bottom: 4mm;
        text-align: center;
    }

    .contract-preview-sheet__meta {
        color: rgba(0, 0, 0, 0.7);
        font-size: var(--sheet-font-small);
        line-height: 13pt;
    }

    .contract-preview-sheet__title {
        margin-top: 3mm;
        color: #000;
        font-size: var(--sheet-font-title);
        font-weight: 700;
        line-height: 24pt;
        letter-spacing: -0.03em;
        text-transform: uppercase;
        margin-bottom: 0;
    }

    .contract-preview-sheet__intro {
        padding-top: 4mm;
    }

    .contract-preview-sheet__paragraph {
        margin: 0;
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
        margin: 0;
        color: #000;
        font-size: var(--sheet-font-section);
        font-weight: 700;
        line-height: var(--sheet-line-section);
    }

    .contract-preview-sheet__section-text {
        margin: 0;
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
        margin: 0;
        color: #000;
        font-size: 10pt;
        font-weight: 700;
        line-height: var(--sheet-line-tight);
    }

    .contract-preview-sheet__item-title {
        margin: 0;
        color: #000;
        font-size: var(--sheet-font-body);
        font-weight: 600;
        line-height: var(--sheet-line-tight);
    }

    .contract-preview-sheet__item-text {
        margin-top: 1mm;
        margin-bottom: 0;
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
        margin: 0;
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
        margin: 0;
        color: rgba(0, 0, 0, 0.45);
        font-size: var(--sheet-font-label);
        line-height: 10pt;
        letter-spacing: 0.16em;
        text-transform: uppercase;
    }

    .contract-preview-sheet__party-field-text {
        margin: 0;
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

    .contract-preview-sheet__signing-party {
        border: 0.2mm solid rgba(0, 0, 0, 0.1);
        border-radius: var(--sheet-radius);
        background: #fff;
        padding: 4mm;
    }

    .contract-preview-sheet__signing-party-title {
        margin: 0;
        color: #000;
        font-size: var(--sheet-font-subtitle);
        font-weight: 700;
        line-height: 15pt;
    }

    .contract-preview-sheet__signing-assets {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 4mm;
        margin-top: 3mm;
    }

    .contract-preview-sheet__signing-block {
        display: grid;
        gap: 3.5mm;
    }

    .contract-preview-sheet__signing-label {
        margin: 0;
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
        max-width: 100%;
        height: 26mm;
        object-fit: contain;
    }

    .contract-preview-sheet__stamp-image {
        display: block;
        width: auto;
        max-width: 100%;
        height: 29mm;
        object-fit: contain;
    }
</style>
