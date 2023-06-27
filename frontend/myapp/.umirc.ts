import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/1', component: '@/pages/StaffDashboardContent' },
    { path: '/login', component: '@/pages/login' },
    { path: '/register', component: '@/pages/register' },
    { path: '/studentcourse', component: '@/pages/studentcourse' },
    { path: '/viewstudentcourse', component: '@/pages/viewstudentcourse' },
    { path: '/forgetpassword', component: '@/pages/forgetpassword' },
    { path: '/confirmpassword', component: '@/pages/confirmpassword' }
  ],
  fastRefresh: {},
  proxy: {
    '/service-ucenter': {
      'target': 'http://175.45.180.201:10900/',// to do localhost:8000
      'changeOrigin': true,
    },
    '/service-edu': {
      'target': 'http://175.45.180.201:10900/',// to do localhost:8000
      'changeOrigin': true,
    },
    
  },
});
