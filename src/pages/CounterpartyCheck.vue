<template>
    <section class="counterparty-page pb-[188px] pt-[24px] md:pb-[80px]">
        <Breadcrumbs :links="breadcrumbsLinks" />

        <div class="container">
            <div class="space-y-[26px]">
                <section class="counterparty-hero !p-[30px] relative overflow-hidden rounded-[10px] border border-[rgba(118,89,44,0.18)] bg-[linear-gradient(135deg,#7C5C2D_0%,#8E6A35_52%,#6F5127_100%)] px-[32px] py-[28px] text-white shadow-[0_24px_60px_rgba(118,89,44,0.18)] max-md:px-[18px] max-md:py-[20px]">
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
                            Введите название компании, ИНН или имя учредителя. Экран покажет найденные организации и связанных участников без чатового режима.
                        </p>

                        <div class="!mt-[22px] flex flex-wrap gap-[10px]">
                            <button
                                v-for="tab in tabs"
                                :key="tab.value"
                                type="button"
                                class="rounded-full border !p-[5px_10px] px-[14px] py-[9px] text-[13px] font-semibold transition-colors !rounded-[8px]"
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
                                    class="!p-[15px_20px] w-full rounded-[14px] border border-white/14 bg-white px-[18px] text-[15px] text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-white/50"
                                >
                            </div>

                            <button
                                type="submit"
                                class="inline-flex h-[56px] min-w-[146px] items-center justify-center rounded-[14px] bg-[rgba(45,31,14,0.88)] px-[22px] text-[15px] font-semibold text-white transition-colors hover:bg-[rgba(45,31,14,1)]"
                            >
                                Искать
                            </button>
                        </form>

                        <div class="!mt-[16px] flex flex-wrap items-center gap-[10px] text-[13px] leading-[20px] text-white/72">
                            <span class="rounded-[8px] !p-[5px_10px] border border-white/16 bg-white/8 px-[12px] py-[6px]">
                                Организации: {{ filteredOrganizations.length }}
                            </span>
                            <span class="rounded-[8px] !p-[5px_10px] border border-white/16 bg-white/8 px-[12px] py-[6px]">
                                Учредители: {{ filteredFounders.length }}
                            </span>
                            <span v-if="hasSearched" class="rounded-[8px] !p-[5px_10px] border border-white/16 bg-white/8 px-[12px] py-[6px]">
                                По запросу: {{ submittedQuery }}
                            </span>
                        </div>
                    </div>
                </section>

                <section class="grid gap-[18px] lg:grid-cols-1 !m-[30px_0]">
                    <article
                        v-if="showOrganizations"
                        class="rounded-[8px] border border-[var(--color-border)] bg-white !p-[22px] shadow-[0_18px_40px_rgba(45,51,56,0.06)]"
                    >
                        <div class="flex items-center justify-center gap-[12px] border-b border-[var(--color-border)] pb-[16px]">
                            <span class="flex h-[40px] w-[40px] items-center justify-center rounded-[12px] bg-[var(--color-primary-10)] text-[var(--color-primary)]">
                                <CounterpartyTabIcon />
                            </span>

                            <div class="min-w-0">
                                <h2 class="text-[20px] text-center font-semibold leading-[24px] text-[var(--color-text-primary)]">
                                    Организации
                                </h2>
                                <p class="!mt-[4px] text-[14px] text-center leading-[20px] text-[var(--color-text-secondary)]">
                                    Найденные компании по введенному запросу.
                                </p>
                            </div>
                        </div>

                        <div class="!mt-[18px] space-y-[12px]">
                            <template v-if="filteredOrganizations.length">
                                <article
                                    v-for="organization in filteredOrganizations"
                                    :key="organization.id"
                                    class="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] !p-[16px]"
                                >
                                    <div class="flex flex-wrap items-start justify-between gap-[10px]">
                                        <div class="min-w-0">
                                            <h3 class="truncate text-[18px] font-semibold leading-[22px] text-[var(--color-text-primary)]">
                                                {{ organization.name }}
                                            </h3>
                                            <p class="!mt-[6px] text-[13px] leading-[18px] text-[var(--color-text-secondary)]">
                                                ИНН {{ organization.inn }} · {{ organization.region }}
                                            </p>
                                        </div>

                                        <span
                                            class="shrink-0 rounded-full px-[12px] py-[6px] text-[12px] font-semibold"
                                            :class="organization.status === 'Активна' ? 'bg-[var(--color-primary-10)] text-[var(--color-primary)]' : 'bg-[#FFF1EC] text-[#BC5D33]'"
                                        >
                                            {{ organization.status }}
                                        </span>
                                    </div>

                                    <dl class="!mt-[14px] grid gap-[10px] text-[14px] leading-[20px] text-[var(--color-text-secondary)] sm:grid-cols-2">
                                        <div>
                                            <dt class="text-[12px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Директор</dt>
                                            <dd class="!mt-[4px] text-[var(--color-text-primary)]">{{ organization.director }}</dd>
                                        </div>
                                        <div>
                                            <dt class="text-[12px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Учредители</dt>
                                            <dd class="!mt-[4px] text-[var(--color-text-primary)]">{{ organization.founders.join(', ') }}</dd>
                                        </div>
                                    </dl>

                                    <div class="!mt-[14px] flex justify-end">
                                        <RouterLink
                                            :to="{ name: 'company-detail', params: { company_id: organization.id }, query: { name: organization.name } }"
                                            class="inline-flex min-h-[42px] items-center justify-center rounded-[12px] border border-[var(--color-primary-30)] bg-white px-[16px] text-[14px] font-semibold text-[var(--color-primary)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-10)]"
                                        >
                                            Открыть компанию
                                        </RouterLink>
                                    </div>
                                </article>
                            </template>

                            <div v-else class="rounded-[18px] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] !p-[24px] text-center">
                                <p class="text-[16px] font-semibold text-[var(--color-text-primary)]">
                                    {{ hasSearched ? 'Организации не найдены' : 'Начните поиск' }}
                                </p>
                                <p class="!mt-[8px] text-[14px] leading-[22px] text-[var(--color-text-secondary)]">
                                    {{ hasSearched ? 'Попробуйте изменить запрос или уточнить ИНН контрагента.' : 'Введите название компании или ИНН, чтобы получить список организаций.' }}
                                </p>
                            </div>
                        </div>
                    </article>

                    <article
                        v-if="showFounders"
                        class="rounded-[8px] border border-[var(--color-border)] bg-white !p-[22px] shadow-[0_18px_40px_rgba(45,51,56,0.06)]"
                    >
                        <div class="flex items-center justify-center gap-[12px] border-b border-[var(--color-border)] pb-[16px]">
                            <span class="flex h-[40px] w-[40px] items-center justify-center rounded-[12px] bg-[var(--color-primary-10)] text-[var(--color-primary)]">
                                <UserAvatarIcon />
                            </span>

                            <div class="min-w-0">
                                <h2 class="text-[20px] text-center font-semibold leading-[24px] text-[var(--color-text-primary)]">
                                    Учредители
                                </h2>
                                <p class="!mt-[4px] text-center text-[14px] leading-[20px] text-[var(--color-text-secondary)]">
                                    Связанные участники и компании по вашему запросу.
                                </p>
                            </div>
                        </div>

                        <div class="!mt-[18px] space-y-[12px]">
                            <template v-if="filteredFounders.length">
                                <article
                                    v-for="founder in filteredFounders"
                                    :key="founder.id"
                                    class="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] !p-[16px]"
                                >
                                    <div class="flex flex-wrap items-start justify-between gap-[10px]">
                                        <div class="min-w-0">
                                            <h3 class="truncate text-[18px] font-semibold leading-[22px] text-[var(--color-text-primary)]">
                                                {{ founder.name }}
                                            </h3>
                                            <p class="!mt-[6px] text-[13px] leading-[18px] text-[var(--color-text-secondary)]">
                                                {{ founder.role }}
                                            </p>
                                        </div>

                                        <span class="shrink-0 rounded-full bg-white px-[12px] py-[6px] text-[12px] font-semibold text-[var(--color-text-secondary)]">
                                            {{ founder.companies.length }} компаний
                                        </span>
                                    </div>

                                    <div class="!mt-[14px] flex flex-wrap gap-[8px]">
                                        <span
                                            v-for="company in founder.companies"
                                            :key="company"
                                            class="rounded-full border border-[var(--color-border)] bg-white px-[12px] py-[6px] text-[13px] leading-[18px] text-[var(--color-text-primary)]"
                                        >
                                            {{ company }}
                                        </span>
                                    </div>
                                </article>
                            </template>

                            <div v-else class="rounded-[18px] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] !p-[24px] text-center">
                                <p class="text-[16px] font-semibold text-[var(--color-text-primary)]">
                                    {{ hasSearched ? 'Учредители не найдены' : 'Список учредителей пуст' }}
                                </p>
                                <p class="!mt-[8px] text-[14px] leading-[22px] text-[var(--color-text-secondary)]">
                                    {{ hasSearched ? 'Введите фамилию участника или попробуйте поиск по названию компании.' : 'После ввода запроса здесь появятся связанные учредители и участники.' }}
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

    import MobileChatTabbar from '@/shared/layout/MobileChatTabbar.vue';
    import CounterpartyTabIcon from '@/shared/icons/chat/CounterpartyTab.vue';
    import UserAvatarIcon from '@/shared/icons/chat/UserAvatar.vue';
    import Breadcrumbs from '@/shared/ui/Breadcrumbs.vue';

    type SearchTab = 'all' | 'organizations' | 'founders';

    interface OrganizationDirectoryItem {
        id: string;
        name: string;
        inn: string;
        status: 'Активна' | 'Требует проверки';
        region: string;
        director: string;
        founders: string[];
    }

    interface FounderDirectoryItem {
        id: string;
        name: string;
        role: string;
        companies: string[];
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

    const organizationDirectory: OrganizationDirectoryItem[] = [
        {
            id: 'org-1',
            name: 'ООО Вектор Строй',
            inn: '309874551',
            status: 'Активна',
            region: 'Ташкент',
            director: 'Сабитов Данил Владиславович',
            founders: ['Азимов Джахонгир', 'Сабитов Данил'],
        },
        {
            id: 'org-2',
            name: 'OOO LOGI JL',
            inn: '307116298',
            status: 'Требует проверки',
            region: 'Ташкентская область',
            director: 'Азимов Джахонгир Абдукахор угли',
            founders: ['Азимов Джахонгир', 'Ибрагимов Темур'],
        },
        {
            id: 'org-3',
            name: 'ООО Ромашка Логистик',
            inn: '301442170',
            status: 'Активна',
            region: 'Самарканд',
            director: 'Каримова Дилноза Рустамовна',
            founders: ['Каримова Дилноза', 'Абдуллаев Бекзод'],
        },
    ];

    const foundersDirectory: FounderDirectoryItem[] = [
        {
            id: 'founder-1',
            name: 'Азимов Джахонгир Абдукахор угли',
            role: 'Учредитель и руководитель',
            companies: ['OOO LOGI JL', 'ООО Вектор Строй'],
        },
        {
            id: 'founder-2',
            name: 'Сабитов Данил Владиславович',
            role: 'Учредитель',
            companies: ['ООО Вектор Строй'],
        },
        {
            id: 'founder-3',
            name: 'Каримова Дилноза Рустамовна',
            role: 'Учредитель',
            companies: ['ООО Ромашка Логистик'],
        },
    ];

    const searchInput = ref('');
    const submittedQuery = ref('');
    const activeTab = ref<SearchTab>('all');

    const normalize = (value: string) => {
        return value.trim().toLowerCase();
    };

    const hasSearched = computed(() => {
        return submittedQuery.value.trim().length > 0;
    });

    const filteredOrganizations = computed(() => {
        if (!hasSearched.value) {
            return [];
        }

        const query = normalize(submittedQuery.value);

        return organizationDirectory.filter((organization) => {
            return [
                organization.name,
                organization.inn,
                organization.region,
                organization.director,
                ...organization.founders,
            ]
                .join(' ')
                .toLowerCase()
                .includes(query);
        });
    });

    const filteredFounders = computed(() => {
        if (!hasSearched.value) {
            return [];
        }

        const query = normalize(submittedQuery.value);

        return foundersDirectory.filter((founder) => {
            return [founder.name, founder.role, ...founder.companies]
                .join(' ')
                .toLowerCase()
                .includes(query);
        });
    });

    const showOrganizations = computed(() => {
        return activeTab.value === 'all' || activeTab.value === 'organizations';
    });

    const showFounders = computed(() => {
        return activeTab.value === 'all' || activeTab.value === 'founders';
    });

    const handleSearch = () => {
        submittedQuery.value = searchInput.value.trim();
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
