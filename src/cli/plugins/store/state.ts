import { Project } from '@/cli/models/project';

export interface State {

    message: { text: string, display: boolean, timeout: number };

    projects: Project[];

    app: {
        title: string;
        clipped: boolean;
        rightDrawer: boolean;
        right: boolean;
        fixed: boolean;
        drawer: boolean;
        miniVariant: boolean;
    };

    session: {
        token: string | undefined;
        languageCode: string;
        selectedProjectId: string | undefined;
    };

}
