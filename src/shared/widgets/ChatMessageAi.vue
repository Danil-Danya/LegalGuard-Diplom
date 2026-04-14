<template>
    <div class="chat__ai !mb-[20px] max-w-[600px]">
        <div class="chat__ai-avatar flex items-center gap-[10px]">
            <img src="@/assets/images/logo/logo.png" alt="Logo" class="h-[30px] w-[30px] rounded-[4px] border border-accent">
            <div class="flex items-center gap-[10px]">
                <p class="font-brand text-[18px] font-extrabold leading-none uppercase tracking-brand text-primary [text-shadow:0_1px_0_rgba(255,255,255,0.7)]">
                    LEGALGUARD AI
                </p>
                <p class="text-[14px] font-semibold leading-none tracking-[0.01em] text-text-subtle">
                    {{ resolvedMetaText }}
                </p>
            </div>
        </div>

        <div class="border-l-[7px] border-accent !pl-[15px]" :class="contentSpacingClass">
            <div
                v-if="pending"
                class="assistant-status inline-flex min-h-[48px] items-center gap-[12px] rounded-[16px] border border-[var(--color-primary-20)] bg-white/92 px-[16px] py-[12px] text-[15px] font-semibold text-[var(--color-text-primary)] shadow-[0_16px_34px_rgba(45,51,56,0.08)] backdrop-blur-[8px]"
            >
                <span>{{ pendingStatusText }}</span>
                <span class="typing-dots" aria-hidden="true">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </div>

            <template v-else>
                <p class="text whitespace-pre-line">
                    {{ displayedText }}
                    <span v-if="isTextAnimating" class="typing-caret" aria-hidden="true"></span>
                </p>

                <div
                    v-if="showRiskHighlight"
                    class="!mt-[18px] rounded-[16px] border border-[var(--color-danger-20)] bg-[var(--color-danger-10)] !p-[12px] shadow-[0_10px_24px_rgba(182,64,51,0.08)]"
                >
                    <div class="flex items-start gap-[10px]">
                        <div class="min-w-0">
                            <p class="text-[13px] font-extrabold uppercase tracking-marker text-[var(--color-danger)]">
                                {{ resolvedRiskLabel }}
                            </p>
                            <p class="!mt-[4px] text-[15px] font-semibold leading-[22px] text-[var(--color-text-primary)]">
                                {{ primaryRisk?.title }}
                            </p>
                            <p v-if="primaryRisk?.description" class="!mt-[6px] text-[14px] leading-[21px] text-[var(--color-text-secondary)]">
                                {{ primaryRisk.description }}
                            </p>
                            <p v-if="primaryRisk?.recommendation" class="!mt-[8px] text-[13px] font-medium leading-[19px] text-[var(--color-danger)]">
                                Что сделать: {{ primaryRisk.recommendation }}
                            </p>
                        </div>
                    </div>
                </div>

                <div v-if="showSummaryBadges" class="!mt-[16px] flex flex-wrap gap-[10px]">
                    <div
                        v-for="badge in summaryBadges"
                        :key="badge.id"
                        class="inline-flex !p-[5px_10px] items-center gap-[8px] rounded-full border font-brand text-[11px] font-medium leading-none uppercase tracking-marker"
                        :class="badge.type === 'risk'
                            ? 'border-[var(--color-danger-20)] bg-[var(--color-danger-10)] text-[var(--color-danger)]'
                            : badge.type === 'warning'
                                ? 'border-[var(--color-secondary-80)] bg-[var(--color-soft-yellow-30)] text-[var(--color-secondary)]'
                                : 'border-[var(--color-primary-20)] bg-[var(--color-primary-10)] text-[var(--color-primary)]'"
                        :title="badge.title"
                    >
                        <component :is="badge.icon" class="shrink-0" />
                        <span>{{ badge.label }}</span>
                    </div>
                </div>

                <div v-if="showMarkers" class="!mt-[16px] flex flex-wrap gap-[10px] !pl-[10px]">
                    <div
                        v-for="marker in markers"
                        :key="marker.id"
                        class="inline-flex min-h-[30px] items-center gap-[8px] rounded-full border px-[18px] font-brand text-[12px] font-medium leading-none uppercase tracking-marker border-primary-20 bg-primary-10 text-primary"
                    >
                        <span>{{ marker.label }}</span>
                    </div>
                </div>

                <div
                    v-if="showSources"
                    class="!mt-[18px] rounded-[16px] border border-[var(--color-border)] bg-white/70 !p-[12px]"
                >
                    <p class="text-[12px] font-extrabold uppercase tracking-marker text-[var(--color-text-secondary)]">
                        Источники
                    </p>
                    <div class="!mt-[10px] flex flex-col gap-[10px]">
                        <a
                            v-for="source in normalizedSources"
                            :key="`${source.title}-${source.url}`"
                            :href="source.url"
                            target="_blank"
                            rel="noreferrer noopener"
                            class="group rounded-[12px] border border-transparent bg-[var(--color-bg)] px-[12px] py-[10px] transition-colors duration-200 hover:border-[var(--color-primary-20)] hover:bg-[var(--color-primary-10)]"
                        >
                            <div class="flex items-start gap-[10px] !p-[10px]">
                                <div class="min-w-0">
                                    <p class="text-[14px] font-semibold leading-[20px] text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)]">
                                        {{ source.title }}
                                    </p>
                                    <p class="!mt-[2px] truncate text-[12px] leading-[18px] text-[var(--color-text-muted)]">
                                        {{ source.url }}
                                    </p>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>

                <div v-if="showActions" class="!mt-[12px] flex flex-wrap items-center gap-[4px] !pl-[8px]">
                    <MessageActionButton label="Скопировать сообщение" :active="copied" @click="handleCopy">
                        <CopyActionIcon />
                    </MessageActionButton>
                    <MessageActionButton
                        label="Нравится"
                        :active="feedback === 'like'"
                        tone="primary"
                        @click="toggleFeedback('like')"
                    >
                        <LikeActionIcon />
                    </MessageActionButton>
                    <MessageActionButton
                        label="Не нравится"
                        :active="feedback === 'dislike'"
                        tone="danger"
                        @click="toggleFeedback('dislike')"
                    >
                        <DislikeActionIcon />
                    </MessageActionButton>
                    <MessageActionButton label="Поделиться сообщением" :active="shared" @click="handleShare">
                        <ShareActionIcon />
                    </MessageActionButton>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, onBeforeUnmount, ref, watch } from 'vue';

    import type { AiBadge, AiRisk, AiSource } from '@/entities/chats/lib/types';
    import BadgeInfoIcon from '@/shared/icons/chat/BadgeInfo.vue';
    import BadgeWarningIcon from '@/shared/icons/chat/BadgeWarning.vue';
    import CopyActionIcon from '@/shared/icons/chat/CopyAction.vue';
    import DislikeActionIcon from '@/shared/icons/chat/DislikeAction.vue';
    import LikeActionIcon from '@/shared/icons/chat/LikeAction.vue';
    import RiskMarkerIcon from '@/shared/icons/chat/RiskMarker.vue';
    import ShareActionIcon from '@/shared/icons/chat/ShareAction.vue';
    import SourceLinkIcon from '@/shared/icons/chat/SourceLink.vue';
    import MessageActionButton from '@/shared/ui/MessageActionButton.vue';
    import { copyTextToClipboard, shareTextContent } from '@/utils/messageActions';

    const PENDING_THINKING_DELAY_MS = 6000;
    const TYPEWRITER_CHARACTERS_PER_SECOND = 72;

    type ChatMarker = {
        id: string;
        label: string;
        type: 'law';
    };

    type SummaryBadge = {
        id: string;
        label: string;
        title: string;
        type: 'info' | 'risk' | 'warning';
        icon: unknown;
    };

    const props = withDefaults(defineProps<{
        text: string;
        time?: string;
        createdAt?: string;
        pending?: boolean;
        badges?: AiBadge[];
        risks?: AiRisk[];
        sources?: AiSource[];
        animateText?: boolean;
    }>(), {
        pending: false,
        badges: () => [],
        risks: () => [],
        sources: () => [],
        animateText: false,
    });

    const emit = defineEmits<{
        (event: 'animation-progress'): void;
        (event: 'animation-complete'): void;
    }>();

    const severityPriority: Record<string, number> = {
        critical: 4,
        high: 3,
        medium: 2,
        low: 1,
    };

    const lawRegex = /(?:ст\.?|статья)\s*\d+(?:\.\d+)?(?:\s+[А-ЯЁA-Z]{1,8}\.?\s*){1,4}(?:РФ)?/giu;

    const displayedText = ref('');
    const pendingElapsedMs = ref(0);
    const copied = ref(false);
    const shared = ref(false);
    const feedback = ref<'like' | 'dislike' | null>(null);
    const isTextAnimating = ref(false);

    const timers: Partial<Record<'copied' | 'shared', ReturnType<typeof setTimeout>>> = {};
    let pendingTimer: ReturnType<typeof setInterval> | null = null;
    let textAnimationFrame: number | null = null;

    const normalizeMarkerLabel = (value: string) => value.replace(/\s+/g, ' ').trim();

    const normalizeBadgeType = (type: string): SummaryBadge['type'] => {
        if (type === 'risk' || type === 'warning') {
            return type;
        }

        return 'info';
    };

    const getBadgeLabel = (type: SummaryBadge['type']) => {
        if (type === 'risk') {
            return 'Риск';
        }

        if (type === 'warning') {
            return 'Предупреждение';
        }

        return 'Инфо';
    };

    const getBadgeIcon = (type: SummaryBadge['type']) => {
        if (type === 'risk') {
            return RiskMarkerIcon;
        }

        if (type === 'warning') {
            return BadgeWarningIcon;
        }

        return BadgeInfoIcon;
    };

    const getSeverityRank = (severity: string) => {
        return severityPriority[severity.toLowerCase()] ?? 0;
    };

    const clearPendingTimer = () => {
        if (pendingTimer) {
            clearInterval(pendingTimer);
            pendingTimer = null;
        }
    };

    const clearTextAnimation = () => {
        if (textAnimationFrame !== null) {
            cancelAnimationFrame(textAnimationFrame);
            textAnimationFrame = null;
        }
    };

    const setTransientState = (key: 'copied' | 'shared', value: boolean) => {
        if (timers[key]) {
            clearTimeout(timers[key]);
        }

        if (key === 'copied') {
            copied.value = value;
        }
        else {
            shared.value = value;
        }

        timers[key] = setTimeout(() => {
            if (key === 'copied') {
                copied.value = false;
            }
            else {
                shared.value = false;
            }
        }, 1800);
    };

    const extractMarkers = (text: string): ChatMarker[] => {
        const markers: ChatMarker[] = [];
        const normalizedText = text.normalize('NFC');
        const lawMatches = new Set<string>();

        for (const match of normalizedText.matchAll(lawRegex)) {
            const citation = normalizeMarkerLabel(match[0]).toUpperCase();

            if (citation) {
                lawMatches.add(citation);
            }
        }

        let lawIndex = 0;

        for (const citation of lawMatches) {
            markers.push({
                id: `law-${lawIndex}`,
                label: citation,
                type: 'law',
            });
            lawIndex += 1;
        }

        return markers;
    };

    const startPendingTimer = () => {
        clearPendingTimer();

        const startedAt = props.createdAt ? new Date(props.createdAt).getTime() : Date.now();
        const safeStartedAt = Number.isNaN(startedAt) ? Date.now() : startedAt;

        const updatePendingState = () => {
            pendingElapsedMs.value = Math.max(0, Date.now() - safeStartedAt);
        };

        updatePendingState();
        pendingTimer = setInterval(updatePendingState, 250);
    };

    const startTextAnimation = (value: string) => {
        clearTextAnimation();

        if (!value) {
            displayedText.value = '';
            isTextAnimating.value = false;
            emit('animation-complete');
            return;
        }

        if (!props.animateText) {
            displayedText.value = value;
            isTextAnimating.value = false;
            emit('animation-progress');
            return;
        }

        const characters = Array.from(value);

        if (!characters.length) {
            displayedText.value = value;
            isTextAnimating.value = false;
            emit('animation-complete');
            return;
        }

        isTextAnimating.value = true;
        displayedText.value = '';

        const animationStartedAt = performance.now();
        let lastVisibleCharacters = -1;

        const renderFrame = (frameTime: number) => {
            const elapsedSeconds = (frameTime - animationStartedAt) / 1000;
            const visibleCharacters = Math.min(
                characters.length,
                Math.floor(elapsedSeconds * TYPEWRITER_CHARACTERS_PER_SECOND),
            );

            if (visibleCharacters !== lastVisibleCharacters) {
                displayedText.value = characters.slice(0, visibleCharacters).join('');
                lastVisibleCharacters = visibleCharacters;
                emit('animation-progress');
            }

            if (visibleCharacters >= characters.length) {
                displayedText.value = value;
                isTextAnimating.value = false;
                textAnimationFrame = null;
                emit('animation-progress');
                emit('animation-complete');
                return;
            }

            textAnimationFrame = requestAnimationFrame(renderFrame);
        };

        textAnimationFrame = requestAnimationFrame(renderFrame);
    };

    const resolvedMetaText = computed(() => props.time || 'Сейчас');
    const pendingStatusText = computed(() => {
        return pendingElapsedMs.value >= PENDING_THINKING_DELAY_MS ? 'Размышляет' : 'Печатает';
    });
    const normalizedSources = computed(() => {
        return props.sources.filter((source) => Boolean(source?.title && source?.url));
    });
    const summaryBadges = computed(() => {
        const seenTypes = new Set<SummaryBadge['type']>();

        return props.badges.reduce<SummaryBadge[]>((accumulator, badge, index) => {
            const type = normalizeBadgeType(badge.type);

            if (seenTypes.has(type)) {
                return accumulator;
            }

            seenTypes.add(type);
            accumulator.push({
                id: `${type}-${index}`,
                label: getBadgeLabel(type),
                title: badge.label,
                type,
                icon: getBadgeIcon(type),
            });

            return accumulator;
        }, []);
    });
    const markers = computed(() => extractMarkers(props.text));
    const primaryRisk = computed(() => {
        return [...props.risks].sort((left, right) => getSeverityRank(right.severity) - getSeverityRank(left.severity))[0] ?? null;
    });
    const resolvedRiskLabel = computed(() => {
        if (!primaryRisk.value?.severity) {
            return 'Найден риск';
        }

        if (primaryRisk.value.severity.toLowerCase() === 'high') {
            return 'Высокий риск';
        }

        if (primaryRisk.value.severity.toLowerCase() === 'medium') {
            return 'Средний риск';
        }

        if (primaryRisk.value.severity.toLowerCase() === 'low') {
            return 'Низкий риск';
        }

        return 'Найден риск';
    });
    const showRiskHighlight = computed(() => !props.pending && !isTextAnimating.value && Boolean(primaryRisk.value));
    const showSummaryBadges = computed(() => !props.pending && !isTextAnimating.value && summaryBadges.value.length > 0);
    const showMarkers = computed(() => !props.pending && !isTextAnimating.value && markers.value.length > 0);
    const showSources = computed(() => !props.pending && !isTextAnimating.value && normalizedSources.value.length > 0);
    const showActions = computed(() => !props.pending && !isTextAnimating.value && Boolean(props.text));
    const contentSpacingClass = computed(() => {
        return props.pending || showRiskHighlight.value || showSummaryBadges.value || showMarkers.value || showSources.value
            ? '!mt-[12px]'
            : '!mt-[20px]';
    });

    const handleCopy = async () => {
        const isCopied = await copyTextToClipboard(props.text);

        if (isCopied) {
            setTransientState('copied', true);
        }
    };

    const handleShare = async () => {
        const isShared = await shareTextContent(props.text);

        if (isShared) {
            setTransientState('shared', true);
        }
    };

    const toggleFeedback = (value: 'like' | 'dislike') => {
        feedback.value = feedback.value === value ? null : value;
    };

    watch(() => [props.pending, props.text, props.animateText, props.createdAt] as const, () => {
        if (props.pending) {
            clearTextAnimation();
            displayedText.value = '';
            isTextAnimating.value = false;
            startPendingTimer();
            return;
        }

        clearPendingTimer();
        pendingElapsedMs.value = 0;
        startTextAnimation(props.text);
    }, { immediate: true });

    onBeforeUnmount(() => {
        clearPendingTimer();
        clearTextAnimation();

        if (timers.copied) {
            clearTimeout(timers.copied);
        }

        if (timers.shared) {
            clearTimeout(timers.shared);
        }
    });
