import {
  createRouter,
  createWebHistory
} from 'vue-router'

import LoginView from '../views/LoginView.vue'
import TicketDashboardView from '../views/TicketDashboardView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import { useAuth } from '../composables/useAuth'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      redirect: '/tickets'
    },
    {
      path: '/login',
      component: LoginView
    },
    {
      path: '/tickets',
      component: TicketDashboardView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/:pathMatch(.*)*',
      component: NotFoundView
    }
  ]
})

router.beforeEach(
  async (to) => {
    const {
      user,
      loadUser
    } = useAuth()

    if (!user.value) {
      await loadUser()
    }

    if (
      to.meta.requiresAuth &&
      !user.value
    ) {
      return '/login'
    }

    if (
      to.path === '/login' &&
      user.value
    ) {
      return '/tickets'
    }
  }
)

export default router