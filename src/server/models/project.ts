import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IProject } from './iProject';

@Entity()
export class Project implements IProject {
    @PrimaryGeneratedColumn()
    public id?: number;
    @Column()
    public icon: string;
    @Column()
    public title: string;
    @Column()
    public folder: string;
    @Column({name: 'translations_folder'})
    public translationsFolder: string;
    @Column({name: 'key_search_regx'})
    public keySearchRegx: string;
    @Column({name: 'files_filter'})
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
