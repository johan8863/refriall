import { createRouter, createWebHistory } from 'vue-router'
import OrderList from "../views/orders/OrderList.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return {
      top: 0
    }
  },
  routes: [
    {
      path: '/',
      children: [
        {
          path: '',
          name: 'home',
          component: OrderList,
        },
        {
          path: 'stock',
          children: [
            {
              path: 'kits',
              children: [
                {
                  path: '',
                  name: 'kits',
                  component: () => import('../views/kits/KitList.vue'),
                },
                {
                  path: 'create', 
                  name: 'kits_create', 
                  component: () => import('../views/kits/KitForm.vue')
                },
                {
                  path: ':id',
                  children: [
                    {
                      path: 'detail', 
                      name: 'kits_detail', 
                      component: () => import('../views/kits/KitDetail.vue')
                    },
                    {
                      path: 'update', 
                      name: 'kits_update', 
                      component: () => import('../views/kits/KitForm.vue')
                    },
                    {
                      path: 'confirm/delete', 
                      name: 'kits_confirm_delete', 
                      component: () => import('../views/kits/KitConfirmDelete.vue')
                    },
                  ]
                },
              ]
            },
            {
              path: 'items',
              children: [
                {
                  path: '',
                  name: 'items',
                  component: () => import('../views/items/ItemList.vue')
                },
                {
                  path: 'create', 
                  name: 'items_create', 
                  component: () => import('../views/items/ItemForm.vue')
                },
                {
                  path: ':id',
                  children: [
                    {
                      path: 'detail', 
                      name: 'items_detail', 
                      component: () => import('../views/items/ItemDetail.vue')
                    },
                    {
                      path: 'update', 
                      name: 'items_update', 
                      component: () => import('../views/items/ItemForm.vue')
                    },
                    {
                      path: 'confirm/delete', 
                      name: 'items_confirm_delete', 
                      component: () => import('../views/items/ItemConfirmDelete.vue')
                    },
                  ]
                },
              ]
            },
          ]
        },
        {
          path: 'hr',
          children: [
            {
              path: 'providers',
              children: [
                {
                  path: '',
                  name: 'providers',
                  component: () => import('../views/providers/ProviderList.vue')
                },
                {
                  path: 'create',
                  name: 'providers_create', 
                  component: () => import('../views/providers/ProviderForm.vue')
                },
                {
                  path: ':id',
                  children: [
                    {
                      path: 'update',
                      name: 'providers_update', 
                      component: () => import('../views/providers/ProviderForm.vue')
                    },
                    {
                      path: 'detail', 
                      name: 'providers_detail', 
                      component: () => import('../views/providers/ProviderDetail.vue')
                    },
                    {
                      path: 'confirm/delete', 
                      name: 'providers_confirm_delete', 
                      component: () => import('../views/providers/ProviderConfirmDelte.vue')
                    },
                  ]
                },
              ]
            },
            {
              path: 'customers',
              children: [
                {
                  path: '',
                  name: 'customers',
                  component: () => import('../views/customers/CustomerList.vue')
                },
                {
                  path: 'create', 
                  name: 'customers_create', 
                  component: () => import('../views/customers/CustomerForm.vue')
                },
                {
                  path: ':id',
                  children: [
                    {
                      path: 'detail', 
                      name: 'customers_detail', 
                      component: () => import('../views/customers/CustomerDetail.vue')
                    },
                    {
                      path: 'update', 
                      name: 'customers_update', 
                      component: () => import('../views/customers/CustomerForm.vue')
                    },
                    {
                      path: 'confirm/delete', 
                      name: 'customers_confirm_delete', 
                      component: () => import('../views/customers/CustomerConfirmDelete.vue')
                    },
                    {
                      path: 'dependencies',
                      children: [
                        {
                          path: 'detail',
                          name: 'customer_dependecy_detail',
                          component: () => import ('../views/customerDependencies/CustomerDependencyDetail.vue')
                        },
                        {
                          path: 'create',
                          name: 'customer_dependecy_create',
                          component: () => import ('../views/customerDependencies/CustomerDependencyCreate.vue')
                        },
                        {
                          path: 'update',
                          name: 'customer_dependecy_update',
                          component: () => import ('../views/customerDependencies/CustomerDependencyUpdate.vue')
                        },
                        {
                          path: 'confirm/delete',
                          name: 'customer_dependecy_delete',
                          component: () => import ('../views/customerDependencies/CustomerDependencyConfirmDelete.vue')
                        },
                      ]
                    },
                  ]
                },
              ]
            },
          ]
        },
        {
          path: 'finance',
          children: [
            {
              path: 'currencies',
              children: [
                {
                  path: '',
                  name: 'currencies',
                  component: () => import ('../views/currencies/CurrencyList.vue')
                },
                {
                  path: 'create',
                  name: 'currency_create',
                  component: () => import ('../views/currencies/CurrencyForm.vue')
                },
                {
                  path: ':id',
                  children: [
                    {
                      path: 'detail',
                      name: 'currency_detail',
                      component: () => import ('../views/currencies/CurrencyDetail.vue')
                    },
                    {
                      path: 'update',
                      name: 'currency_update',
                      component: () => import ('../views/currencies/CurrencyForm.vue')
                    },
                    {
                      path: 'confirm/delete',
                      name: 'currency_delete',
                      component: () => import ('../views/currencies/CurrencyConfirmDelete.vue')
                    },
                  ]
                },
              ]
            },
            {
              path: 'orders',
              children: [
                {
                  path: '',
                  name: 'orders',
                  component: OrderList,
                },
                {
                  path: 'create', 
                  name: 'orders_create', 
                  component: () => import('../views/orders/OrderForm.vue')
                },
                {
                  path: ':id',
                  children: [
                    {
                      path: 'update', 
                      name: 'orders_update', 
                      component: () => import('../views/orders/OrderForm.vue')
                    },
                    {
                      path: 'detail', 
                      name: 'orders_detail', 
                      component: () => import('../views/orders/OrderDetail.vue'),
                    },
                    {
                      path: 'preorder', 
                      name: 'orders_detail_pre_order', 
                      component: () => import('../views/orders/OrderDetail.vue'),
                      meta: {
                        preOrder: true
                      }
                    },
                    {
                      path: 'confirm/delete', 
                      name: 'orders_confirm_delete', 
                      component: () => import('../views/orders/OrderConfirmDelete.vue')
                    },
                  ]
                },
              ]
            },
            {
              path: 'bills',
              children: [
                {
                  path: '',
                  name: 'bills',
                  component: () => import('../views/bills/BillList.vue')
                },
                {
                  path: 'create',
                  name: 'bills_create',
                  component: () => import('../views/bills/BillForm.vue')
                },
                {
                  path: ':id',
                  children: [
                    {
                      path: 'detail',
                      name: 'bills_detail',
                      component: () => import('../views/bills/BillDetail.vue')
                    },
                    {
                      path: 'update',
                      name: 'bills_update',
                      component: () => import('../views/bills/BillForm.vue')
                    },
                    {
                      path: 'confirm/delete',
                      name: 'bills_delete',
                      component: () => import('../views/bills/BillConfirmDelete.vue')
                    },
                  ]
                },
              ]
            },
          ]
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: {
        hideNavBar: true,
      },
    },
  ]
})

router.beforeEach(async (to) => {
  const { useAuthStore } = await import('../stores/authStore')
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated && to.name !== 'login') {
    return {
      name: 'login',
      query: { redirect: to.fullPath }
    }
  }
  if (authStore.isAuthenticated && to.name === 'login') {
    return { name: 'home'}
  }
})

export default router
