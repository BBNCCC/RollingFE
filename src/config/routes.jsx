import HomePage from '@/pages/home'
import LoginPage from '@/pages/login'
import PanelPage from '@/pages/panel'

export const protectedRoutes = [
  {
    key: 'panel',
    path: '/panel',
    component: PanelPage,
  },
]

export const publicRoutes = [
  {
    key: 'home',
    path: '/',
    component: HomePage,
  },
  {
    key: 'login',
    path: '/login',
    component: LoginPage,
  },
]
