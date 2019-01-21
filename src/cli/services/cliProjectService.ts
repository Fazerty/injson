import { CREATE_PROJECT, GET_PROJECTS } from '@/server/services/projectService';
import { ipcRenderer } from 'electron';
import { Project } from '@/cli/models/project';


export class CliProjectService {

    public static createProject(project: Project) {
        ipcRenderer.send(CREATE_PROJECT, project);
    }

    public static getProjects() {
        ipcRenderer.send(GET_PROJECTS, undefined);
    }
}
