import { createRouter, createWebHistory } from 'vue-router'
// kits
import KitList from "../views/kits/KitList.vue";
import KitForm from "../views/kits/KitForm.vue";
import KitDetail from "../views/kits/KitDetail.vue";
// items
import ItemDetail from "../views/items/ItemDetail.vue";
import ItemForm from "../views/items/ItemForm.vue";
import ItemList from "../views/items/ItemList.vue";
// providers
import ProviderDetail from "../views/providers/ProviderDetail.vue";
import ProviderForm from "../views/providers/ProviderForm.vue";
import ProviderList from "../views/providers/ProviderList.vue";
// customers
import CustomerDetail from "../views/customers/CustomerDetail.vue";
import CustomerForm from "../views/customers/CustomerForm.vue";
import CustomerList from "../views/customers/CustomerList.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: KitList
    },
    {
      path: '/kits',
      name: 'kits',
      // component: KitList,
      children: [
        {
          path: '',
          redirect: {name: 'kits_list'}
        },
        {
          path: 'list', 
          name: 'kits_list', 
          component: KitList,
        },
        {
          path: 'create', 
          name: 'kits_create', 
          component: KitForm
        },
        {
          path: 'detail/:id', 
          name: 'kits_detail', 
          component: KitDetail
        },
      ]
    },
    {
      path: '/items',
      name: 'items',
      // component: ItemList,
      children: [
        {
          path: '',
          redirect: {name: 'items_list'}
        },
        {
          path: 'list', 
          name: 'items_list', 
          component: ItemList,
        },
        {
          path: 'create', 
          name: 'items_create', 
          component: ItemForm
        },
        {
          path: 'detail/:id', 
          name: 'items_detail', 
          component: ItemDetail
        },
      ]
    },
    {
      path: '/providers',
      name: 'providers',
      // component: ProviderList,
      children: [
        {
          path: '',
          redirect: {name: 'providers_list'}
        },
        {
          path: 'list', 
          name: 'providers_list', 
          component: ProviderList,
        },
        {
          path: 'create', 
          name: 'providers_create', 
          component: ProviderForm
        },
        {
          path: 'detail/:id', 
          name: 'providers_detail', 
          component: ProviderDetail
        },
      ]
    },
    {
      path: '/customers',
      name: 'customers',
      // component: CustomerList,
      children: [
        {
          path: '',
          redirect: {name: 'customers_list'}
        },
        {
          path: 'list', 
          name: 'customers_list', 
          component: CustomerList,
        },
        {
          path: 'create', 
          name: 'customers_create', 
          component: CustomerForm
        },
        {
          path: 'detail/:id', 
          name: 'customers_detail', 
          component: CustomerDetail
        },
      ]
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('@/views/kits/KitList.vue')
    // }
  ]
})

export default router
