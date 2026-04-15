<template>
    <section class="company-details-page pb-[188px] pt-[24px] md:pb-[80px]">
        <Breadcrumbs :links="breadcrumbsLinks" />

        <div class="container">
            <div v-if="company" class="space-y-[20px]">
                <section class="rounded-[10px] border border-[rgba(118,89,44,0.18)] bg-white !p-[24px] shadow-[0_18px_40px_rgba(45,51,56,0.06)] max-md:!p-[18px]">
                    <div class="flex flex-col gap-[18px] xl:flex-row xl:items-start xl:justify-between">
                        <div class="min-w-0">
                            <div class="flex flex-wrap items-center gap-[10px]">
                                <span
                                    class="rounded-[4px] !p-[5px_10px] px-[12px] py-[6px] text-[12px] font-semibold uppercase tracking-[0.08em]"
                                    :class="statusBadgeClass"
                                >
                                    {{ companyStatusLabel }}
                                </span>

                                <span class="rounded-[4px] !p-[5px_10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-[12px] py-[6px] text-[12px] font-semibold text-[var(--color-text-secondary)]">
                                    ИНН {{ company.inn }}
                                </span>
                            </div>

                            <h1 class="!mt-[12px] text-[42px] font-semibold leading-[0.96] tracking-[-0.04em] text-[var(--color-text-primary)] max-md:text-[30px]">
                                {{ companyTitle }}
                            </h1>

                            <p class="!mt-[14px] max-w-[820px] text-[16px] leading-[26px] text-[var(--color-text-secondary)] max-md:text-[14px] max-md:leading-[22px]">
                                {{ companyLead }}
                            </p>
                        </div>

                        <RouterLink
                            to="/company/counterparty-check"
                            class="inline-flex !p-[10px_20px] items-center justify-center rounded-[8px] border border-[var(--color-primary-30)] bg-[var(--color-primary)] px-[20px] text-[15px] font-semibold !text-white transition-colors hover:bg-accent"
                        >
                            К поиску компаний
                        </RouterLink>
                    </div>
                </section>

                <div class="grid gap-[18px] !mt-[30px] !mb-[50px] xl:grid-cols-[minmax(0,1.35fr)_360px]">
                    <div class="space-y-[18px]">
                        <article class="rounded-[10px] border border-[var(--color-border)] bg-white !p-[24px] shadow-[0_18px_40px_rgba(45,51,56,0.06)] max-md:!p-[18px]">
                            <div class="flex flex-wrap items-center gap-[12px] border-b border-[var(--color-border)] pb-[16px]">
                                <span class="flex h-[40px] w-[40px] items-center justify-center rounded-[12px] bg-[var(--color-primary-10)] text-[18px] text-[var(--color-primary)]">
                                    i
                                </span>

                                <div class="min-w-0">
                                    <h2 class="text-[22px] font-semibold leading-[28px] text-[var(--color-text-primary)]">
                                        Основная информация
                                    </h2>
                                    <p class="!mt-[4px] text-[14px] leading-[20px] text-[var(--color-text-secondary)]">
                                        Поля карточки компании из сервера и расчетные признаки для проверки.
                                    </p>
                                </div>
                            </div>

                            <dl class="!mt-[18px] grid gap-[14px] sm:grid-cols-2">
                                <div v-for="item in basicInformationItems" :key="item.label" class="rounded-[16px] bg-[var(--color-surface)] !p-[16px]">
                                    <dt class="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                                        {{ item.label }}
                                    </dt>
                                    <dd class="!mt-[8px] break-words text-[18px] font-semibold leading-[24px] text-[var(--color-text-primary)]">
                                        {{ item.value }}
                                    </dd>
                                    <p v-if="item.hint" class="!mt-[6px] text-[13px] leading-[18px] text-[var(--color-text-secondary)]">
                                        {{ item.hint }}
                                    </p>
                                </div>
                            </dl>
                        </article>

                        <article class="rounded-[10px] border border-[var(--color-border)] bg-white !p-[24px] shadow-[0_18px_40px_rgba(45,51,56,0.06)] max-md:!p-[18px]">
                            <div class="flex flex-wrap items-center gap-[12px] border-b border-[var(--color-border)] pb-[16px]">
                                <span class="flex h-[40px] w-[40px] items-center justify-center rounded-[12px] bg-[var(--color-primary-10)] text-[18px] text-[var(--color-primary)]">
                                    @
                                </span>

                                <div class="min-w-0">
                                    <h2 class="text-[22px] font-semibold leading-[28px] text-[var(--color-text-primary)]">
                                        Контакты и стороны
                                    </h2>
                                    <p class="!mt-[4px] text-[14px] leading-[20px] text-[var(--color-text-secondary)]">
                                        Контактные данные, адрес и ключевые участники компании.
                                    </p>
                                </div>
                            </div>

                            <dl class="!mt-[18px] grid gap-[14px] sm:grid-cols-2">
                                <div v-for="item in contactItems" :key="item.label" class="rounded-[16px] bg-[var(--color-surface)] !p-[16px]">
                                    <dt class="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                                        {{ item.label }}
                                    </dt>
                                    <dd class="!mt-[8px] break-words text-[16px] font-semibold leading-[24px] text-[var(--color-text-primary)]">
                                        {{ item.value }}
                                    </dd>
                                </div>
                            </dl>
                        </article>

                        <article
                            v-if="hasAiResult"
                            class="rounded-[10px] !mt-[30px] border border-[var(--color-border)] bg-white !p-[24px] shadow-[0_18px_40px_rgba(45,51,56,0.06)] max-md:!p-[18px]"
                        >
                            <div class="flex flex-wrap items-center gap-[12px] border-b border-[var(--color-border)] pb-[16px]">
                                <span class="flex h-[40px] w-[40px] items-center justify-center rounded-[12px] bg-[var(--color-primary-10)] text-[16px] font-semibold text-[var(--color-primary)]">
                                    AI
                                </span>

                                <div class="min-w-0">
                                    <h2 class="text-[22px] font-semibold leading-[28px] text-[var(--color-text-primary)]">
                                        AI-проверка
                                    </h2>
                                    <p class="!mt-[4px] text-[14px] leading-[20px] text-[var(--color-text-secondary)]">
                                        Сводка, риски и рекомендации из ответа сервера.
                                    </p>
                                </div>
                            </div>

                            <p class="!mt-[18px] text-[15px] leading-[26px] text-[var(--color-text-secondary)]">
                                {{ aiSummary }}
                            </p>

                            <div v-if="aiBadges.length" class="!mt-[18px] flex flex-wrap gap-[8px]">
                                <span
                                    v-for="badge in aiBadges"
                                    :key="`${badge.type}-${badge.label}`"
                                    class="border px-[12px] rounded-[4px] !p-[5px_10px] py-[7px] text-[13px] font-semibold leading-[18px]"
                                    :class="getAiBadgeClass(badge.type)"
                                >
                                    {{ badge.label }}
                                </span>
                            </div>

                            <div v-if="aiFindings.length" class="!mt-[18px] grid gap-[12px]">
                                <div
                                    v-for="finding in aiFindings"
                                    :key="`${finding.severity}-${finding.title}`"
                                    class="rounded-[16px] border !p-[16px]"
                                    :class="getFindingCardClass(finding.severity)"
                                >
                                    <p class="text-[12px] font-semibold uppercase tracking-[0.16em]">
                                        {{ getFindingSeverityLabel(finding.severity) }}
                                    </p>
                                    <p class="!mt-[8px] text-[16px] font-semibold leading-[22px]">
                                        {{ finding.title }}
                                    </p>
                                    <p class="!mt-[8px] text-[14px] leading-[22px] opacity-90">
                                        {{ finding.description }}
                                    </p>
                                </div>
                            </div>

                            <div v-if="aiRecommendations.length" class="!mt-[18px] rounded-[16px] bg-[var(--color-surface)] !p-[16px]">
                                <p class="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                                    Рекомендации
                                </p>
                                <ul class="!mt-[10px] space-y-[10px] text-[14px] leading-[22px] text-[var(--color-text-primary)]">
                                    <li v-for="recommendation in aiRecommendations" :key="recommendation" class="flex gap-[10px]">
                                        <span class="text-[var(--color-primary)]">•</span>
                                        <span>{{ recommendation }}</span>
                                    </li>
                                </ul>
                            </div>

                            <p v-if="aiDisclaimer" class="!mt-[16px] text-[12px] leading-[18px] text-[var(--color-text-muted)]">
                                {{ aiDisclaimer }}
                            </p>
                        </article>
                    </div>

                    <div class="space-y-[18px]">
                        <article class="rounded-[10px] border border-[rgba(118,89,44,0.18)] bg-[#1D1813] !p-[24px] text-white shadow-[0_20px_60px_rgba(17,14,10,0.24)] max-md:!p-[18px]">
                            <p class="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#C4A26C]">
                                Обзор компании
                            </p>

                            <p class="!mt-[14px] text-[16px] italic leading-[28px] text-white/82">
                                {{ companyOverview }}
                            </p>

                            <div class="!mt-[20px] grid gap-[12px] border-t border-white/10 pt-[16px]">
                                <div>
                                    <p class="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/46">
                                        Текущий срез
                                    </p>
                                    <p class="!mt-[6px] text-[14px] font-medium leading-[22px] text-white">
                                        Директор: {{ formatCompanyValue(company.director) }}
                                    </p>
                                </div>

                                <div v-if="company.aiResult" class="grid gap-[10px] sm:grid-cols-2">
                                    <div class="rounded-[14px] bg-white/6 !p-[14px]">
                                        <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/56">
                                            Вердикт
                                        </p>
                                        <p class="!mt-[6px] text-[14px] font-semibold leading-[20px] text-white">
                                            {{ aiVerdictLabel }}
                                        </p>
                                    </div>

                                    <div class="rounded-[14px] bg-white/6 !p-[14px]">
                                        <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/56">
                                            Risk score
                                        </p>
                                        <p class="!mt-[6px] text-[14px] font-semibold leading-[20px] text-white">
                                            {{ aiRiskScoreLabel }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </article>

                        <article class="rounded-[10px] !mt-[30px] border border-[rgba(118,89,44,0.18)] bg-white !p-[24px] shadow-[0_18px_40px_rgba(45,51,56,0.06)] max-md:!p-[18px]">
                            <p class="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                                Юридические сигналы
                            </p>

                            <div class="!mt-[16px] space-y-[12px] flex flex-col gap-[10px]">
                                <div
                                    v-for="signal in legalSignals"
                                    :key="signal.label"
                                    class="rounded-[16px] border !p-[14px_16px]"
                                    :class="signal.tone"
                                >
                                    <p class="text-[12px] font-semibold uppercase tracking-[0.16em]">
                                        {{ signal.label }}
                                    </p>
                                    <p class="!mt-[6px] break-words text-[16px] font-semibold leading-[22px]">
                                        {{ signal.value }}
                                    </p>
                                    <p v-if="signal.caption" class="!mt-[6px] text-[13px] leading-[18px] opacity-80">
                                        {{ signal.caption }}
                                    </p>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </div>

            <div
                v-else-if="isLoadingCompany"
                class="rounded-[10px] border border-[var(--color-border)] bg-white !p-[28px] text-center shadow-[0_18px_40px_rgba(45,51,56,0.06)]"
            >
                <h1 class="text-[28px] font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">
                    Загружаем компанию
                </h1>
                <p class="!mt-[10px] text-[15px] leading-[24px] text-[var(--color-text-secondary)]">
                    Запрашиваем полную карточку компании и собираем юридическую сводку.
                </p>
            </div>

            <div
                v-else
                class="rounded-[10px] border border-dashed border-[var(--color-border)] bg-white !p-[28px] text-center shadow-[0_18px_40px_rgba(45,51,56,0.06)]"
            >
                <h1 class="text-[28px] font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">
                    Компания не найдена
                </h1>
                <p class="!mt-[10px] text-[15px] leading-[24px] text-[var(--color-text-secondary)]">
                    Проверьте ссылку или вернитесь к поиску и откройте карточку компании заново.
                </p>

                <ErrorMessage v-if="loadError" class="!mt-[16px] text-left" :text="loadError" />

                <RouterLink
                    to="/company/counterparty-check"
                    class="!mt-[18px] inline-flex items-center justify-center rounded-[12px] bg-[var(--color-primary)] !p-[15px_25px] px-[18px] text-[15px] font-semibold !text-white transition-colors hover:bg-accent"
                >
                    Вернуться к поиску
                </RouterLink>
            </div>
        </div>

        <div class="fixed bottom-[15px] left-[15px] right-[15px] z-20 md:hidden">
            <MobileChatTabbar />
        </div>
    </section>
</template>

<script setup lang="ts">
    import { computed, ref, watch } from 'vue';
    import { useRoute } from 'vue-router';

    import { getCompanyById } from '@/entities/companies/api/companies';
    import type {
        CompanyAiBadge,
        CompanyAiFinding,
        CompanyDetailsRecord,
        CompanyStatus,
    } from '@/entities/companies/lib/types';
    import { getAuthRequestErrorMessage } from '@/entities/users/api/auth';
    import MobileChatTabbar from '@/shared/layout/MobileChatTabbar.vue';
    import Breadcrumbs from '@/shared/ui/Breadcrumbs.vue';
    import ErrorMessage from '@/shared/ui/ErrorMessage.vue';

    interface DetailsCardItem {
        label: string;
        value: string;
        hint?: string;
    }

    interface LegalSignalItem {
        label: string;
        value: string;
        caption: string;
        tone: string;
    }

    const route = useRoute();

    const company = ref<CompanyDetailsRecord | null>(null);
    const isLoadingCompany = ref(false);
    const loadError = ref('');
    let companyRequestId = 0;

    const companyId = computed(() => {
        const { company_id } = route.params;
        return Array.isArray(company_id) ? company_id[0] : company_id;
    });

    const companyTitleFromRoute = computed(() => {
        const routeName = Array.isArray(route.query.name) ? route.query.name[0] : route.query.name;
        return typeof routeName === 'string' && routeName.trim() ? routeName.trim() : '';
    });

    const formatCompanyValue = (value?: string) => {
        return value?.trim() || 'Не указано';
    };

    const normalizeDate = (value?: string) => {
        if (!value) {
            return 'Не указана';
        }

        const parsedValue = new Date(value);

        if (Number.isNaN(parsedValue.getTime())) {
            return value;
        }

        return new Intl.DateTimeFormat('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(parsedValue);
    };

    const getCompanyStatusLabel = (status?: CompanyStatus) => {
        switch (status) {
            case 'ACTIVE':
                return 'Действует';
            case 'LIQUIDATED':
                return 'Ликвидирована';
            case 'ON_REVIEW':
                return 'Требует проверки';
            default:
                return status || 'Статус не указан';
        }
    };

    const getAiVerdictLabel = (verdict?: string) => {
        switch (verdict) {
            case 'low_risk':
                return 'Низкий риск';
            case 'medium_risk':
                return 'Средний риск';
            case 'high_risk':
                return 'Высокий риск';
            default:
                return verdict || 'Оценка не указана';
        }
    };

    const getAiBadgeClass = (type?: string) => {
        switch (type) {
            case 'risk':
                return 'border-[#F3C4B4] bg-[#FFF1EC] text-[#BC5D33]';
            case 'warning':
                return 'border-[#E8D7B5] bg-[#FFF8EC] text-[#8C6430]';
            default:
                return 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)]';
        }
    };

    const getFindingSeverityLabel = (severity?: string) => {
        switch (severity) {
            case 'high':
                return 'Высокий риск';
            case 'medium':
                return 'Средний риск';
            case 'low':
                return 'Низкий риск';
            default:
                return severity || 'Сигнал';
        }
    };

    const getFindingCardClass = (severity?: string) => {
        switch (severity) {
            case 'high':
                return 'border-[#F3C4B4] bg-[#FFF1EC] text-[#BC5D33]';
            case 'medium':
                return 'border-[#E8D7B5] bg-[#FFF8EC] text-[#8C6430]';
            default:
                return 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)]';
        }
    };

    watch(companyId, async (nextCompanyId) => {
        const currentRequestId = companyRequestId + 1;
        companyRequestId = currentRequestId;
        loadError.value = '';

        if (!nextCompanyId) {
            company.value = null;
            return;
        }

        isLoadingCompany.value = true;

        try {
            const response = await getCompanyById(nextCompanyId);

            if (companyRequestId !== currentRequestId) {
                return;
            }

            company.value = response;
        }
        catch (error) {
            if (companyRequestId !== currentRequestId) {
                return;
            }

            company.value = null;
            loadError.value = getAuthRequestErrorMessage(error, 'Не удалось загрузить карточку компании');
        }
        finally {
            if (companyRequestId === currentRequestId) {
                isLoadingCompany.value = false;
            }
        }
    }, { immediate: true });

    const companyTitle = computed(() => {
        return company.value?.name || companyTitleFromRoute.value || 'Компания';
    });

    const registrationAge = computed(() => {
        if (!company.value?.registrationDate) {
            return '';
        }

        const registeredAt = new Date(company.value.registrationDate);

        if (Number.isNaN(registeredAt.getTime())) {
            return '';
        }

        const now = new Date();
        let years = now.getFullYear() - registeredAt.getFullYear();
        const hadAnniversary = now.getMonth() > registeredAt.getMonth()
            || (now.getMonth() === registeredAt.getMonth() && now.getDate() >= registeredAt.getDate());

        if (!hadAnniversary) {
            years -= 1;
        }

        if (years <= 0) {
            return 'Менее года на рынке';
        }

        if (years === 1) {
            return '1 год на рынке';
        }

        if (years < 5) {
            return `${years} года на рынке`;
        }

        return `${years} лет на рынке`;
    });

    const companyStatusLabel = computed(() => {
        return getCompanyStatusLabel(company.value?.companyStatus);
    });

    const statusBadgeClass = computed(() => {
        switch (company.value?.companyStatus) {
            case 'ACTIVE':
                return 'bg-[var(--color-primary-10)] text-[var(--color-primary)]';
            case 'LIQUIDATED':
                return 'bg-[#FFF1EC] text-[#BC5D33]';
            default:
                return 'bg-[#FFF6E8] text-[#8C6430]';
        }
    });

    const companyLead = computed(() => {
        if (!company.value) {
            return '';
        }

        return `${companyTitle.value} зарегистрирована ${normalizeDate(company.value.registrationDate)}. Директор: ${formatCompanyValue(company.value.director)}. Учредитель: ${formatCompanyValue(company.value.founder)}. Текущий статус: ${companyStatusLabel.value.toLowerCase()}.`;
    });

    const companyOverview = computed(() => {
        if (!company.value) {
            return '';
        }

        if (company.value.aiResult?.summary?.trim()) {
            return company.value.aiResult.summary;
        }

        const debtText = company.value.texDebt
            ? 'У компании отмечена налоговая задолженность, поэтому перед сделкой нужна дополнительная проверка.'
            : 'По текущим данным налоговая задолженность не отмечена.';

        return `${companyTitle.value} зарегистрирована ${normalizeDate(company.value.registrationDate)} и работает под руководством ${formatCompanyValue(company.value.director)}. Показатель устойчивости: ${formatCompanyValue(company.value.stabilityRating)}. ${debtText}`;
    });

    const basicInformationItems = computed<DetailsCardItem[]>(() => {
        if (!company.value) {
            return [];
        }

        return [
            {
                label: 'ИНН',
                value: formatCompanyValue(company.value.inn),
            },
            {
                label: 'Дата регистрации',
                value: normalizeDate(company.value.registrationDate),
                hint: registrationAge.value,
            },
            {
                label: 'Уставный фонд',
                value: formatCompanyValue(company.value.authorizedFund),
            },
            {
                label: 'Рейтинг устойчивости',
                value: formatCompanyValue(company.value.stabilityRating),
            },
        ];
    });

    const contactItems = computed<DetailsCardItem[]>(() => {
        if (!company.value) {
            return [];
        }

        return [
            {
                label: 'Телефон',
                value: formatCompanyValue(company.value.phone),
            },
            {
                label: 'Email',
                value: formatCompanyValue(company.value.email),
            },
            {
                label: 'Адрес',
                value: formatCompanyValue(company.value.address),
            },
            {
                label: 'Учредитель',
                value: formatCompanyValue(company.value.founder),
            },
            {
                label: 'Директор',
                value: formatCompanyValue(company.value.director),
            },
        ];
    });

    const aiBadges = computed<CompanyAiBadge[]>(() => {
        return company.value?.aiResult?.badges || [];
    });

    const aiFindings = computed<CompanyAiFinding[]>(() => {
        return company.value?.aiResult?.findings || [];
    });

    const aiRecommendations = computed(() => {
        return company.value?.aiResult?.recommendations || [];
    });

    const aiSummary = computed(() => {
        return company.value?.aiResult?.summary?.trim() || '';
    });

    const aiDisclaimer = computed(() => {
        return company.value?.aiResult?.disclaimer?.trim() || '';
    });

    const hasAiResult = computed(() => {
        return Boolean(
            company.value?.aiResult
            && (
                aiSummary.value
                || aiBadges.value.length
                || aiFindings.value.length
                || aiRecommendations.value.length
            ),
        );
    });

    const aiVerdictLabel = computed(() => {
        return getAiVerdictLabel(company.value?.aiResult?.verdict);
    });

    const aiRiskScoreLabel = computed(() => {
        const riskScore = company.value?.aiResult?.riskScore;
        return typeof riskScore === 'number' ? `${riskScore} / 100` : 'Не указан';
    });

    const legalSignals = computed<LegalSignalItem[]>(() => {
        if (!company.value) {
            return [];
        }

        const items: LegalSignalItem[] = [
            {
                label: 'Статус компании',
                value: companyStatusLabel.value,
                caption: 'Снимок из поля companyStatus.',
                tone: company.value.companyStatus === 'ACTIVE'
                    ? 'border-[var(--color-primary-30)] bg-[var(--color-primary-10)] text-[var(--color-primary)]'
                    : company.value.companyStatus === 'LIQUIDATED'
                        ? 'border-[#F3C4B4] bg-[#FFF1EC] text-[#BC5D33]'
                        : 'border-[#E8D7B5] bg-[#FFF8EC] text-[#8C6430]',
            },
            {
                label: 'Налоговая задолженность',
                value: company.value.texDebt ? 'Обнаружена' : 'Не обнаружена',
                caption: company.value.texDebt
                    ? 'Перед заключением договора лучше отдельно проверить детали задолженности.'
                    : 'По текущим данным задолженность не отмечена.',
                tone: company.value.texDebt
                    ? 'border-[#F3C4B4] bg-[#FFF1EC] text-[#BC5D33]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)]',
            },
            {
                label: 'Рейтинг устойчивости',
                value: formatCompanyValue(company.value.stabilityRating),
                caption: 'Числовой показатель стабильности компании.',
                tone: 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)]',
            },
        ];

        if (company.value.aiResult) {
            items.push(
                {
                    label: 'AI-вердикт',
                    value: aiVerdictLabel.value,
                    caption: 'Итоговая оценка риска от ИИ анализа.',
                    tone: company.value.aiResult.verdict === 'high_risk'
                        ? 'border-[#F3C4B4] bg-[#FFF1EC] text-[#BC5D33]'
                        : company.value.aiResult.verdict === 'medium_risk'
                            ? 'border-[#E8D7B5] bg-[#FFF8EC] text-[#8C6430]'
                            : 'border-[var(--color-primary-30)] bg-[var(--color-primary-10)] text-[var(--color-primary)]',
                },
                {
                    label: 'Risk score',
                    value: aiRiskScoreLabel.value,
                    caption: 'Числовой показать счетчика доверия.',
                    tone: 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)]',
                },
            );
        }

        return items;
    });

    const breadcrumbsLinks = computed(() => {
        return [
            {
                path: '/',
                text: 'Домашняя',
            },
            {
                path: '/company/counterparty-check',
                text: 'Проверка компании',
            },
            {
                path: route.fullPath,
                text: companyTitle.value,
            },
        ];
    });
</script>
