<template>
    <section class="counterparty-page pb-[188px] pt-[24px] md:pb-[80px]">
        <Breadcrumbs :links="breadcrumbsLinks" />

        <div class="container">
            <div class="space-y-[26px]">
                <section class="counterparty-hero relative overflow-hidden rounded-[10px] border border-[rgba(118,89,44,0.18)] bg-[linear-gradient(135deg,#7C5C2D_0%,#8E6A35_52%,#6F5127_100%)] !p-[30px] px-[32px] py-[28px] text-white shadow-[0_24px_60px_rgba(118,89,44,0.18)] max-md:px-[18px] max-md:py-[20px]">
                    <div class="pointer-events-none absolute inset-y-[-12%] right-[-4%] w-[260px] rounded-full border border-white/10 max-md:hidden" />
                    <div class="pointer-events-none absolute inset-y-[10%] right-[6%] w-[200px] rounded-full border border-white/8 max-md:hidden" />

                    <div class="relative z-10 max-w-[760px]">
                        <p class="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/70">
                            Проверка компании
                        </p>
                        <h1 class="!mt-[12px] text-[40px] font-semibold leading-[1] tracking-[-0.04em] text-white max-md:text-[30px]">
                            Проверка контрагентов
                        </h1>
                        <p class="!mt-[14px] max-w-[620px] text-[16px] leading-[26px] text-white/80 max-md:text-[14px] max-md:leading-[22px]">
                            Введите название компании, ИНН или имя учредителя. Страница покажет найденные организации и связанные стороны на основе ответа сервера.
                        </p>

                        <div class="!mt-[22px] flex flex-wrap gap-[10px]">
                            <button
                                v-for="tab in tabs"
                                :key="tab.value"
                                type="button"
                                class="!rounded-[8px] rounded-full border !p-[5px_10px] px-[14px] py-[9px] text-[13px] font-semibold transition-colors"
                                :class="activeTab === tab.value ? 'border-white bg-white text-[var(--color-primary)]' : 'border-white/22 bg-white/8 text-white/75 hover:border-white/40 hover:bg-white/12 hover:text-white'"
                                @click="activeTab = tab.value"
                            >
                                {{ tab.label }}
                            </button>
                        </div>

                        <form class="!mt-[22px] flex flex-col gap-[12px] sm:flex-row" @submit.prevent="handleSearch">
                            <div class="flex-1">
                                <input
                                    v-model="searchInput"
                                    type="text"
                                    placeholder="Искать по названию, ИНН или учредителю"
                                    class="w-full rounded-[14px] border border-white/14 bg-white !p-[15px_20px] px-[18px] text-[15px] text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-white/50"
                                >
                            </div>

                            <button
                                type="submit"
                                class="inline-flex h-[56px] min-w-[146px] items-center justify-center rounded-[14px] bg-[rgba(45,31,14,0.88)] px-[22px] text-[15px] font-semibold text-white transition-colors hover:bg-[rgba(45,31,14,1)] disabled:cursor-not-allowed disabled:opacity-70"
                                :disabled="isSearching"
                            >
                                {{ isSearching ? 'Ищем' : 'Искать' }}
                            </button>
                        </form>

                        <ErrorMessage v-if="searchError" class="!mt-[14px]" :text="searchError" />

                        <div class="!mt-[16px] flex flex-wrap items-center gap-[10px] text-[13px] leading-[20px] text-white/72">
                            <span class="rounded-[8px] border border-white/16 bg-white/8 !p-[5px_10px] px-[12px] py-[6px]">
                                Организации: {{ organizations.length }}
                            </span>
                            <span class="rounded-[8px] border border-white/16 bg-white/8 !p-[5px_10px] px-[12px] py-[6px]">
                                Учредители: {{ founderCards.length }}
                            </span>
                            <span v-if="hasSearched" class="rounded-[8px] border border-white/16 bg-white/8 !p-[5px_10px] px-[12px] py-[6px]">
                                По запросу: {{ submittedQuery }}
                            </span>
                            <span v-if="hasSearched && searchMeta" class="rounded-[8px] border border-white/16 bg-white/8 !p-[5px_10px] px-[12px] py-[6px]">
                                Всего найдено: {{ searchMeta.totalItems }}
                            </span>
                        </div>
                    </div>
                </section>

                <section class="grid gap-[18px] !m-[30px_0] lg:grid-cols-1">
                    <article
                        v-if="showOrganizations"
                        class="overflow-hidden rounded-[8px] border border-[var(--color-border)] bg-white !p-[22px] shadow-[0_18px_40px_rgba(45,51,56,0.06)]"
                    >
                        <div class="flex items-center justify-center gap-[12px] border-b border-[var(--color-border)] pb-[16px]">
                            <div class="min-w-0 w-full">
                                <h2 class="!text-[20px] text-center font-semibold leading-[24px] text-[var(--color-text-primary)]">
                                    Организации
                                </h2>
                                <p class="!mt-[4px] text-center text-[14px] leading-[20px] text-[var(--color-text-secondary)]">
                                    Найденные компании по введенному запросу.
                                </p>
                            </div>
                        </div>

                        <p
                            v-if="searchMeta && searchMeta.totalItems > organizations.length"
                            class="!mt-[16px] text-[13px] leading-[20px] text-[var(--color-text-secondary)]"
                        >
                            Показаны первые {{ organizations.length }} из {{ searchMeta.totalItems }} найденных компаний.
                        </p>

                        <div class="!mt-[18px] space-y-[12px]">
                            <template v-if="organizations.length">
                                <article
                                    v-for="organization in organizations"
                                    :key="organization.id"
                                    class="rounded-[18px] !mb-[30px] border border-[var(--color-border)] bg-[var(--color-surface)] !p-[16px]"
                                >
                                    <div class="flex flex-col gap-[10px] sm:flex-row sm:items-start sm:justify-between">
                                        <div class="min-w-0 flex-1">
                                            <h3 class="!text-[18px] break-words font-semibold leading-[22px] text-[var(--color-text-primary)] [overflow-wrap:anywhere]">
                                                {{ organization.name }}
                                            </h3>
                                            <p class="!mt-[6px] text-[13px] leading-[18px] text-[var(--color-text-secondary)]">
                                                ИНН {{ organization.inn }}
                                            </p>
                                        </div>

                                        <span
                                            class="shrink-0 self-start rounded-full !p-[5px_10px] px-[12px] py-[6px] text-[12px] font-semibold"
                                            :class="getCompanyStatusBadgeClass(organization.companyStatus)"
                                        >
                                            {{ getCompanyStatusLabel(organization.companyStatus) }}
                                        </span>
                                    </div>

                                    <dl class="!mt-[14px] grid gap-[10px] text-[14px] leading-[20px] text-[var(--color-text-secondary)] sm:grid-cols-2">
                                        <div class="min-w-0">
                                            <dt class="text-[12px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Директор</dt>
                                            <dd class="!mt-[4px] break-words text-[var(--color-text-primary)] [overflow-wrap:anywhere]">{{ formatText(organization.director) }}</dd>
                                        </div>
                                        <div class="min-w-0">
                                            <dt class="text-[12px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Учредитель</dt>
                                            <dd class="!mt-[4px] break-words text-[var(--color-text-primary)] [overflow-wrap:anywhere]">{{ formatText(organization.founder) }}</dd>
                                        </div>
                                    </dl>

                                    <div class="!mt-[14px] flex flex-wrap gap-[8px]">
                                        <span
                                            class="rounded-[8px] border !p-[5px_10px] px-[12px] py-[6px] text-[13px] leading-[18px]"
                                            :class="organization.texDebt ? 'border-[#F3C4B4] bg-[#FFF1EC] text-[#BC5D33]' : 'border-[var(--color-border)] bg-white text-[var(--color-text-primary)]'"
                                        >
                                            {{ organization.texDebt ? 'Есть налоговая задолженность' : 'Налоговая задолженность не найдена' }}
                                        </span>
                                    </div>

                                    <div class="!mt-[14px] flex justify-start sm:justify-end">
                                        <RouterLink
                                            :to="{ name: 'company-detail', params: { company_id: organization.id }, query: { name: organization.name } }"
                                            class="inline-flex w-full !p-[10px_20px] items-center justify-center rounded-[12px] border border-[var(--color-primary-30)] bg-white px-[16px] text-[14px] font-semibold text-[var(--color-primary)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-10)] sm:w-auto"
                                        >
                                            Открыть компанию
                                        </RouterLink>
                                    </div>
                                </article>
                            </template>

                            <div v-else class="rounded-[18px] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] !p-[24px] text-center">
                                <p class="text-[16px] font-semibold text-[var(--color-text-primary)]">
                                    {{ organizationStateTitle }}
                                </p>
                                <p class="!mt-[8px] text-[14px] leading-[22px] text-[var(--color-text-secondary)]">
                                    {{ organizationStateDescription }}
                                </p>
                            </div>
                        </div>
                    </article>

                    <article
                        v-if="showFounders"
                        class="overflow-hidden rounded-[8px] border border-[var(--color-border)] bg-white !p-[22px] shadow-[0_18px_40px_rgba(45,51,56,0.06)]"
                    >
                        <div class="flex items-center justify-center gap-[12px] border-b border-[var(--color-border)] pb-[16px]">
                            <div class="min-w-0 w-full">
                                <h2 class="!text-[20px] text-center font-semibold leading-[24px] text-[var(--color-text-primary)]">
                                    Учредители
                                </h2>
                                <p class="!mt-[4px] text-center text-[14px] leading-[20px] text-[var(--color-text-secondary)]">
                                    Сводка по найденным учредителям на основе текущей выдачи.
                                </p>
                            </div>
                        </div>

                        <div class="!mt-[18px] space-y-[12px]">
                            <template v-if="founderCards.length">
                                <article
                                    v-for="founder in founderCards"
                                    :key="founder.id"
                                    class="rounded-[18px] gap-[30px] border border-[var(--color-border)] bg-[var(--color-surface)] !p-[16px]"
                                >
                                    <div class="flex flex-col gap-[10px] sm:flex-row sm:items-start sm:justify-between">
                                        <div class="min-w-0 flex-1">
                                            <h3 class="!text-[18px] break-words font-semibold leading-[22px] text-[var(--color-text-primary)] [overflow-wrap:anywhere]">
                                                {{ founder.name }}
                                            </h3>
                                            <p class="!mt-[6px] break-words text-[13px] leading-[18px] text-[var(--color-text-secondary)] [overflow-wrap:anywhere]">
                                                {{ founder.role }}
                                            </p>
                                        </div>

                                        <span class="shrink-0 self-start rounded-full bg-white px-[12px] py-[6px] text-[12px] font-semibold text-[var(--color-text-secondary)]">
                                            {{ founder.companies.length }} компаний
                                        </span>
                                    </div>

                                    <div class="!mt-[14px] flex flex-wrap gap-[8px]">
                                        <span
                                            v-for="company in founder.companies"
                                            :key="company"
                                            class="max-w-full break-words rounded-full border border-[var(--color-border)] bg-white px-[12px] py-[6px] text-[13px] leading-[18px] text-[var(--color-text-primary)] [overflow-wrap:anywhere]"
                                        >
                                            {{ company }}
                                        </span>
                                    </div>
                                </article>
                            </template>

                            <div v-else class="rounded-[18px] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] !p-[24px] text-center">
                                <p class="text-[16px] font-semibold text-[var(--color-text-primary)]">
                                    {{ founderStateTitle }}
                                </p>
                                <p class="!mt-[8px] text-[14px] leading-[22px] text-[var(--color-text-secondary)]">
                                    {{ founderStateDescription }}
                                </p>
                            </div>
                        </div>
                    </article>
                </section>
            </div>
        </div>

        <div class="fixed bottom-[15px] left-[15px] right-[15px] z-20 md:hidden">
            <MobileChatTabbar />
        </div>
    </section>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue';

    import { searchCompanies } from '@/entities/companies/api/companies';
    import type {
        CompaniesPaginationMeta,
        CompanySearchListItem,
        CompanyStatus,
    } from '@/entities/companies/lib/types';
    import { getAuthRequestErrorMessage } from '@/entities/users/api/auth';
    import CounterpartyTabIcon from '@/shared/icons/chat/CounterpartyTab.vue';
    import UserAvatarIcon from '@/shared/icons/chat/UserAvatar.vue';
    import MobileChatTabbar from '@/shared/layout/MobileChatTabbar.vue';
    import Breadcrumbs from '@/shared/ui/Breadcrumbs.vue';
    import ErrorMessage from '@/shared/ui/ErrorMessage.vue';

    type SearchTab = 'all' | 'organizations' | 'founders';

    interface FounderDirectoryItem {
        id: string;
        name: string;
        role: string;
        companies: string[];
    }

    interface FounderEntry {
        name: string;
        share: string;
    }

    const breadcrumbsLinks = [
        {
            path: '/',
            text: 'Домашняя',
        },
        {
            path: '/company/counterparty-check',
            text: 'Проверка компании',
        },
    ];

    const tabs: Array<{ value: SearchTab; label: string }> = [
        { value: 'all', label: 'Все' },
        { value: 'organizations', label: 'Организации' },
        { value: 'founders', label: 'Учредители' },
    ];

    const searchInput = ref('');
    const submittedQuery = ref('');
    const activeTab = ref<SearchTab>('all');
    const isSearching = ref(false);
    const searchError = ref('');
    const organizations = ref<CompanySearchListItem[]>([]);
    const searchMeta = ref<CompaniesPaginationMeta | null>(null);
    let searchRequestId = 0;

    const normalize = (value: string) => {
        return value.replace(/\s+/g, ' ').trim().toLowerCase();
    };

    const formatText = (value?: string) => {
        return value?.trim() || 'Не указано';
    };

    const getCompanyStatusLabel = (status?: CompanyStatus) => {
        switch (status) {
            case 'ACTIVE':
                return 'Активна';
            case 'LIQUIDATED':
                return 'Ликвидирована';
            case 'ON_REVIEW':
                return 'Требует проверки';
            default:
                return status || 'Статус не указан';
        }
    };

    const getCompanyStatusBadgeClass = (status?: CompanyStatus) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-[var(--color-primary-10)] text-[var(--color-primary)]';
            case 'LIQUIDATED':
                return 'bg-[#FFF1EC] text-[#BC5D33]';
            default:
                return 'bg-[#FFF6E8] text-[#8C6430]';
        }
    };

    const extractFounderEntries = (founder: string): FounderEntry[] => {
        const normalizedFounder = founder.trim();

        if (!normalizedFounder) {
            return [];
        }

        const sharedFounderMatches = normalizedFounder.match(/.+?\d+(?:[.,]\d+)?%/g);

        if (!sharedFounderMatches?.length) {
            return [{ name: normalizedFounder, share: '' }];
        }

        return sharedFounderMatches
            .map((chunk) => {
                const trimmedChunk = chunk.trim();
                const shareMatch = trimmedChunk.match(/(\d+(?:[.,]\d+)?%)$/);

                return {
                    name: trimmedChunk.replace(/\s*\d+(?:[.,]\d+)?%$/, '').trim(),
                    share: shareMatch?.[1] || '',
                };
            })
            .filter((entry) => entry.name);
    };

    const hasSearched = computed(() => {
        return submittedQuery.value.trim().length > 0;
    });

    const founderCards = computed<FounderDirectoryItem[]>(() => {
        const foundersMap = new Map<string, {
            name: string;
            shares: Set<string>;
            companies: Set<string>;
            isDirector: boolean;
        }>();

        organizations.value.forEach((organization) => {
            const founderEntries = extractFounderEntries(organization.founder);

            founderEntries.forEach((entry) => {
                const founderKey = normalize(entry.name);
                const existingFounder = foundersMap.get(founderKey) || {
                    name: entry.name,
                    shares: new Set<string>(),
                    companies: new Set<string>(),
                    isDirector: false,
                };

                if (entry.share) {
                    existingFounder.shares.add(entry.share);
                }

                existingFounder.companies.add(organization.name);
                existingFounder.isDirector = existingFounder.isDirector
                    || normalize(organization.director) === founderKey;

                foundersMap.set(founderKey, existingFounder);
            });
        });

        return Array.from(foundersMap.values())
            .sort((left, right) => right.companies.size - left.companies.size || left.name.localeCompare(right.name))
            .map((founder, index) => {
                const shares = Array.from(founder.shares);
                let role = founder.isDirector ? 'Учредитель и руководитель' : 'Учредитель';

                if (shares.length === 1) {
                    role = `${role} · доля ${shares[0]}`;
                }
                else if (shares.length > 1) {
                    role = `${role} · несколько долей`;
                }

                return {
                    id: `${normalize(founder.name)}-${index}`,
                    name: founder.name,
                    role,
                    companies: Array.from(founder.companies).sort((left, right) => left.localeCompare(right)),
                };
            });
    });

    const showOrganizations = computed(() => {
        return activeTab.value === 'all' || activeTab.value === 'organizations';
    });

    const showFounders = computed(() => {
        return activeTab.value === 'all' || activeTab.value === 'founders';
    });

    const organizationStateTitle = computed(() => {
        if (isSearching.value) {
            return 'Ищем компании';
        }

        if (hasSearched.value) {
            return 'Организации не найдены';
        }

        return 'Начните поиск';
    });

    const organizationStateDescription = computed(() => {
        if (isSearching.value) {
            return 'Отправляем запрос в реестр компаний и собираем первую страницу результатов.';
        }

        if (hasSearched.value) {
            return 'Попробуйте изменить запрос или уточнить ИНН контрагента.';
        }

        return 'Введите название компании, ИНН или имя учредителя, чтобы получить список организаций.';
    });

    const founderStateTitle = computed(() => {
        if (isSearching.value) {
            return 'Собираем учредителей';
        }

        if (hasSearched.value) {
            return 'Учредители не найдены';
        }

        return 'Список учредителей пуст';
    });

    const founderStateDescription = computed(() => {
        if (isSearching.value) {
            return 'После ответа сервера мы соберем учредителей из найденных компаний.';
        }

        if (hasSearched.value) {
            return 'По текущей выдаче нет связанных учредителей. Попробуйте другое название или ИНН.';
        }

        return 'После ввода запроса здесь появятся учредители и связанные с ними компании.';
    });

    const handleSearch = async () => {
        const query = searchInput.value.trim();

        submittedQuery.value = query;
        searchError.value = '';
        searchRequestId += 1;

        if (!query) {
            organizations.value = [];
            searchMeta.value = null;
            return;
        }

        const currentRequestId = searchRequestId;
        isSearching.value = true;

        try {
            const response = await searchCompanies({
                search: query,
                order: 'desc',
                orderBy: 'name',
                page: 1,
                limit: 10,
            });

            if (searchRequestId !== currentRequestId) {
                return;
            }

            organizations.value = response.items;
            searchMeta.value = response.meta;
        }
        catch (error) {
            if (searchRequestId !== currentRequestId) {
                return;
            }

            organizations.value = [];
            searchMeta.value = null;
            searchError.value = getAuthRequestErrorMessage(error, 'Не удалось выполнить поиск компаний');
        }
        finally {
            if (searchRequestId === currentRequestId) {
                isSearching.value = false;
            }
        }
    };
</script>

<style scoped>
    .counterparty-hero::after {
        content: '';
        position: absolute;
        inset: auto auto 0 0;
        width: 220px;
        height: 220px;
        background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 72%);
        transform: translate(-25%, 25%);
    }
</style>
