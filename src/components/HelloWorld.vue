<script setup lang="ts">
import { ref } from 'vue';
import json_pages from '../datas/base.json'
import { Reco, Document, cosineSimilarity} from '../classes/Recommender';

defineProps<{ msg: string }>();

const count = ref(0);

function test() {


  // wasm.greet();

  // Build pages array
  var data: any = json_pages["pages"];
  var rows = [];
  var idx = []
  for (var i = 1; i <= 3; i++) {
    rows.push(data[i]["extract"]);
    idx.push(data[i]["pageid"]);
  }
  // console.log(rows)
  console.log(idx)
  var documents: Document[] = rows.map((row) => new Document(row));
  console.log(documents[1].termFrequencies);

  var reco = new Reco(rows, idx);
  reco.fit();
  console.log(reco.idf);
  reco.transform();
  console.log(reco.documents[1].vector)
  var elem = reco.transformText('Rust is an amazing language');
  console.log(elem.vector);
  console.log(cosineSimilarity(reco.documents[0].vector, reco.documents[2].vector));
}

test()
</script>

<template>cosineSimilarity
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite
    starter
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
