<template>
  <v-toolbar
    app
    color="secondary"
    dark
    fixed
    style="-webkit-app-region: drag"
    :clipped-left="appData.clipped"
  >
    <v-toolbar-side-icon @click.stop="appData.drawer = !appData.drawer">
      <MenuIcon/>
    </v-toolbar-side-icon>

    <v-toolbar-title v-text="appData.title"></v-toolbar-title>
    <v-snackbar v-model="message.display" :multi-line="true" :timeout="message.timeout" :top="true">
      {{message.text}}
      <v-btn color="pink" flat @click="message.display = false">Close</v-btn>
    </v-snackbar>
    <v-spacer/>
    <v-btn flat icon color="white" style="-webkit-app-region: no-drag" @click="minimize()">
      <WindowMinimizeIcon/>
    </v-btn>
    <v-btn flat icon color="white" style="-webkit-app-region: no-drag" @click="toogleMaximize()">
      <WindowMaximizeIcon v-if="!maximized"/>
      <WindowRestoreIcon v-if="maximized"/>
    </v-btn>
    <v-btn flat icon color="white" style="-webkit-app-region: no-drag" @click="closeApp()">
      <WindowCloseIcon/>
    </v-btn>
  </v-toolbar>
</template>


<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import { remote, BrowserWindow } from 'electron';
import WindowMaximizeIcon from 'vue-material-design-icons/WindowMaximize.vue';
import WindowMinimizeIcon from 'vue-material-design-icons/WindowMinimize.vue';
import WindowRestoreIcon from 'vue-material-design-icons/WindowRestore.vue';
import WindowCloseIcon from 'vue-material-design-icons/WindowClose.vue';
import MenuIcon from 'vue-material-design-icons/Menu.vue';
import { mapGetters } from 'vuex';

@Component<MainToolbar>({
    components: {
        WindowMaximizeIcon,
        WindowMinimizeIcon,
        WindowCloseIcon,
        WindowRestoreIcon,
        MenuIcon
    },
    computed: {
        ...mapGetters(['message', 'appData'])
    }
})
export default class MainToolbar extends Vue {
    private title: string = 'InJson';
    private bWindow: BrowserWindow = remote.getCurrentWindow();
    private maximized: boolean = this.bWindow.isMaximized();

    private closeApp() {
        this.bWindow.close();
    }
    private minimize() {
        this.bWindow.minimize();
    }
    private toogleMaximize() {
        if (!this.bWindow.isMaximized()) {
            this.bWindow.maximize();
            this.maximized = true;

            this.$store.commit('newMessage', 'Application Maximized');
        } else {
            this.bWindow.unmaximize();
            this.maximized = false;
        }
    }
}
</script>

<style scoped lang="scss">
</style>