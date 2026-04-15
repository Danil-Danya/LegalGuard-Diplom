import { createRouter, createWebHistory } from 'vue-router';
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'site',
            component: () => import('@/pages/index/Index.vue'),
            meta: {
                layout: 'site'
            }
        },
        {
            path: '/registration',
            name: 'registration',
            component: () => import('@/pages/Registration.vue'),
            meta: {
                layout: 'login'
            }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/pages/Login.vue'),
            meta: {
                layout: 'login'
            }
        },
        {
            path: '/profile/create',
            name: 'profile-create',
            component: () => import('@/pages/ProfileCreate.vue'),
            meta: {
                layout: 'login'
            }
        },
        {
            path: '/chat/new-chat',
            name: 'chat-new',
            component: () => import('@/pages/Chat.vue'),
            meta: {
                layout: 'chat'
            }
        },
        {
            path: '/contracts/templates',
            name: 'contract-templates',
            component: () => import('@/pages/ContractTemplates.vue'),
            meta: {
                layout: 'contracts'
            }
        },
        {
            path: '/template/:slug',
            name: 'template-detail',
            component: () => import('@/pages/TemplateDetail.vue'),
            meta: {
                layout: 'contracts'
            }
        },
        {
            path: '/contracts/templates/:template_name/contract_id/step-one',
            name: 'contract-templates-one',
            component: () => import('@/pages/ContractTemplateName.vue'),
            meta: {
                layout: 'contracts'
            }
        },

        {
            path: '/contracts/templates/:template_name/contract_id/step-two',
            name: 'contract-templates-two',
            component: () => import('@/pages/ContractTemplateBody.vue'),
            meta: {
                layout: 'contracts'
            }
        },
        {
            path: '/contracts/:template_name/contract_id/step-three',
            name: 'contract-templates-three',
            component: () => import('@/pages/ContractTemplateStamp.vue'),
            meta: {
                layout: 'contracts'
            }
        },
        {
            path: '/contracts/:template_name/:document_id/ready',
            name: 'contract-template-ready',
            alias: '/contracts/:template_name/contract_id/ready',
            component: () => import('@/pages/ContractTemplateReady.vue'),
            meta: {
                layout: 'contracts'
            }
        },
        {
            path: '/company/counterparty-check',
            name: 'counterparty-check',
            component: () => import('@/pages/CounterpartyCheck.vue'),
            meta: {
                layout: 'contracts'
            }
        },
        {
            path: '/company/:company_id',
            name: 'company-detail',
            component: () => import('@/pages/CompanyDetails.vue'),
            meta: {
                layout: 'contracts'
            }
        },
        {
            path: '/chat/:chat_id',
            name: 'chat',
            component: () => import('@/pages/Chat.vue'),
            meta: {
                layout: 'chat'
            }
        },
        {
            path: '/chat/analytic/chat_id',
            name: 'chat-analytic',
            component: () => import('@/pages/ChatAnalytic.vue'),
            meta: {
                layout: 'chat'
            }
        },
        {
            path: '/chat/settings',
            name: 'chat-settings',
            component: () => import('@/pages/ChatSettings.vue'),
            meta: {
                layout: 'chat'
            }
        },
    ]
})


export default router;
