import { createRouter, createWebHistory } from 'vue-router'
import KitList from "@/views/kits/KitList.vue";
import KitForm from "@/views/kits/KitForm.vue";
import KitDetail from "@/views/kits/KitDetail.vue";

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
