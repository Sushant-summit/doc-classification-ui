<template>
  <div>
    <NavBar>
      <img src="src/assets/documindbg.png" style="height: 100%; object-fit: contain" />
      DocUMind
    </NavBar>
    <div class="container" style="background-color: var(--dark);">
      <h2 v-if="!loading">Upload Some Documents to begin with</h2>
      <v-progress-circular indeterminate v-if="loading"></v-progress-circular>
      <p v-if="loading" class="ml-2">Hold tight processing your documents</p>
      <div style="min-width: 600px; max-width: 600px;" class="mt-10" v-else>
        <v-expansion-panels>
          <v-expansion-panel v-for="(document, ind) in documents" :key="document.docid">
            <v-expansion-panel-title>
              <v-btn icon="mdi-delete" class="mr-3" @click="removeDocument(ind)"></v-btn>
              <p>{{document.filename}}</p>
            </v-expansion-panel-title>
            <v-expansion-panel-text>

              <v-text-field label="Document Name" :rules="rules" hide-details="auto" v-model="document.filename" class="my-2"></v-text-field>

              <v-select v-model="document.payload.doclabel" label="Pick document type" hide-details="auto" :items="labels"></v-select>

              <v-text-field label="Classification Threshold" :rules="rules" hide-details="auto" v-model="document.payload.classificationThreshold" class="my-2" type="Number"></v-text-field>

              <div v-if="showIdChecks(document.payload.doclabel)">
                <v-label>Pick features to find in the ID</v-label>
                <v-checkbox v-for="checks in configs.idChecks[document.payload.doclabel]" :key="checks" :label="checks" :value="checks" hide-details="true" v-model="document.payload.idChecks"></v-checkbox>
              </div>

              <div>
                <v-text-field :label="'Detail Check (Enter comma seperated value)'" :rules="rules" hide-details="auto" v-model="document.payload.detailCheck" class="mt-2"></v-text-field>
                <p style="font-size:small;" class="mb-2">For ex: <span style="padding-right: 5px" v-for="check,idx in configs.infoChecks[document.payload.doclabel]" :key="idx">{{ check }},</span>etc.</p>
              </div>

              <v-file-input solo label="Click and upload a document here" v-model="document.fileb64" accept="image/png, image/jpeg, application/pdf" prepend-icon="" prepend-inner-icon="mdi-file-document"></v-file-input>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <div class="my-10 d-flex justify-space-around">
          <v-btn icon="mdi-plus" @click="addDocument"></v-btn>
          <v-btn color="primary" @click="processDocs">
            Submit
          </v-btn>
        </div>
      </div>
    </div>
    <v-snackbar v-model="snackbar" multi-line>
      {{ errorMsg }}

      <template v-slot:actions>
        <v-btn color="red" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import axios from "axios";
import { load } from 'webfontloader';
export default {
  components: {
    NavBar,
  },
  data() {
    return {
      // checks: ["logo-stamp", "profile-image"],
      labels: ["1040", "Other", "Driving", "PAN Card", "PFS", "Aadhar"],
      documents: [],
      loading: false,
      snackbar: false,
      errorMsg: null,
      configs: null,
    }
  },
  methods: {
    showIdChecks(docLabel) {
      let a = ["Aadhar", "PAN Card", "Driving"]
      return a.includes(docLabel);
    },
    async processDocs() {

      const docsCopy = [];

      for (let i = 0; i < this.documents.length; i++) {
        docsCopy[i] = {
          ...this.documents[i],
        }
        if (docsCopy[i].fileb64.length == 0) { //checking if user has select a doc image to proceed with.
          this.snackbar = true;
          this.errorMsg = `Please select a document for ${docsCopy[i].payload.doclabel}`;
          return;
        }
        docsCopy[i].fileb64 = await this.toBase64(docsCopy[i].fileb64[0]);
        docsCopy[i].fileb64 = docsCopy[i].fileb64.split(',')[1]; //removing meta data about file
        let detailCheck = docsCopy[i].payload.detailCheck;
        console.log(detailCheck)
        detailCheck = detailCheck.split(',');
        detailCheck = detailCheck.map(check => {
          return check.trim();
        })
        docsCopy[i].payload.detailCheck = detailCheck;
      }

      console.log(docsCopy)

      this.loading = true;

      this.$store.commit('setDocuments', this.documents);

      let docResults = [];

      await axios.post('http://127.0.0.1:5000/documind', { "documents" :docsCopy })
        .then(res => {
          docResults = res.data;
        })
        .catch(err => {
          console.log(err)
          this.loading = false;
        })

      this.$store.commit('setDocumentsResults', docResults);

      this.$router.push({
        name: "HOME",
      })
    },
    addDocument() {
      const sampleDoc = {
        "docid": Math.floor((Math.random() * 1e9)).toString(),
        "filename": "Document 1",
        "fileb64": [],
        "payload": {
          "doclabel": "",
          "classificationThreshold": 80,
          "idChecks": [],
          "detailCheck": ""
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

  },
  mounted() {
    axios.get("/configs.json").then((response) => {
      this.configs = response.data.configs;
    });
  },
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