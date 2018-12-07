import electron, { IpcMain } from 'electron';

import {
    PROJECT_CREATED,
    PROJECT_CREATION_ERROR,
    PROJECT_LIST
} from '../../cli/services/cliRenderers';

import { getCustomRepository } from 'typeorm';
import { ProjectRepository } from '../repository/projectRepository';
import { Project } from '../models/project';

export const CREATE_PROJECT = 'create_project';
export const GET_PROJECTS = 'get_projects';

export function registerIpc() {
    electron.ipcMain.on(CREATE_PROJECT, (event: any, project: Project) => {
        /*event.sender.send(
            PROJECT_CREATED,
            new Project(
                'icon',
                'title',
                'folder',
                'trfolder',
                'keys',
                'ffilter'
            )
        );*/
        const projectRepository: ProjectRepository = getCustomRepository(
            ProjectRepository
        );
        projectRepository
            .save(project)
            .then((value: Project) => {
                event.sender.send(PROJECT_CREATED, value);
            })
            .catch((error: any) => {
                event.sender.send(PROJECT_CREATION_ERROR, error);
            });
    });


    electron.ipcMain.on(GET_PROJECTS, (event: any, project: Project) => {
        event.sender.send(
            PROJECT_LIST,
            [new Project(
                'icon',
                'title',
                'folder',
                'trfolder',
                'keys',
                'ffilter'
            )]
        );
    });
}
