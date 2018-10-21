import Vue from 'vue';
import Router from 'vue-router';
import CreateProject from '@/views/CreateProject.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'createProject',
      component: CreateProject,
    },
  ],
});
