import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/staffcourse', component: '@/pages/StaffDashboardContent' },
    { path: '/login', component: '@/pages/login' },
    { path: '/register', component: '@/pages/register' },
    { path: '/studentcourse', component: '@/pages/studentcourse' },
    { path: '/viewstudentcourse', component: '@/pages/viewstudentcourse' },
    { path: '/forgetpassword', component: '@/pages/forgetpassword' },
    { path: '/confirmpassword', component: '@/pages/confirmpassword' },
    { path: '/studentforums', component: '@/pages/studentforums' },
    { path: '/teacherforums', component: '@/pages/teacherforums' }
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
    '/service-stream': {
      'target': 'http://175.45.180.201:10900/',// to do localhost:8000
      'changeOrigin': true,
    },    
  },
});