</script>

<style scoped>
    .assistant-status {
        animation: assistant-status-appear 220ms ease-out;
    }

    .typing-dots {
        display: inline-flex;
        align-items: center;
        gap: 5px;
    }

    .typing-dots span {
        width: 7px;
        height: 7px;
        border-radius: 9999px;
        background: var(--color-primary);
        opacity: 0.25;
        animation: typing-dot-bounce 1.15s infinite ease-in-out;
    }

    .typing-dots span:nth-child(2) {
        animation-delay: 0.16s;
    }

    .typing-dots span:nth-child(3) {
        animation-delay: 0.32s;
    }

    .typing-caret {
        display: inline-block;
        width: 2px;
        height: 1em;
        margin-left: 3px;
        vertical-align: -0.12em;
        background: var(--color-primary);
        animation: typing-caret-blink 0.9s infinite;
    }

    @keyframes assistant-status-appear {
        from {
            opacity: 0;
            transform: translateY(6px);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes typing-dot-bounce {
        0%, 80%, 100% {
            transform: translateY(0);
            opacity: 0.25;
        }

        40% {
            transform: translateY(-3px);
            opacity: 1;
        }
    }

    @keyframes typing-caret-blink {
        0%, 45% {
            opacity: 1;
        }

        46%, 100% {
            opacity: 0;
        }
    }
</style>
