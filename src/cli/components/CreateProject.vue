<template>
  <v-card>
    <v-card-title class="justify-center primary white--text">
      <div>
        <h3 class="headline mb-0">Create your translation project</h3>
      </div>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-flex xs6 sm6 offset-sm3>
          <v-text-field
            label="Select the project folder"
            @click="pickProjectFolder"
            v-model="project.folder"
            clear-icon="clear"
            :readonly="true"
            :clearable="true"
            clear-cb="clearProjectFolder"
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
        <v-flex xs6 sm6 offset-sm3>
          <v-text-field v-model="project.title" label="ProjectName" required></v-text-field>
        </v-flex>

        <v-flex xs6 sm6 offset-sm3 v-if="project.folder">
          <v-card id="scroll-target" style="max-height: 400px" class="scroll-y">
            <v-card-title primary-title>
              <div>
                <h4>Select folders</h4>
                <div>containing the code to be translated</div>
              </div>
            </v-card-title>
            <v-card-text>
              <v-layout v-scroll:scroll-target column style="max-height: 1000px">
                <v-treeview
                  v-model="folders"
                  :open="open"
                  :items="folderTree"
                  activatable
                  selectable
                  item-key="path"
                  :load-children="fetchFolders"
                  open-on-click
                >
                  <template slot="prepend" slot-scope="{ item, open, leaf }">
                    <v-tooltip bottom>
                      <v-icon color="red" v-if="!item.accessible" slot="activator">mdi-folder-lock</v-icon>
                      <span>Folder not accessible</span>
                    </v-tooltip>
                    <v-icon v-if="item.accessible && !open">mdi-folder</v-icon>
                    <v-icon v-if="item.accessible && open">mdi-folder-open</v-icon>
                  </template>
                </v-treeview>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-divider></v-divider>
        <v-flex xs6 sm6 offset-sm3>
          <v-card id="scroll-target" style="max-height: 400px" class="scroll-y">
            <v-card-title primary-title>
              <div>
                <h4>Select file extension and regx</h4>
                <div>to search for the keys</div>
              </div>
            </v-card-title>
            <v-card-text>
              <v-text-field v-model="newFilter.extension" label="extension" required></v-text-field>
              <v-text-field v-model="newFilter.regexp" label="regexp" required></v-text-field>
              <v-btn icon @click="addNewFilter">
                <v-icon>add</v-icon>
              </v-btn>
              <v-divider></v-divider>
              {{filters}}
              <v-list>
                <v-list-tile
                  v-for="(filter, index) in filters"
                  :key="filter.extension"
                >
                  <v-list-tile-content>
                    <v-list-tile-title
                      @remove="filters.splice(index, 1)"
                    >{{filter.extension}} {{filter.regexp}}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-divider></v-divider>
        <v-flex xs6 sm6 offset-sm3>
          <v-text-field
            label="Select Translation Folder"
            @click="pickTranslationsFolder"
            v-model="project.translationsFolder"
            clear-icon="clear"
            :readonly="true"
            :clearable="true"
            clear-cb="clearTranslationsFolder"
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

        <v-flex xs6 sm6 offset-sm3>
          <v-btn :disabled="!valid" @click="submit">submit</v-btn>
          <v-btn @click="clear">clear</v-btn>
        </v-flex>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Vue from 'vue';
import { Project } from '@/cli/models/project';
import { CliProjectService } from '@/cli/services/cliProjectService';
import FolderIcon from 'vue-material-design-icons/Folder.vue';
import FolderOpenIcon from 'vue-material-design-icons/FolderOpen.vue';
import fs from 'fs';
import Path from 'path';

interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

interface Filter {
    extension: string;
    regexp: string;
}

@Component<CreateProject>({
    components: { FolderIcon, FolderOpenIcon }
})
export default class CreateProject extends Vue {
    private project: Project = new Project('', '', '', '', '', '');
    private open: any = [];
    private folders: any = [];
    private folderTree: any = [];
    private inaccessibleFolders: string[] = new Array<string>();
    private filters: Filter[] = new Array<Filter>();
    private newFilter: Filter = { extension: '', regexp: '' };

    private clearProjectFolder() {
        this.project.folder = '';
        this.open = [];
        this.folders = [];
        this.folderTree = [];
        this.inaccessibleFolders = new Array<string>();
    }
    private clear() {
        this.clearProjectFolder();
        this.newFilter = { extension: '', regexp: '' };
        this.project = new Project('', '', '', '', '', '');
    }

