<template>
  <v-container fluid>
    <v-layout row>
      <v-flex xs7>
        <v-text-field label="regular expression" v-model="regexp" readonly/>
        <v-card>
          <v-card-title>The text search will follow this rule</v-card-title>
          <v-card-text>
            <draggable v-model="PhrasalExpressionElements">
              <transition-group name="list-complete">
                <PhrasalExpressionField
                  v-for="(elt, index) in PhrasalExpressionElements"
                  v-bind:element="elt"
                  v-on:remove="PhrasalExpressionElements.splice(index, 1)"
                  v-on:changed="updateRegex"
                  :key="elt.function + index"
                />
              </transition-group>
            </draggable>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs1>
      </v-flex>
      <v-flex xs4>
        <v-card id="scroll-target" style="max-height: 350px" class="scroll-y">
          <v-card-text v-scroll:scroll-target>
            <v-list>
              <v-list-group
                v-for="(item, index) in allDefinitions"
                v-model="item.active"
                :key="item.title + index"
                :prepend-icon="item.action"
                no-action
              >
                <v-list-tile slot="activator">
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>

                <v-list-tile
                  v-for="(definition, index) in item.definitions"
                  :key="definition.functionName + index"
                  @click="selectPhrasalExpression(definition)"
                >
                  <v-list-tile-content>
                    <v-tooltip bottom>
                      <v-list-tile-title
                        slot="activator"
                      >{{formatFunctionShortDescription(definition.shortDefinition) }}</v-list-tile-title>
                      <span>{{definition.definition}}</span>
                    </v-tooltip>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list-group>
            </v-list>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang='ts'>
import { Component, Watch } from 'vue-property-decorator';
import Vue from 'vue';
import {
  PhrasalExpressionDefinition,

  utilityGroup,
  rulesGroup,
  miscellaneousGroup,
  loopsGroup,
  modifiersGroup,
  captureGroup,
  specialCharactersGroup,

  addFunction,
  PhrasalExpressionElement,
  Phrexp,
  IAstRegExp,
  IDisjunction,
  PhrexDef
} from 'phrasalexpressions';
import { prototype } from 'events';
import PhrasalExpressionField from './PhrasalExpressionField.vue';
import draggable from 'vuedraggable';

@Component<PhraseToRegexp>({
  name: 'phrase-to-regexp',
  props: ['value'],
  components: { PhrasalExpressionField, draggable },
  data(): any {
    return {};
  }
})
export default class PhraseToRegexp extends Vue {
  private regexp: string = '';
  private selection: any = [];
  private PhrasalExpressionElements: PhrasalExpressionElement[] = new Array<
    PhrasalExpressionElement
  >();
  private definitions: PhrexDef = new PhrexDef('en');
  private allDefinitions: any[] = [
    { title: utilityGroup, definitions: this.definitions.utilityDefinitions },
    // [{ title: miscellaneousGroup , definitions:   miscellaneousDefinitions,
    { title: rulesGroup, definitions: this.definitions.rulesDefinitions },
    { title: loopsGroup, definitions: this.definitions.loopsDefinitions },
    { title: captureGroup, definitions: this.definitions.captureDefinitions },
    // [{ title: header: modifiersGroup , definitions:  modifiersDefinitions,
    {
      title: specialCharactersGroup,
      definitions: this.definitions.specialCharactersDefinitions
    }
  ];

  private removeElement(index: number) {}

  private clearSelections() {
    this.selection = [];
  }

  private selectPhrasalExpression(val: PhrasalExpressionDefinition) {
    this.PhrasalExpressionElements.push(new PhrasalExpressionElement(val, []));
    this.clearSelections();
  }

  private formatFunctionShortDescription(
    template: string,
    a?: string,
    b?: string,
    c?: string
  ) {
    a = a ? a : 'X';
    b = b ? b : 'Y';
    c = c ? c : 'Z';
    var args = [a, b, c];
    if (template)
    {return template.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });} else {return '';}
  }

  @Watch('PhrasalExpressionElements')
  private updateRegex() {
    const phrexp: Phrexp = new Phrexp();
    this.PhrasalExpressionElements.forEach((elt: PhrasalExpressionElement) => {
      addFunction(phrexp, elt);
    });
    this.regexp = phrexp.toRegExp().toString();
    this.$emit('input', this.regexp);
  }
}
</script>
<style scoped lang='scss'>
</style>
