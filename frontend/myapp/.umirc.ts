import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/login', component: '@/pages/login' },
    { path: '/register', component: '@/pages/register' },
<<<<<<< HEAD
    { path: '/studentcourse', component: '@/pages/studentcourse' }
=======
    { path: '/forgetpassword', component: '@/pages/forgetpassword' },
    { path: '/confirmpassword', component: '@/pages/confirmpassword' }
>>>>>>> 98193b33adc6f8ee97ab7d4dea4938ae9e393086
  ],
  fastRefresh: {},
  proxy: {
    '/service-ucenter': {
      'target': 'http://175.45.180.201:10900/',// to do localhost:8000
      'changeOrigin': true,
    },
  },
});
