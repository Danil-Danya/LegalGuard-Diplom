<template>
    <div
        ref="fieldContainerRef"
        class="relative min-w-0"
        :class="field.span === 2 ? 'md:col-span-2' : ''"
        @focusin="handleFocusIn"
        @focusout="handleFocusOut"
    >
        <ContractUploadField
            v-if="field.type === 'file'"
            :accept="field.accept"
            :description="field.description"
            :label="field.label"
            :model-value="fileValue"
            @update:model-value="emit('update:modelValue', $event)"
        />

        <template v-else>
            <Input
                v-if="field.type === 'text' || field.type === 'date'"
                :label="field.label"
                :model-value="stringValue"
                :placeholder="field.placeholder || ''"
                :type="field.type === 'date' ? 'date' : 'text'"
                @update:model-value="handleFieldValueUpdate"
            />

            <TextArea
                v-else
                :label="field.label"
                :model-value="stringValue"
                :placeholder="field.placeholder || ''"
                :rows="field.rows || 4"
                @update:model-value="handleFieldValueUpdate"
            />

            <div
                v-if="supportsHint"
                class="flex justify-end !mt-[8px]"
            >
                <button
                    type="button"
                    class="text-[13px] font-medium text-[var(--color-primary)] transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="isHintLoading"
                    @mousedown.prevent
                    @click="handleHintTrigger"
                >
                    {{ isHintLoading ? 'LegalGuard думает...' : 'Подсказка LegalGuard' }}
                </button>
            </div>
        </template>

        <Transition name="field-suggestion">
            <div
                v-if="showProfileSuggestion"
                class="absolute left-0 right-0 top-[calc(100%+10px)] z-[12] overflow-hidden rounded-[18px] border border-[var(--color-primary-30)] bg-white shadow-[0_18px_40px_rgba(45,51,56,0.12)] md:z-[80]"
            >
                <div class="flex items-start gap-[12px] border-l-[4px] border-[var(--color-primary)] !p-[18px]">
                    <img
                        :src="logoImage"
                        alt="LegalGuard AI"
                        class="hidden h-[36px] w-[36px] shrink-0 rounded-[8px] border border-[var(--color-border)] object-cover md:block"
                    >

                    <div class="min-w-0 flex-1">
                        <p class="text-[15px] italic leading-[24px] text-[var(--color-text-secondary)]">
                            Можно автоматически подставить данные из вашего профиля в это поле.
                        </p>

                        <p class="!mt-[10px] text-[18px] font-semibold leading-[24px] text-[var(--color-text-primary)]">
                            {{ profileSuggestedValue }}
                        </p>

                        <p class="!mt-[4px] text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                            Юридическая служба LegalGuard AI
                        </p>

                        <div class="!mt-[14px] flex flex-wrap items-center gap-[10px]">
                            <button
                                type="button"
                                class="inline-flex !p-[5px_10px] items-center justify-center rounded-[10px] bg-[var(--color-primary)] px-[16px] text-[14px] font-semibold text-white transition-colors hover:bg-accent"
                                @mousedown.prevent
                                @click="applyProfileSuggestion"
                            >
                                Принять
                            </button>

                            <button
                                type="button"
                                class="inline-flex !p-[5px_10px] items-center justify-center rounded-[10px] border border-[var(--color-primary-30)] px-[16px] text-[14px] font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-10)]"
                                @mousedown.prevent
                                @click="dismissProfileSuggestion"
                            >
                                Отказаться
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>

        <Transition name="field-suggestion">
            <div
                v-if="showHintCard"
                class="absolute left-0 right-0 top-[calc(100%+10px)] z-[12] overflow-hidden rounded-[18px] border border-[var(--color-primary-30)] bg-white shadow-[0_18px_40px_rgba(45,51,56,0.12)] md:z-[80]"
            >
                <div class="flex items-start gap-[12px] border-l-[4px] border-[var(--color-primary)] !p-[18px] max-md:gap-[0px]">
                    <img
                        :src="logoImage"
                        alt="LegalGuard AI"
                        class="hidden h-[36px] w-[36px] shrink-0 rounded-[8px] border border-[var(--color-border)] object-cover md:block"
                    >

                    <div class="min-w-0 flex-1">
                        <p class="text-[15px] italic leading-[24px] text-[var(--color-text-secondary)] max-md:text-[12px] max-md:leading-[18px]">
                            LegalGuard AI предлагает формулировку для поля «{{ field.label }}».
                        </p>

                        <p
                            v-if="isAutoHint"
                            class="!mt-[8px] text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)] max-md:text-[10px] max-md:leading-[14px]"
                        >
                            Подсказка появилась автоматически
                        </p>

                        <div class="!mt-[12px] max-h-[500px] overflow-y-auto pr-[4px]">
                            <p
                                v-if="isHintLoading"
                                class="text-[15px] leading-[24px] text-[var(--color-text-primary)] max-md:text-[12px] max-md:leading-[18px]"
                            >
                                Подбираем подсказку...
                            </p>

                            <template v-else-if="hintError">
                                <p class="text-[15px] leading-[24px] text-[var(--color-danger)] max-md:text-[12px] max-md:leading-[18px]">
                                    {{ hintError }}
                                </p>
                            </template>

                            <template v-else-if="hintResponse">
                                <p class="text-[16px] leading-[26px] text-[var(--color-text-primary)] whitespace-pre-line max-md:text-[12px] max-md:leading-[18px]">
                                    {{ hintResponse.text }}
                                </p>

                                <div
                                    v-if="hintResponse.comment"
                                    class="!mt-[12px] rounded-[12px] bg-[var(--color-surface)] !p-[12px_14px]"
                                >
                                    <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)] max-md:text-[10px] max-md:leading-[14px]">
                                        Почему так
                                    </p>
                                    <p class="!mt-[6px] text-[14px] leading-[22px] text-[var(--color-text-secondary)] max-md:text-[12px] max-md:leading-[18px]">
                                        {{ hintResponse.comment }}
                                    </p>
                                </div>
                            </template>
                        </div>

                        <div class="!mt-[14px] flex flex-wrap items-center gap-[10px]">
                            <button
                                v-if="hintResponse"
                                type="button"
                                class="inline-flex !p-[5px_10px] items-center justify-center rounded-[8px] bg-[var(--color-primary)] px-[16px] text-[14px] font-semibold text-white transition-colors hover:bg-accent"
                                @mousedown.prevent
                                @click="applyHintSuggestion"
                            >
                                Применить
                        </button>

                            <button
                                type="button"
                                class="inline-flex !p-[5px_10px] items-center justify-center rounded-[8px] border border-[var(--color-primary-30)] px-[16px] text-[14px] font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-10)]"
                                @mousedown.prevent
                                @click="dismissHintSuggestion"
                            >
                                Скрыть
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
    import { computed, nextTick, onBeforeUnmount, ref } from 'vue';

    import logoImage from '@/assets/images/logo/logo.png';
    import { generateContractHint, type GenerateContractHintResponse } from '@/entities/contracts/api/hint';
    import type { ContractFieldSchema, ContractFieldValue } from '@/entities/contracts/lib/types';
    import { useUserStore } from '@/entities/users/models/store';
    import Input from '@/shared/ui/Input.vue';
    import TextArea from '@/shared/ui/TextArea.vue';

    import ContractUploadField from './ContractUploadField.vue';

    interface UserProfileShape {
        firstName?: string;
        lastName?: string;
        profile?: {
            firstName?: string;
            lastName?: string;
        };
    }

    const HINT_DEBOUNCE_MS = 5000;

    const props = defineProps<{
        field: ContractFieldSchema;
        modelValue: ContractFieldValue;
        documentType: string;
        hintTemplateContext: Record<string, unknown>;
    }>();

    const emit = defineEmits<{
        (e: 'update:modelValue', value: ContractFieldValue): void;
    }>();

    const userStore = useUserStore();
    const fieldContainerRef = ref<HTMLElement | null>(null);
    const isFieldActive = ref(false);
    const isProfileSuggestionDismissed = ref(false);
    const isHintVisible = ref(false);
    const isHintLoading = ref(false);
    const hintError = ref('');
    const hintResponse = ref<GenerateContractHintResponse | null>(null);
    const isAutoHint = ref(false);
    const lastHintFingerprint = ref('');
    const hintRequestId = ref(0);
    const skipNextHintDebounce = ref(false);
    const debounceTimerId = ref<number | null>(null);
    const focusOutTimerId = ref<number | null>(null);
    const suppressNextFocusOut = ref(false);

    const stringValue = computed(() => {
        return typeof props.modelValue === 'string' ? props.modelValue : '';
    });

    const fileValue = computed(() => {
        return props.modelValue instanceof File ? props.modelValue : null;
    });

    const supportsProfileSuggestion = computed(() => {
        return props.field.type === 'text' && (props.field.key === 'person1' || props.field.key === 'firstParty');
    });

    const normalizedLabel = computed(() => {
        return props.field.label.trim().toLowerCase();
    });

    const supportsHint = computed(() => {
        if (!(props.field.type === 'text' || props.field.type === 'textarea')) {
            return false;
        }

        if (['documentDate', 'person1', 'person2', 'firstParty', 'secondParty', 'signatureFile', 'attachmentFile'].includes(props.field.key)) {
            return false;
        }

        return !['фио', 'имя', 'фам', 'дата', 'подпись', 'печать'].some((marker) => {
            return normalizedLabel.value.includes(marker);
        });
    });

    const profileSuggestedValue = computed(() => {
        const profile = userStore.myProfile as UserProfileShape;
        const firstName = profile?.firstName || profile?.profile?.firstName || '';
        const lastName = profile?.lastName || profile?.profile?.lastName || '';

        return [firstName, lastName]
            .map((value) => value.trim())
            .filter(Boolean)
            .join(' ');
    });

    const showProfileSuggestion = computed(() => {
        if (!supportsProfileSuggestion.value || !isFieldActive.value || isProfileSuggestionDismissed.value || isHintVisible.value) {
            return false;
        }

        if (!profileSuggestedValue.value) {
            return false;
        }

        return stringValue.value.trim() !== profileSuggestedValue.value;
    });

    const showHintCard = computed(() => {
        return supportsHint.value && isHintVisible.value;
    });

    const isMobileViewport = () => {
        return typeof window !== 'undefined' && window.innerWidth < 768;
    };

    const blurActiveEditable = () => {
        if (typeof document === 'undefined') {
            return;
        }

        const activeElement = document.activeElement as HTMLElement | null;

        if (!activeElement) {
            return;
        }

        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable) {
            activeElement.blur();
        }
    };

    const createHintFingerprint = (fieldText: string, templateContext: Record<string, unknown>) => {
        return JSON.stringify({
            fieldName: props.field.label,
            fieldText,
            documentType: props.documentType,
            userJsonTemplate: templateContext,
        });
    };

    const clearHintDebounce = () => {
        if (debounceTimerId.value !== null) {
            window.clearTimeout(debounceTimerId.value);
            debounceTimerId.value = null;
        }
    };

    const clearFocusOutTimer = () => {
        if (focusOutTimerId.value !== null) {
            window.clearTimeout(focusOutTimerId.value);
            focusOutTimerId.value = null;
        }
    };

    const openHintCard = async (source: 'manual' | 'auto', nextValue?: string) => {
        if (!supportsHint.value) {
            return;
        }

        const fieldText = typeof nextValue === 'string' ? nextValue.trim() : stringValue.value.trim();
        const templateContextSnapshot = JSON.parse(JSON.stringify(props.hintTemplateContext || {})) as Record<string, unknown>;
        const fingerprint = createHintFingerprint(fieldText, templateContextSnapshot);

        if (isMobileViewport()) {
            suppressNextFocusOut.value = true;
            blurActiveEditable();
        }

        isProfileSuggestionDismissed.value = true;
        isHintVisible.value = true;
        isAutoHint.value = source === 'auto';
        hintError.value = '';

        await nextTick();

        if (hintResponse.value && lastHintFingerprint.value === fingerprint) {
            return;
        }

        const requestId = hintRequestId.value + 1;
        hintRequestId.value = requestId;
        isHintLoading.value = true;

        try {
            const response = await generateContractHint({
                userMessage: {
                    fieldName: props.field.label,
                    fieldText,
                    documentType: props.documentType,
                },
                userJsonTemplate: templateContextSnapshot,
            });

            if (hintRequestId.value !== requestId) {
                return;
            }

            hintResponse.value = response;
            lastHintFingerprint.value = fingerprint;
        }
        catch {
            if (hintRequestId.value !== requestId) {
                return;
            }

            hintResponse.value = null;
            hintError.value = 'Не удалось получить подсказку';
        }
        finally {
            if (hintRequestId.value === requestId) {
                isHintLoading.value = false;
            }
        }
    };

    const scheduleAutoHint = (nextValue: string) => {
        if (!supportsHint.value || !nextValue.trim()) {
            return;
        }

        clearHintDebounce();
        debounceTimerId.value = window.setTimeout(() => {
            debounceTimerId.value = null;
            void openHintCard('auto', nextValue);
        }, HINT_DEBOUNCE_MS);
    };

    const handleFieldValueUpdate = (value: string) => {
        emit('update:modelValue', value);

        if (!supportsHint.value) {
            return;
        }

        if (skipNextHintDebounce.value) {
            skipNextHintDebounce.value = false;
            return;
        }

        clearHintDebounce();
        isHintVisible.value = false;
        hintError.value = '';

        if (!value.trim()) {
            hintResponse.value = null;
            lastHintFingerprint.value = '';
            return;
        }

        scheduleAutoHint(value);
    };

    const handleFocusIn = () => {
        clearFocusOutTimer();
        isFieldActive.value = true;
    };

    const handleFocusOut = () => {
        clearFocusOutTimer();
        focusOutTimerId.value = window.setTimeout(() => {
            focusOutTimerId.value = null;

            if (suppressNextFocusOut.value) {
                suppressNextFocusOut.value = false;
                return;
            }

            const activeElement = document.activeElement;

            if (activeElement && fieldContainerRef.value?.contains(activeElement)) {
                return;
            }

            isFieldActive.value = false;
            isHintVisible.value = false;
            clearHintDebounce();
        }, 0);
    };

    const handleHintTrigger = () => {
        clearHintDebounce();
        void openHintCard('manual', stringValue.value);
    };

    const applyProfileSuggestion = () => {
        emit('update:modelValue', profileSuggestedValue.value);
        isProfileSuggestionDismissed.value = true;
    };

    const dismissProfileSuggestion = () => {
        isProfileSuggestionDismissed.value = true;
    };

    const applyHintSuggestion = () => {
        if (!hintResponse.value) {
            return;
        }

        skipNextHintDebounce.value = true;
        emit('update:modelValue', hintResponse.value.text);
        isHintVisible.value = false;
    };

    const dismissHintSuggestion = () => {
        isHintVisible.value = false;
        isAutoHint.value = false;
        hintError.value = '';
    };

    onBeforeUnmount(() => {
        clearHintDebounce();
        clearFocusOutTimer();
    });
</script>

<style scoped>
    .field-suggestion-enter-active,
    .field-suggestion-leave-active {
        transition: opacity 220ms ease, transform 220ms ease;
    }

    .field-suggestion-enter-from,
    .field-suggestion-leave-to {
        opacity: 0;
        transform: translateY(-8px) scale(0.98);
    }
</style>
