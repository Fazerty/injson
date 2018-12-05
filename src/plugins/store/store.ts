import Vue from 'vue';
import Vuex from 'vuex';
import { State } from './state';
import { Project } from '@/models/project';

Vue.use(Vuex);

const state: State = {
  message: { display: false, text: '', timeout: 3000 },

  projects: new Array<Project>(),

  app: {
    title: 'Injson',
    clipped: true,
    rightDrawer: true,
    right: false,
    fixed: false,
    drawer: true,
    miniVariant: false,
  },

  session: {
    token: undefined,
    languageCode: 'en',
    selectedProjectId: undefined,
  },

};

const mutations = {
  initProjects() {
        state.projects = new Array<Project>();
        state.projects.push({
          icon: 'bubble_chart',
          title: 'Writea',
          folder: 'F:\Documents\Workspaces\writea',
          translationFolder: 'F:\Documents\Workspaces\writea\src\main\webapp\i18n',
          keySearchRegx: '',
          fileExtension: '*.js,*.ts',
        });
  },

  selectProject(currentState: State, id: string | undefined) {
    currentState.session.selectedProjectId = id;
  },

  newMessage(currentState: State, msg: string) {
    currentState.message = { display: true, text: msg, timeout: 3000 };
  },

};

const actions = {};
const getters = {
  message() { return state.message; },
  selectedProject() {
    let selectedProject: Project = new Project();
    state.projects.forEach((proj: any) => {
      if (proj.id === state.session.selectedProjectId) {
        selectedProject = proj;
      }
    });
    return selectedProject; },
  projects(): Project[] { return state.projects; },
  appData(): any {return state.app; },
};

export default new Vuex.Store<State>({
  state,
  mutations,
  actions,
  getters,
});

