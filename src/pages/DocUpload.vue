<template>
  <NavBar style="background-color: var(--lorange); color: white;">
    <img src="src/assets/documindbg.png" style="height: 100%; object-fit: contain" />
    DocUMind
  </NavBar>
  <div class="container" style="background-color: var(--dark);">
    <h2 v-if="!loading">Upload Some Documents to begin with</h2>
    <v-progress-circular indeterminate v-if="loading"></v-progress-circular>
    <p v-if="loading" class="ml-2">Hold tight processing your documents</p>
    <div style="min-width: 600px;" class="mt-10" v-else>
      <v-expansion-panels>
        <v-expansion-panel v-for="(document, ind) in documents" :key="document.docid">
          <v-expansion-panel-title>
            <v-btn icon="mdi-delete" class="mr-2" @click="removeDocument(ind)"></v-btn>
            <p>{{document.payload.doclabel}}</p>
          </v-expansion-panel-title>
          <v-expansion-panel-text>

            <v-text-field label="Label" :rules="rules" hide-details="auto" v-model="document.payload.doclabel" class="my-2"></v-text-field>

            <v-text-field label="Classification Threshold" :rules="rules" hide-details="auto" v-model="document.payload.classificationThreshold" class="my-2" type="Number"></v-text-field>

            <v-label>Pick doc type</v-label>
            <v-radio-group v-model="document.payload.docType">
              <v-radio v-for="docType in docTypes" :key="docType" :label="docType" :value="docType" ></v-radio>
            </v-radio-group>

            <div v-if="document.payload.docType == 'ID Proof'">
              <v-label>Pick features to find</v-label>
              <v-checkbox v-for="checks in checks" :key="checks" :label="checks" :value="checks" v-model="document.payload.idChecks"></v-checkbox>
            </div>

            <v-text-field label="Detail Check" :rules="rules" hide-details="auto" v-model="document.payload.detailCheck" class="my-2"></v-text-field>

            <v-file-input chips v-model="document.fileb64" accept="image/png, image/jpeg, application/pdf"></v-file-input>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <div class="my-10 d-flex justify-space-around">
        <v-btn icon="mdi-plus" @click="addDocument"></v-btn>
        <v-btn color="primary" @click="ff">
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
      docTypes: ["ID Proof", "Non ID Proof"],
      checks: ["logo-stamp", "profile-image"],
      documents: [],
      loading: false,
    }
  },
  methods: {
    async ff() {
      this.loading = true;
      const docsCopy = this.documents

      for (let i = 0; i < docsCopy.length; i++) {
        docsCopy[i].fileb64 = await this.toBase64(docsCopy[i].fileb64[0]);
      }

      console.log(docsCopy)
    },
    addDocument() {
      const sampleDoc = {
        "docid": (Math.random() * 1e9).toString(),
        "filename": "2",
        "fileb64": undefined,
        "payload": {
          "docType": "ID Proof",
          "doclabel": "Pan ",
          "classificationThreshold": 80,
          "idChecks": [],
          "detailCheck": ["Piyush Bansal"]
        }
      };
      this.documents.push(sampleDoc)
    },
    removeDocument(index) {
      this.documents = this.documents.filter((doc, ind) => index != ind);
    },
    toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      })
    },

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
  flex-direction: column;
}
</style>