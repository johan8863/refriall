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
      name: 'home',
      component: OrderList
    },
    {
      path: '/kits',
      name: 'kits',
      component: () => import('../views/kits/KitList.vue'),
    },
    {
      path: '/kits/create', 
      name: 'kits_create', 
      component: () => import('../views/kits/KitForm.vue')
    },
    {
      path: '/kits/detail/:id', 
      name: 'kits_detail', 
      component: () => import('../views/kits/KitDetail.vue')
    },
    {
      path: '/kits/update/:id', 
      name: 'kits_update', 
      component: () => import('../views/kits/KitForm.vue')
    },
    {
      path: '/kits/confirm/delete/:id', 
      name: 'kits_confirm_delete', 
      component: () => import('../views/kits/KitConfirmDelete.vue')
    },
    {
      path: '/items',
      name: 'items',
      component: () => import('../views/items/ItemList.vue')
    },
    {
      path: '/items/create', 
      name: 'items_create', 
      component: () => import('../views/items/ItemForm.vue')
    },
    {
      path: '/items/detail/:id', 
      name: 'items_detail', 
      component: () => import('../views/items/ItemDetail.vue')
    },
    {
      path: '/items/update/:id', 
      name: 'items_update', 
      component: () => import('../views/items/ItemForm.vue')
    },
    {
      path: '/items/confirm/delete/:id', 
      name: 'items_confirm_delete', 
      component: () => import('../views/items/ItemConfirmDelete.vue')
    },
    {
      path: '/providers',
      name: 'providers',
      component: () => import('../views/providers/ProviderList.vue')
    },
    {
      path: '/providers/create', 
      name: 'providers_create', 
      component: () => import('../views/providers/ProviderForm.vue')
    },
    {
      path: '/providers/detail/:id', 
      name: 'providers_detail', 
      component: () => import('../views/providers/ProviderDetail.vue')
    },
    {
      path: '/customers',
      name: 'customers',
      component: () => import('../views/customers/CustomerList.vue')
    },
    {
      path: '/customers/create', 
      name: 'customers_create', 
      component: () => import('../views/customers/CustomerForm.vue')
    },
    {
      path: '/customers/detail/:id', 
      name: 'customers_detail', 
      component: () => import('../views/customers/CustomerDetail.vue')
    },
    {
      path: '/customers/update/:id', 
      name: 'customers_update', 
      component: () => import('../views/customers/CustomerForm.vue')
    },
    {
      path: '/customers/confirm/delete/:id', 
      name: 'customers_confirm_delete', 
      component: () => import('../views/customers/CustomerConfirmDelete.vue')
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrderList,
    },
    {
      path: '/orders/create', 
      name: 'orders_create', 
      component: () => import('../views/orders/OrderForm.vue')
    },
    {
      path: '/orders/update/:id', 
      name: 'orders_update', 
      component: () => import('../views/orders/OrderForm.vue')
    },
    {
      path: '/orders/detail/:id', 
      name: 'orders_detail', 
      component: () => import('../views/orders/OrderDetail.vue')
    },
    {
      path: '/orders/confirm/delete/:id', 
      name: 'orders_confirm_delete', 
      component: () => import('../views/orders/OrderConfirmDelete.vue')
    },
  ]
})

export default router
