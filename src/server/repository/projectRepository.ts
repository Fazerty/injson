import { EntityRepository, Repository, Not } from 'typeorm';
import { Project } from '../models/project';

/**
 *
 *
 * @export
 * @class ProjectRepository
 * @extends {Repository<Project>}
 */
@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {

}
