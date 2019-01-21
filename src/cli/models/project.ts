import { IProject } from './iProject';

export class Project implements IProject {
    public id?: number;
    public icon: string;
    public title: string;
    public folder: string;
    public translationsFolder: string;
    public translationsPaths: string = '{{lng}}/{{ns}}.json';
    public keySearchRegx: string;
    public filesFilter: string;

    constructor(
        icon: string,
        title: string,
        folder: string,
        translationsFolder: string,
        keySearchRegx: string,
        filesFilter: string
    ) {
        this.icon = icon;
        this.title = title;
        this.folder = folder;
        this.translationsFolder = translationsFolder;
        this.keySearchRegx = keySearchRegx;
        this.filesFilter = filesFilter;
    }
}
