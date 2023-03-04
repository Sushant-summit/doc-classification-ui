<template>
  <NavBar style="background-color: var(--lorange); color: white;">
    <img src="src/assets/documindbg.png" style="height: 100%; object-fit: contain" />
    DocUMind
  </NavBar>
  <div class="container" style="background-color: var(--dark);">
    <div style="min-width: 600px;" class="mt-10">

      <v-expansion-panels>
        <v-expansion-panel v-for="(document, ind) in documents"  :key="document.docid">
          <v-expansion-panel-title >
            <v-btn icon="mdi-delete" class="mr-2" @click="removeDocument(ind)"></v-btn>
              <p>{{document.payload.doclabel}}</p>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-text-field label="Label" :rules="rules" hide-details="auto" v-model="documents[ind].payload.doclabel" class="my-2"></v-text-field>
            <v-text-field label="Classification Threshold" :rules="rules" hide-details="auto" v-model="documents[ind].payload.classificationThreshold" class="my-2" type="Number"></v-text-field>
            <h3>Features To find</h3>
            <v-checkbox v-for="checks in checks" :key="checks" :label="checks" :value="checks" v-model="document.payload.idChecks"></v-checkbox>
            <v-text-field label="Detail Check" :rules="rules" hide-details="auto" v-model="documents[ind].payload.detailCheck" class="my-2"></v-text-field>
            <v-file-input chips v-model="documents[ind].payload.fileb64" accept="image/png, image/jpeg, application/pdf"></v-file-input>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <div class="my-10 d-flex justify-space-around">
        <v-btn icon="mdi-plus" @click="addDocument"></v-btn>
        <v-btn color="primary">
          Submit
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
export default {
  components: {
    NavBar,
  },
  data() {
    return {
      checks: ["logo-stamp", "profile-image"],
      documents: []
    }
  },
  methods: {
    ff() {
      console.log(this.files)
    },
    addDocument() {
      const sampleDoc = {
        "docid": (Math.random()*1e9).toString(),
        "filename": "2",
        "fileb64": "b64string",
        "payload": {
          "doclabel": "Pan ",
          "classificationThreshold": 80,
          "idChecks": ["logo-stamp", "profile-image"],
          "detailCheck": ["Piyush Bansal"]
        }
      };
      this.documents.push(sampleDoc)
    },
    removeDocument(index) {
      this.documents = this.documents.filter((doc, ind) => index != ind);
    }
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  min-height: calc(100vh - 70px);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
}
</style>