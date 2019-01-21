import Vue from 'vue';
import { Project } from '@/cli/models/project';

export const PROJECT_CREATED = 'project_created';
export const PROJECT_CREATION_ERROR = 'project_creation_error';
export const PROJECT_LIST = 'project_list';


export function initRenderers(vue: Vue) {
        vue.$electron.ipcRenderer.on(
            PROJECT_CREATED,
            (event: any, newProject: Project) => {
                vue.$store.commit('addProject', newProject);
                vue.$store.commit('newMessage', 'Project ' + newProject.title + ' created');
                vue.$store.commit('selectProject', newProject.id);
            }
        );

        vue.$electron.ipcRenderer.on(
            PROJECT_CREATION_ERROR,
            (event: any, error: any) => {
                vue.$store.commit('newMessage', 'An error occured' + error);
            }
        );

        vue.$electron.ipcRenderer.on(
            PROJECT_LIST,
            (event: any, projects: Project[]) => {
                vue.$store.commit('initProjects', projects);
            }
        );
    }

