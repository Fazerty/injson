<template>
  <v-container fill-height fluid>
    <v-card class="flexcard" width="100%" height="100%">
      <v-card-title class="title font-weight-regular justify-space-between">
        <span>{{ currentTitle }}</span>
      </v-card-title>

      <v-card-text class="grow">
        <v-window v-model="step">
          <v-window-item :value="0">
            <v-card>
              <v-card-text>
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
                  <v-card id="scroll-target" style="max-height: 350px" class="scroll-y">
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
                          <template slot="prepend" slot-scope="{ item, open }">
                            <v-tooltip bottom>
                              <v-icon
                                color="red"
                                v-if="!item.accessible"
                                slot="activator"
                              >mdi-folder-lock</v-icon>
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
              </v-card-text>
            </v-card>
          </v-window-item>

          <v-window-item :value="1">
            <v-card>
              <v-card-text>
                <v-flex xs6 sm6 offset-sm3>
                  <v-card id="scroll-target" style="max-height: 400px" class="scroll-y">
                    <v-card-title primary-title>
                      <div>
                        <h4>Select file extensions and corresponding regex</h4>
                        <div>to search for keys in the project code</div>
                      </div>
                    </v-card-title>
                    <v-card-text>
                      <v-layout>
                        <v-flex xs3>
                          <v-text-field v-model="newFilter.extension" label="extension" required></v-text-field>
                        </v-flex>
                        <v-flex offset-xs1>
                          <v-text-field
                            v-model="newFilter.regexp"
                            label="regexp"
                            required
                            append-icon="mdi-pencil"
                            @click:append="dialog= true"
                          ></v-text-field>
                        </v-flex>
                        <v-flex>
                          <v-btn icon ripple @click="addNewFilter">
                            <v-icon color="grey lighten-1">mdi-plus</v-icon>
                          </v-btn>
                        </v-flex>
                      </v-layout>

                      <v-divider></v-divider>

                      <v-list>
                        <v-list-tile v-for="(filter, index) in filters" :key="filter.extension">
                          <v-list-tile-content>
                            <v-list-tile-title>Search matches of
                              <b>{{filter.regexp}}</b> in
                              <b>*.{{filter.extension}}</b>
                            </v-list-tile-title>
                          </v-list-tile-content>
                          <v-list-tile-action>
                            <v-btn icon ripple @click="filters.splice(index, 1)">
                              <v-icon color="red lighten-1">mdi-close-circle</v-icon>
                            </v-btn>
                          </v-list-tile-action>
                        </v-list-tile>
                      </v-list>
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-card-text>
            </v-card>
          </v-window-item>

          <v-window-item :value="2">
            <v-card>
              <v-card-text>
                <v-flex xs6 sm6 offset-sm3>
                  <v-text-field
                    label="Select Translation Folder"
                    @click="pickTranslationsFolder"
                    v-model="project.translationsFolder"
                    clear-icon="mdi-close"
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
                  <v-text-field
                    slot="activator"
                    label="Specify Translation Paths"
                    v-model="project.translationsPaths"
                    clear-icon="mdi-close"
                    :clearable="true"
                    clear-cb="clearTranslationsPaths"
                    append-icon="mdi-help-circle-outline"
                    @click:append="helpTranslationPathDialog= true"
                  ></v-text-field>
                </v-flex>
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
        <v-divider></v-divider>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click="create">Create</v-btn>
        <v-btn flat @click="clear">clear</v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-btn icon :disabled="step === 0" flat @click="step--">
          <v-icon>mdi-step-backward</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-item-group v-model="step" class="text-xs-center" mandatory>
          <v-item v-for="n in length" :key="`btn-${n}`">
            <v-btn slot-scope="{ active, toggle }" :input-value="active" icon @click="toggle">
              <v-icon>mdi-record</v-icon>
            </v-btn>
          </v-item>
        </v-item-group>

        <v-spacer></v-spacer>

        <v-btn icon :disabled="step === 2" flat @click="step++">
          <v-icon>mdi-step-forward</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title class="headline">Create a regular expression</v-card-title>
        <v-card-text>
          <phraseToRegexp v-model="regexpStr"></phraseToRegexp>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click.native="saveRegexpStr();">Save</v-btn>
          <v-btn color="error" @click.native="closeRegexpDialog()">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="helpTranslationPathDialog">
      <v-card>
        <v-card-title class="headline">Help to write the paths to transaltions.</v-card-title>
        <v-card-text v-pre>The paths will match the language ({{
            <b>lng</b>}}), and the namespace ({{
            <b>ns</b>}}) if provided.
            <br>
            <br>
            <i>Example:</i> '{{
            <b>lng</b>}}/{{
            <b>ns</b>}}.json' will match the files en/main.json, fr/main.json, en/menu.json, fr/menu.json.
            <br>
            <br>
            <b>lng</b> will refer to 'en' and 'fr'.
            <br>
            <b>ns</b> will refer to 'main' and 'menu'.
            <br>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click.native="helpTranslationPathDialog =false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Vue from 'vue';
import { Project } from '@/cli/models/project';
import { CliProjectService } from '@/cli/services/cliProjectService';
import phraseToRegexp from '@/cli/components/regexp/PhraseToRegexp.vue';
import FolderOpenIcon from 'vue-material-design-icons/FolderOpen.vue';
import fs from 'fs';
import Path from 'path';
import { create } from 'domain';

interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

interface Filter {
    extension: string;
    regexp: string;
}

@Component<CreateProject>({
    components: { phraseToRegexp },
    computed: {
        currentTitle() {
            switch (this.step) {
                case 1:
                    return 'Select Project Folder';
                case 2:
                    return 'Select Filter';
                default:
                    return 'Select Translation Folder';
            }
        }
    }
})
export default class CreateProject extends Vue {
    private step: number = 0;
    private length: number = 3;
    private regexpStr: string = '';

    private dialog: boolean = false;
    private helpTranslationPathDialog: boolean = false;
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

    private clearTranslationsPaths() {
        this.project.translationsPaths = '';
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
        if (!this.newFilter.regexp) {
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
    private create() {
        CliProjectService.createProject(this.project);
        this.clear();
    }

    private saveRegexpStr() {
        this.newFilter.regexp = this.regexpStr;
        this.dialog = false;
        this.regexpStr = '';
    }

    private closeRegexpDialog() {
        this.dialog = false;
        this.regexpStr = '';
    }
}
</script>
<style scoped lang="scss">
.flexcard {
    display: flex;
    flex-direction: column;
}
</style>

