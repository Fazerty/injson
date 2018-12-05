import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    public id?: number;
    @Column()
    public icon?: string;
    @Column()
    public title?: string;
    @Column()
    public folder?: string;
    @Column()
    public translationFolder?: string;
    @Column()
    public keySearchRegx?: string;
    @Column()
    public fileExtension?: string;
}
