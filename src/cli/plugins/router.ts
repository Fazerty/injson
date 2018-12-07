import Vue from 'vue';
import Router from 'vue-router';
import CreateProject from '@/cli/components/CreateProject.vue';
import EditProject from '@/cli/components/EditProject.vue';
import Home from '@/cli/components/Home.vue';

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
