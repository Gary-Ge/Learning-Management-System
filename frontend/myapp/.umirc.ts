import { defineConfig } from 'umi';

const target = 'http://localhost:10900/';


export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/login' },
    { path: '/home', component: '@/pages/index' },
    { path: '/login', component: '@/pages/login' },
    { path: '/register', component: '@/pages/register' },
    { path: '/staffcourse', component: '@/pages/StaffDashboardContent' },
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
      'target': target,
      'changeOrigin': true,
    },
    '/service-edu': {
      'target': target,
      'changeOrigin': true,
    },
    '/service-forum': {
      'target': target,
      'changeOrigin': true,
    },
    '/service-stream': {
      'target': target,
      'changeOrigin': true,
    },
    '/service-chat': {
      'target': target,
      'changeOrigin': true,
    },
  },
});
