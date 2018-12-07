import { EntityRepository, Repository, Not } from 'typeorm';
import { Project } from '../models/project';

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {

}
