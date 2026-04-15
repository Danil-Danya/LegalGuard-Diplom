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
                                    class="rounded-full px-[12px] py-[6px] text-[12px] font-semibold uppercase tracking-[0.08em]"
                                    :class="statusBadgeClass"
                                >
                                    {{ companyStatusLabel }}
                                </span>

                                <span class="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-[12px] py-[6px] text-[12px] font-semibold text-[var(--color-text-secondary)]">
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
                            class="inline-flex min-h-[52px] items-center justify-center rounded-[14px] border border-[var(--color-primary-30)] bg-[var(--color-primary)] px-[20px] text-[15px] font-semibold text-white transition-colors hover:bg-accent"
                        >
                            К поиску компаний
                        </RouterLink>
                    </div>
                </section>

                <div class="grid gap-[18px] xl:grid-cols-[minmax(0,1.35fr)_360px]">
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
                                        Только те поля, которые реально есть у компании.
                                    </p>
                                </div>
                            </div>

                            <dl class="!mt-[18px] grid gap-[14px] sm:grid-cols-2">
                                <div v-for="item in basicInformationItems" :key="item.label" class="rounded-[16px] bg-[var(--color-surface)] !p-[16px]">
                                    <dt class="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                                        {{ item.label }}
                                    </dt>
                                    <dd class="!mt-[8px] text-[18px] font-semibold leading-[24px] text-[var(--color-text-primary)] break-words">
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
                                        Контактные данные, адрес и учредитель компании.
                                    </p>
                                </div>
                            </div>

                            <dl class="!mt-[18px] grid gap-[14px] sm:grid-cols-2">
                                <div v-for="item in contactItems" :key="item.label" class="rounded-[16px] bg-[var(--color-surface)] !p-[16px]">
                                    <dt class="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                                        {{ item.label }}
                                    </dt>
                                    <dd class="!mt-[8px] text-[16px] font-semibold leading-[24px] text-[var(--color-text-primary)] break-words">
                                        {{ item.value }}
                                    </dd>
                                </div>
                            </dl>
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

                            <div class="!mt-[20px] border-t border-white/10 pt-[16px]">
                                <p class="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/46">
                                    Текущий срез
                                </p>
                                <p class="!mt-[6px] text-[14px] font-medium leading-[22px] text-white">
                                    Директор: {{ company.director }}
                                </p>
                            </div>
                        </article>

                        <article class="rounded-[10px] border border-[rgba(118,89,44,0.18)] bg-white !p-[24px] shadow-[0_18px_40px_rgba(45,51,56,0.06)] max-md:!p-[18px]">
                            <p class="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                                Юридические сигналы
                            </p>

                            <div class="!mt-[16px] space-y-[12px]">
                                <div
                                    v-for="signal in legalSignals"
                                    :key="signal.label"
                                    class="rounded-[16px] border !p-[14px_16px]"
                                    :class="signal.tone"
                                >
                                    <p class="text-[12px] font-semibold uppercase tracking-[0.16em]">
                                        {{ signal.label }}
                                    </p>
                                    <p class="!mt-[6px] text-[16px] font-semibold leading-[22px] break-words">
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

            <div v-else class="rounded-[10px] border border-dashed border-[var(--color-border)] bg-white !p-[28px] text-center shadow-[0_18px_40px_rgba(45,51,56,0.06)]">
                <h1 class="text-[28px] font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">
                    Компания не найдена
                </h1>
                <p class="!mt-[10px] text-[15px] leading-[24px] text-[var(--color-text-secondary)]">
                    Проверьте ссылку или вернитесь к поиску и откройте карточку компании заново.
                </p>

                <RouterLink
                    to="/company/counterparty-check"
                    class="!mt-[18px] inline-flex !p-[15px_25px] items-center justify-center rounded-[12px] bg-[var(--color-primary)] px-[18px] text-[15px] font-semibold !text-white transition-colors hover:bg-accent"
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
    import { computed } from 'vue';
    import { useRoute } from 'vue-router';

    import MobileChatTabbar from '@/shared/layout/MobileChatTabbar.vue';
    import Breadcrumbs from '@/shared/ui/Breadcrumbs.vue';

    type CompanyStatus = 'ACTIVE' | 'ON_REVIEW' | 'LIQUIDATED' | string;

    interface CompanyDetailsRecord {
        id: string;
        inn: string;
        phone: string;
        email: string;
        address: string;
        founder: string;
        texDebt: boolean;
        director: string;
        companyStatus: CompanyStatus;
        stabilityRating: string;
        authorizedFund: string;
        registrationDate: string;
    }

    const route = useRoute();

    const companyDirectory: CompanyDetailsRecord[] = [
        {
            id: 'org-1',
            inn: '309874551',
            phone: '+998 90 123 45 67',
            email: 'office@vectorstroy.uz',
            address: 'г. Ташкент, Мирзо-Улугбекский район, ул. Буюк Ипак Йули, 17',
            founder: 'Азимов Джахонгир Абдукахор угли',
            texDebt: false,
            director: 'Сабитов Данил Владиславович',
            companyStatus: 'ACTIVE',
            stabilityRating: 'Высокая',
            authorizedFund: '850 000 000 UZS',
            registrationDate: '2019-08-15',
        },
        {
            id: 'org-2',
            inn: '307116298',
            phone: '+998 97 550 10 10',
            email: 'support@logijl.uz',
            address: 'Ташкентская область, Зангиатинский район, ул. Уста Ширин, 5',
            founder: 'Азимов Джахонгир Абдукахор угли',
            texDebt: true,
            director: 'Азимов Джахонгир Абдукахор угли',
            companyStatus: 'ON_REVIEW',
            stabilityRating: 'Средняя',
            authorizedFund: '500 000 000 UZS',
            registrationDate: '2017-05-19',
        },
        {
            id: 'org-3',
            inn: '301442170',
            phone: '+998 91 777 22 11',
            email: 'hello@romashka-logistic.uz',
            address: 'г. Самарканд, ул. Регистан, 44',
            founder: 'Каримова Дилноза Рустамовна',
            texDebt: false,
            director: 'Каримова Дилноза Рустамовна',
            companyStatus: 'ACTIVE',
            stabilityRating: 'Стабильная',
            authorizedFund: '1 200 000 000 UZS',
            registrationDate: '2014-02-11',
        },
    ];

    const companyId = computed(() => {
        const { company_id } = route.params;
        return Array.isArray(company_id) ? company_id[0] : company_id;
    });

    const company = computed(() => {
        return companyDirectory.find((item) => item.id === companyId.value) || null;
    });

    const companyTitle = computed(() => {
        const routeName = Array.isArray(route.query.name) ? route.query.name[0] : route.query.name;

        if (typeof routeName === 'string' && routeName.trim()) {
            return routeName.trim();
        }

        if (!company.value) {
            return 'Компания';
        }

        return `Компания ${company.value.inn}`;
    });

    const normalizeDate = (value?: string) => {
        if (!value) {
            return 'Не указана';
        }

        const parsed = new Date(value);

        if (Number.isNaN(parsed.getTime())) {
            return value;
        }

        return parsed.toLocaleDateString('ru-RU');
    };

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
            return 'Менее года';
        }

        return `${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'} на рынке`;
    });

    const companyStatusLabel = computed(() => {
        const status = company.value?.companyStatus;

        switch (status) {
            case 'ACTIVE':
                return 'Действует';
            case 'ON_REVIEW':
                return 'Требует проверки';
            case 'LIQUIDATED':
                return 'Ликвидирована';
            default:
                return status || 'Статус не указан';
        }
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

        return `Компания зарегистрирована ${normalizeDate(company.value.registrationDate)}. Руководитель: ${company.value.director}. Учредитель: ${company.value.founder}. Текущий статус: ${companyStatusLabel.value.toLowerCase()}.`;
    });

    const companyOverview = computed(() => {
        if (!company.value) {
            return '';
        }

        const debtText = company.value.texDebt
            ? 'По компании отмечена налоговая задолженность, поэтому перед сделкой нужна дополнительная проверка.'
            : 'Налоговая задолженность не обнаружена, что снижает базовые риски по текущему срезу данных.';

        return `${companyTitle.value} зарегистрирована ${normalizeDate(company.value.registrationDate)} и ведется под руководством ${company.value.director}. Учредитель компании: ${company.value.founder}. Показатель устойчивости: ${company.value.stabilityRating}. ${debtText}`;
    });

    const basicInformationItems = computed(() => {
        if (!company.value) {
            return [];
        }

        return [
            {
                label: 'ИНН',
                value: company.value.inn,
                hint: '',
            },
            {
                label: 'Дата регистрации',
                value: normalizeDate(company.value.registrationDate),
                hint: registrationAge.value,
            },
            {
                label: 'Уставный фонд',
                value: company.value.authorizedFund,
                hint: '',
            },
            {
                label: 'Директор',
                value: company.value.director,
                hint: '',
            },
        ];
    });

    const contactItems = computed(() => {
        if (!company.value) {
            return [];
        }

        return [
            {
                label: 'Телефон',
                value: company.value.phone,
            },
            {
                label: 'Email',
                value: company.value.email,
            },
            {
                label: 'Адрес',
                value: company.value.address,
            },
            {
                label: 'Учредитель',
                value: company.value.founder,
            },
        ];
    });

    const legalSignals = computed(() => {
        if (!company.value) {
            return [];
        }

        return [
            {
                label: 'Статус компании',
                value: companyStatusLabel.value,
                caption: 'Снимок по полю companyStatus.',
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
                    ? 'Перед заключением договора лучше проверить задолженность отдельно.'
                    : 'По текущим данным задолженность не отмечена.',
                tone: company.value.texDebt
                    ? 'border-[#F3C4B4] bg-[#FFF1EC] text-[#BC5D33]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)]',
            },
            {
                label: 'Рейтинг устойчивости',
                value: company.value.stabilityRating,
                caption: 'Значение приходит из поля stabilityRating.',
                tone: 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)]',
            },
        ];
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
