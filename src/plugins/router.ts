import Vue from 'vue';
import Router from 'vue-router';
import CreateProject from '@/components/CreateProject.vue';
import EditProject from '@/components/EditProject.vue';
import Home from '@/components/Home.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/create-project',
            name: 'createProject',
            component: CreateProject
        },
        {
            path: '/edit-project',
            name: 'editProject',
            component: EditProject
        }
    ]
});
