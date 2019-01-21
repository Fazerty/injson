<template>
  <v-flex class="ve-flex">
    <v-container class="ve-container">
      <v-layout row align-center wrap>
        <v-flex class="ve-elt">
          <v-label>{{splittedFunctionName[0]}}</v-label>
        </v-flex>
        <v-flex class="ve-elt" v-if="element.definition.argumentTypes.length > 0" align-center>
          <v-text-field
            v-if="element.definition.argumentTypes[0] === stringType"
            v-model="element.args[0]"
            prefix=" "
            type="text"
            @change="emitChange"
          ></v-text-field>

          <v-text-field
            v-if="element.definition.argumentTypes[0] === numberType"
            v-model="element.args[0]"
            prefix=" "
            type="number"
            maxlength="3"
            size="3"
            @change="emitChange"
          ></v-text-field>

          <v-text-field
            v-if="element.definition.argumentTypes[0] === charRange"
            v-model="element.args[0]"
            :rules="[validCharRange]"
            prefix=" "
            type="text"
            @change="emitChange"
          ></v-text-field>
        </v-flex>
        <v-flex class="ve-elt" v-if="splittedFunctionName[1]">{{splittedFunctionName[1]}}</v-flex>
        <v-flex class="ve-elt" v-if="element.definition.argumentTypes.length > 1">
          <v-text-field
            v-if="element.definition.argumentTypes[1] === stringType"
            v-model="element.args[1]"
            prefix=" "
            type="text"
            @change="emitChange"
          ></v-text-field>

          <v-text-field
            v-if="element.definition.argumentTypes[1] === numberType"
            v-model="element.args[1]"
            prefix=" "
            type="number"
            maxlength="3"
            size="3"
            @change="emitChange"
          ></v-text-field>
        </v-flex>
        <v-flex class="ve-elt" v-if="splittedFunctionName[2]">{{splittedFunctionName[2]}}</v-flex>
        <v-flex class="ve-elt" v-if="element.definition.argumentTypes.length > 2">
          <v-text-field
            v-if="element.definition.argumentTypes[2] === stringType"
            v-model="element.args[2]"
            prefix=" "
            type="text"
            @change="emitChange"
          ></v-text-field>

          <v-text-field
            v-if="element.definition.argumentTypes[2] === numberType"
            v-model="element.args[2]"
            prefix=" "
            type="number"
            maxlength="3"
            size="3"
            @change="emitChange"
          ></v-text-field>
        </v-flex>
        <v-flex class="ve-elt" v-if="splittedFunctionName[3]">{{splittedFunctionName[3]}}</v-flex>
        <v-flex class="ve-elt" align-center>
          <v-icon @click="emitRemove" small color="red">mdi-close</v-icon>
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex>
</template>

<script lang='ts'>
import { Component, Prop } from 'vue-property-decorator';
import Vue from 'vue';
import {
  PhrasalExpressionElement,
  stringType,
  charRange,
  numberType
} from 'phrasalexpressions';

import draggable from 'vuedraggable';

@Component<PhrasalExpressionField>({
  components: {},
  data(): any {
    return {
      stringType,
      numberType,
      charRange
    };
  },
})
export default class PhrasalExpressionField extends Vue {
  @Prop({ type: PhrasalExpressionElement }) private element!: PhrasalExpressionElement;
  @Prop({ type: Function }) private remove!: () => void;

  private splittedFunctionName = this.splitFunctionName(this.element);

  private splitFunctionName(element: PhrasalExpressionElement): string[] {
    if (element.definition.functionName) {
      return element.definition.functionName.split(/{\d+}/);
    } else {
      return [];
    }
  }

  private emitRemove() {
    this.$emit('remove');
  }
  private emitChange() {
    this.$emit('changed');
  }

  private validCharRange(value: string) {
    if (!value) {
      return 'Enter a range';
    }
    if (value.length % 2 === 1) {
      return 'Enter an odd number of characters';
    }
    for (let i = 0; i < value.length; i = i + 2) {
      if (value.charCodeAt(i) > value.charCodeAt(i + 1)) {
        return 'The code of the second character of each character pair must be lower than the first one.';
      }
    }
    return true;
  }
}
</script>

<style scoped>
.ve-container {
  padding: 4px;
  display: inline-table;
  height: auto;
  width: fit-content;
}
.ve-flex {
  display: inline-table;
}

.ve-elt {
  padding-left: 4 px;
}
.ve-elt .v-text-field {
  padding-top: 0 px;
  margin-top: 4 px;
}
</style>