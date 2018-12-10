
/**
 *
 *
 * @export
 * @interface IProject
 */
export interface IProject {
    id?: number;

    icon: string;
    title: string;
    folder: string;
    translationsFolder: string;
    keySearchRegx: string;
    filesFilter: string;

}
