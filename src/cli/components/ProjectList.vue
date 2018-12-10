<template>
  <v-container>
    <v-card>
      <v-card-text style="height: 560px;" class="grey lighten-5">
        <v-list>
          <v-list-tile value="true" v-for="(project, i) in projects" :key="i">
            <v-list-tile-action>
              <v-icon v-html="project.icon"></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="project.title"></v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action v-if="!appData.miniVariant">
              <v-layout align-center justify-center row fill-height>
                <v-btn icon ripple @click="deleteProjectDialog(project.id)">
                  <v-icon small color="red">remove</v-icon>
                </v-btn>
              </v-layout>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card-text>

      <v-card-text style="height: 100px; position: relative">
        <v-btn
          absolute
          dark
          fab
          top
          small
          left
          color="grey"
          icon
          ripple
          @click.stop="appData.miniVariant = !appData.miniVariant"
        >
          <v-icon v-html="appData.miniVariant? 'chevron_right':  'chevron_left'"></v-icon>
        </v-btn>
        <v-btn
          v-if="!appData.miniVariant"
          absolute
          dark
          fab
          top
          small
          right
          color="pink"
          icon
          ripple
          @click="createProject()"
        >
          <v-icon>add</v-icon>
        </v-btn>
      </v-card-text>
    </v-card>

    <v-dialog v-model="showDeleteDialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Delete project</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout row wrap>
              <v-flex xs12 sm6 md4></v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="deleteProject()">Ok</v-btn>
          <v-btn color="blue darken-1" flat @click.native="clearDeleteDialog()">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script lang="ts">
import Component from 'vue-class-component';
import { mapGetters } from 'vuex';
import router from '@/cli/plugins/router';
import { Project } from '@/cli/models/project';
import Vue from 'vue';

@Component<ProjectList>({
    computed: {
        ...mapGetters(['selectedProject', 'projects', 'appData'])
    }
})
export default class ProjectList extends Vue {
    private showDeleteDialog: boolean = false;

    private created() {
        this.$store.commit('initProjects');
    }

    private createProject() {
        this.$store.commit('selectProject', undefined);
        router.push({ name: 'createProject' });
    }

    private deleteProjectDialog(projectId: string) {
        this.showDeleteDialog = true;
    }

    private deleteProject() {
        this.showDeleteDialog = false;
    }

    private clearDeleteDialog() {
        this.showDeleteDialog = false;
    }
}
</script>

<style scoped lang="scss">
</style>