import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Ingre from '../views/IngredientView.vue'
import Plat from '../views/PlatView.vue'
import Ingr from '../views/IngredView.vue'
import Comm from '../views/CommandeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/ing',
    name: 'Ingre',
    component: Ingre
  },
  {
    path: '/pla',
    name: 'plat',
    component: Plat
  },
  {
    path: '/ingr',
    name: 'inge',
    component: Ingr
  },
  {
    path: '/com',
    name: 'commm',
    component: Comm
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
