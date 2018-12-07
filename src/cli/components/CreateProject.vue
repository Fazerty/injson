<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field v-model="project.title" label="Name" required></v-text-field>

    <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center">
      <v-text-field
        label="Select Project Folder"
        @click="pickProjectFolder"
        v-model="project.folder"
        clear-icon="clear"
        :readonly="true"
        :clearable="true"
        clear-cb="clearProjectFolder"
        prepend-icon="attach_file"
      ></v-text-field>
      <input
        type="file"
        style="display: none"
        ref="projectFolderPick"
        multiple="false"
        @change="projectFolderSelected"
        webkitdirectory
      >
    </v-flex>

    <v-text-field v-model="project.keySearchRegx" label="Name" required></v-text-field>
    <v-text-field v-model="project.filesFilter" label="Name" required></v-text-field>
    <!-- Text string but have to create a component later 
    ! means exclude
    , to separate the rules
    exclude rules will be read first.
    !node_modules/ means exclude the node_modules folder
    **/ means all folders
    *.js means js files in the root project folder
    **/*.js means js files in the root project folder and all the subfolders
    src/**/*.js means js files in the src folder and all its subfolders
    -->
    <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center">
      <v-text-field
        label="Select Translation Folder"
        @click="pickTranslationsFolder"
        v-model="project.translationsFolder"
        clear-icon="clear"
        :readonly="true"
        :clearable="true"
        clear-cb="clearTranslationsFolder"
        prepend-icon="attach_file"
      ></v-text-field>
      <input
        type="file"
        style="display: none"
        ref="translationsFolderPick"
        multiple="false"
        @change="translationsFolderSelected"
        webkitdirectory
      >
    </v-flex>

    <v-text-field v-model="project.title" label="Name" required></v-text-field>

    <v-btn :disabled="!valid" @click="submit">submit</v-btn>
    <v-btn @click="clear">clear</v-btn>
  </v-form>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Vue from 'vue';
import { Project } from '@/cli/models/project';
import { CliProjectService } from '@/cli/services/cliProjectService';

interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

@Component<CreateProject>({
    components: {}
})
export default class CreateProject extends Vue {
    private valid: boolean = false;
    private project: Project = new Project('', '', '', '', '', '');

    private projectService: CliProjectService = new CliProjectService();

    private pickProjectFolder() {
        const projectFolderPick: HTMLInputElement = this.$refs
            .projectFolderPick as HTMLInputElement;
        projectFolderPick.click();
    }

    private clearProjectFolder() {
        this.project.folder = '';
    }

    private projectFolderSelected(e: HTMLInputEvent) {
        if (e.target && e.target.files && e.target.files[0]) {
            this.project.folder = e.target.files[0].name;
        } else {
            this.project.folder = '';
        }
    }

    private pickTranslationsFolder() {
        const translationsFolderPick: HTMLInputElement = this.$refs
            .translationsFolderPick as HTMLInputElement;
        translationsFolderPick.click();
    }

    private clearTranslationsFolder() {
        this.project.translationsFolder = '';
    }

    private translationsFolderSelected(e: HTMLInputEvent) {
        if (e.target && e.target.files && e.target.files[0]) {
            this.project.translationsFolder = e.target.files[0].name;
        } else {
            this.project.translationsFolder = '';
        }
    }

    private submit() {
        this.projectService.create(this.project);
    }

    private clear() {
        this.clearProjectFolder();
        this.project = new Project('', '', '', '', '', '');
    }
    /*
    public id?: string;
    public icon?: string;
    public title?: string;
    public folder?: string;
    public translationsFolder?: string;
    public keySearchRegx?: string;
    public filesFilter?: string;
    */
}
</script>
<style scoped>
</style>

