import { CREATE_PROJECT, GET_PROJECTS } from '@/server/services/projectService';
import { ipcRenderer } from 'electron';
import { Project } from '@/cli/models/project';


export class CliProjectService {

    public create(project: Project) {
        ipcRenderer.send(CREATE_PROJECT, project);
    }

    public getProjects() {
        ipcRenderer.send(GET_PROJECTS, undefined);
    }
}
