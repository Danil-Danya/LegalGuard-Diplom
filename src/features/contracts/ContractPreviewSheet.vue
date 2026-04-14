<template>
    <div class="space-y-[14px]">
        <div class="flex items-center justify-between !mb-[20px]">
            <p class="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                Финальный лист
            </p>
            <p class="text-[13px] text-[var(--color-text-secondary)]">
                Вид документа перед отправкой
            </p>
        </div>

        <div class="overflow-hidden rounded-[18px] border border-black/10 bg-white shadow-[0_24px_80px_rgba(20,20,20,0.08)]">
            <article class="mx-auto min-h-[960px] max-w-[760px] bg-white !p-[34px_30px] max-md:!p-[24px_18px]">
                <div class="flex items-start justify-between gap-[16px] border-b border-black/10 pb-[18px]">
                    <div class="max-w-[560px]">
                        <h2 class="text-[36px] font-semibold leading-[1] tracking-[-0.04em] text-black max-md:text-[28px]">
                            {{ payload.title }}
                        </h2>
                    </div>

                    <div class="text-right text-[12px] uppercase tracking-[0.14em] text-black/45">
                        <p>Документ</p>
                        <p class="!mt-[6px] font-semibold text-black/70">
                            {{ formattedDate }}
                        </p>
                    </div>
                </div>

                <div class="grid gap-[12px] border-b border-black/10 py-[18px] text-[14px] leading-[22px] text-black/70 md:grid-cols-3">
                    <div>
                        <p class="text-[11px] uppercase tracking-[0.16em] text-black/45">Дата</p>
                        <p class="!mt-[6px] text-black">{{ formattedDate }}</p>
                    </div>
                    <div>
                        <p class="text-[11px] uppercase tracking-[0.16em] text-black/45">Лицо 1</p>
                        <p class="!mt-[6px] text-black">{{ firstParty }}</p>
                    </div>
                    <div>
                        <p class="text-[11px] uppercase tracking-[0.16em] text-black/45">Лицо 2</p>
                        <p class="!mt-[6px] text-black">{{ secondParty }}</p>
                    </div>
                </div>

                <section class="space-y-[16px] pt-[22px]">
                    <p class="text-[16px] leading-[28px] text-black/80">
                        Настоящий документ заключен
                        <span class="font-medium text-black">{{ formattedDate }}</span>
                        между
                        <span class="font-medium text-black">{{ firstParty }}</span>
                        и
                        <span class="font-medium text-black">{{ secondParty }}</span>.
                    </p>

                    <p
                        v-for="paragraph in description"
                        :key="paragraph"
                        class="text-[16px] leading-[28px] text-black/80"
                    >
                        {{ paragraph }}
                    </p>
                </section>

                <section class="space-y-[18px] pt-[28px]">
                    <h3 class="text-[24px] font-semibold leading-[30px] text-black">
                        Ключевые разделы
                    </h3>

                    <article
                        v-for="(section, index) in sections"
                        :key="section.title"
                        class="grid gap-[8px] md:grid-cols-[44px_minmax(0,1fr)]"
                    >
                        <p class="text-[32px] font-semibold leading-none tracking-[-0.04em] text-black/20">
                            {{ String(index + 1).padStart(2, '0') }}
                        </p>
                        <div>
                            <h4 class="text-[18px] font-semibold text-black">
                                {{ section.title }}
                            </h4>
                            <p class="!mt-[8px] text-[15px] leading-[26px] text-black/75">
                                {{ section.description || 'Описание раздела будет добавлено на следующем шаге.' }}
                            </p>
                        </div>
                    </article>
                </section>

                <section
                    v-if="hasSigningAssets"
                    class="grid gap-[20px] border-t border-black/10 pt-[28px] md:grid-cols-2"
                >
                    <div v-if="signaturePreviewUrl" class="space-y-[14px]">
                        <p class="text-[11px] uppercase tracking-[0.16em] text-black/45">
                            Подпись
                        </p>
                        <p v-if="signatureLabel" class="text-[16px] font-medium text-black">
                            {{ signatureLabel }}
                        </p>
                        <div class="rounded-[12px] border border-dashed border-black/15 bg-white !p-[14px]">
                            <img
                                :src="signaturePreviewUrl"
                                alt="Подпись"
                                class="h-[92px] w-auto object-contain"
                            >
                        </div>
                    </div>

                    <div v-if="stampPreviewUrl" class="space-y-[14px]">
                        <p class="text-[11px] uppercase tracking-[0.16em] text-black/45">
                            Печать
                        </p>
                        <div class="rounded-[12px] border border-dashed border-black/15 bg-white !p-[14px]">
                            <img
                                :src="stampPreviewUrl"
                                alt="Печать"
                                class="h-[110px] w-auto object-contain"
                            >
                        </div>
                    </div>
                </section>
            </article>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, onBeforeUnmount, ref, watch } from 'vue';

    import type { ContractDocumentPayload } from '@/entities/contracts/lib/types';

    const props = defineProps<{
        payload: ContractDocumentPayload;
        signatureFile?: File | null;
        attachmentFile?: File | null;
    }>();

    const signaturePreviewUrl = ref('');
    const stampPreviewUrl = ref('');

    const revokeObjectUrl = (value: string) => {
        if (!value) {
            return;
        }

        URL.revokeObjectURL(value);
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

    onBeforeUnmount(() => {
        revokeObjectUrl(signaturePreviewUrl.value);
        revokeObjectUrl(stampPreviewUrl.value);
    });

    const formattedDate = computed(() => {
        if (!props.payload.documentDate) {
            return 'Дата не указана';
        }

        const [year, month, day] = props.payload.documentDate.split('-');

        if (!year || !month || !day) {
            return props.payload.documentDate;
        }

        return `${day}.${month}.${year}`;
    });

    const firstParty = computed(() => {
        return props.payload.firstParty || 'Лицо 1 не указано';
    });

    const secondParty = computed(() => {
        return props.payload.secondParty || 'Лицо 2 не указано';
    });

    const signatureLabel = computed(() => {
        return props.payload.signatureLabel;
    });

    const description = computed(() => {
        return props.payload.description.filter((item) => item.trim().length > 0);
    });

    const sections = computed(() => {
        return props.payload.sections;
    });

    const hasSigningAssets = computed(() => {
        return Boolean(signaturePreviewUrl.value || stampPreviewUrl.value);
    });
</script>
