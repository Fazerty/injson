<template>
  <div class="about" v-if="selectedProject">
    <h1>Edit translation of {{selectedProject.title}}</h1>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import Vue from 'vue';
import { mapGetters } from 'vuex';
import router from '@/cli/plugins/router';
import { Project } from '@/cli/models/project';


@Component<EditProject>({
    components: {},
    computed: {
        ...mapGetters(['selectedProject', 'projects'])
    }
})
export default class EditProject extends Vue {

}
</script>

<style scoped lang="scss">
</style>