    private rootFolders() {
        const roots: string[] = [];
        const forlderArr: string[] = Object.assign([], this.folders);
        forlderArr
            .sort(function(a: string, b: string) {
                return a.length - b.length;
            })
            .forEach((folderPath: string) => {
                if (!this.rootExist(folderPath, roots)) {
                    roots.push(folderPath);
                }
            });
        return roots;
    }

    private rootExist(folderPath: string, roots: string[]) {
        return roots.find(
            rootFolderPath =>
                folderPath.indexOf(rootFolderPath + Path.sep) !== -1
        )
            ? true
            : false;
    }

    private pushNew(elt: string, stringArray: string[]) {
        if (stringArray.indexOf(elt) === -1) {
            stringArray.push(elt);
        }
    }

    private fetchFolders(folder: any) {
        if (folder.accessible) {
            let subfolders: any[] = fs
                .readdirSync(folder.path)
                .filter(file => {
                    const filePath = Path.join(folder.path, file);
                    try {
                        fs.accessSync(filePath);
                        return fs.statSync(filePath).isDirectory();
                    } catch (error) {
                        this.pushNew(filePath, this.inaccessibleFolders);
                    }
                })
                .map((subfolder: string) => {
                    const folderPath: string = Path.join(
                        folder.path,
                        subfolder
                    );
                    let accessible: boolean = false;
                    try {
                        fs.accessSync(folderPath, fs.constants.R_OK);
                        // For symlinks
                        fs.lstat(folderPath, function(err, stats) {
                            if (stats.isSymbolicLink()) {
                                fs.accessSync(
                                    folderPath,
                                    fs.constants.R_OK & fs.constants.O_SYMLINK
                                );
                            }
                        });
                        accessible = true;
                    } catch (error) {
                        this.pushNew(folderPath, this.inaccessibleFolders);
                    }
                    const hasChildren: boolean = accessible
                        ? this.hasChildren(folderPath)
                        : false;
                    return {
                        name: subfolder,
                        path: folderPath,
                        children: hasChildren ? [] : undefined,
                        accessible: accessible
                    };
                });
            folder.children = subfolders;
        } else {
            folder.children = undefined;
        }
    }

    private hasChildren(folder: any) {
        let subfolders: any[] = fs.readdirSync(folder).filter(file => {
            const filePath = Path.join(folder, file);
            try {
                fs.accessSync(filePath);
                return fs.statSync(filePath).isDirectory();
            } catch (error) {
                this.pushNew(filePath, this.inaccessibleFolders);
            }
        });
        if (subfolders.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    private valid: boolean = false;

    private projectService: CliProjectService = new CliProjectService();

    private pickProjectFolder() {
        const projectFolderPick: HTMLInputElement = this.$refs
            .projectFolderPick as HTMLInputElement;
        projectFolderPick.click();
    }

    private projectFolderSelected(e: HTMLInputEvent) {
        if (e.target && e.target.files && e.target.files[0]) {
            this.project.folder = e.target.files[0].path;
            let folderAccessible: boolean = false;
            try {
                fs.accessSync(this.project.folder, fs.constants.R_OK);
                folderAccessible = true;
            } catch (error) {
                this.pushNew(this.project.folder, this.inaccessibleFolders);
            }
            this.folderTree = [
                {
                    path: this.project.folder,
                    name: e.target.files[0].name,
                    children: folderAccessible ? [] : undefined,
                    accessible: folderAccessible
                }
            ];
            if (!this.project.title) {
                this.project.title = e.target.files[0].name;
            }
        } else {
            this.project.folder = '';
            this.folderTree = [];
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

    private addNewFilter() {
        if (!this.newFilter.extension) {
            this.$store.commit('newMessage', 'No file extension specified');
            return;
        }
        if (this.extensionExists(this.newFilter.extension)) {
            this.$store.commit('newMessage', 'File extension already used');
            return;
        }
        if (!this.newFilter.extension) {
            this.$store.commit('newMessage', 'No regexp specified');
            return;
        }
        this.filters.push(Object.assign({}, this.newFilter));
        this.newFilter = { extension: '', regexp: '' };
    }

    private extensionExists(extension: string) {
        return this.filters.find(
            (filter: Filter) => filter.extension === extension
        )
            ? true
            : false;
    }
    private submit() {
        this.projectService.create(this.project);
        this.$store.commit(
            'newMessage',
            'Project ' + this.project.title + ' created'
        );
        this.clear();
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
<style scoped lang="scss">
</style>

