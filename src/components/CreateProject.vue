<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field v-model="project.title" label="Name" required></v-text-field>

    <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center">
      <v-text-field
        label="Select Project Folder"
        @click="pickFile"
        v-model="fileName"
        clear-icon="clear"
        :readonly="true"
        :clearable="true"
        clear-cb="clearFile"
        prepend-icon="attach_file"
      ></v-text-field>
      <input
        type="file"
        style="display: none"
        ref="filepick"
        multiple="false"
        @change="fileSelected"
        webkitdirectory
      >
    </v-flex>

    <v-btn :disabled="!valid" @click="submit">submit</v-btn>
    <v-btn @click="clear">clear</v-btn>
  </v-form>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Vue from 'vue';
import { Project } from '@/models/project';

interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

@Component<CreateProject>({
    components: {}
})
export default class CreateProject extends Vue {
    private valid: boolean = false;
    private project: Project = new Project();
    private file: File | null = null;
    private fileName: string = '';

    private selectedCallback(file: File | null) {
        this.file = file;
        if (file) {
            this.fileName = file.name;
        } else {
            this.fileName = '';
        }
    }

    private pickFile() {
        const filepick: HTMLInputElement = this.$refs
            .filepick as HTMLInputElement;
        filepick.click();
    }
    private clearFile() {
        this.file = null;
        this.fileName = '';
    }

    private clear() {
        this.clearFile();
        this.project = new Project();
    }

    private submit() {
        this.clear();
    }

    private fileSelected(e: HTMLInputEvent) {
        if (this.selectedCallback) {
            if (e.target && e.target.files && e.target.files[0]) {
                this.selectedCallback(e.target.files[0]);
            } else {
                this.selectedCallback(null);
            }
        }
    }
    /*
    public id?: string;
    public icon?: string;
    public title?: string;
    public folder?: string;
    public translationFolder?: string;
    public keySearchRegx?: string;
    public fileExtension?: string;
    */
}
</script>
<style scoped>
</style>

