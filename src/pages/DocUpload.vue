<template>
  <div>
    <NavBar>
      <img src="src/assets/documindbg.png" style="height: 100%; object-fit: contain" />
      DocUMind
    </NavBar>
    <v-layout>
      <v-navigation-drawer floating permanent>
        <v-list density="compact" nav>
          <p style="padding-bottom: 15px; font-size: smaller;">Application Id: 1412412</p>
          <v-list-item :title="relation.relationName" :style="{ backgroundColor: ind == selectedRelation ? 'white' : 'transparent', color : ind == selectedRelation ? 'black' : 'white'}" value="home" v-for="(relation,ind) in relations" :key="ind" @click="selectedRelation = ind">
            <template v-slot:prepend>
              <v-icon icon="mdi-delete" style="color: var(--red)" @click="removeRelation(ind)"></v-icon>
            </template>
          </v-list-item>
        </v-list>
        <div style="width:100%; display: flex; flex-direction: column; align-items: center;">
          <v-btn @click="addRelation" style="width:80%; margin-bottom:10px ;text-decoration: underline; text-decoration-color: #B8252B;">
            Add Relation
          </v-btn>
          <v-btn style="background-color:#B8252B; color:white; width:80%" @click="processDocs">
            Submit
          </v-btn>
        </div>
      </v-navigation-drawer>
      <v-main class="main">

        <v-progress-circular indeterminate v-if="loading" style="margin-top:50px"></v-progress-circular>
        <p v-if="loading" class="ml-2">Hold tight processing your documents</p>

        <template v-else-if="relations.length > 0">
          <v-text-field label="Relation Name" :rules="rules" v-model="relations[selectedRelation].relationName" hide-details="auto" style="width:90%; max-height: 50px;" class="my-2"></v-text-field>
          <v-file-input solo label="Click and upload user image" style="width:90%; max-height: 50px; margin-top: 10px;" accept="image/png, image/jpeg, application/pdf" prepend-icon="" prepend-inner-icon="mdi-file-document" v-model="relations[selectedRelation].relationImage"></v-file-input>

          <div class="formContainer">
            <v-expansion-panels>
              <v-expansion-panel v-for="(document, ind) in relations[selectedRelation].documents" :key="document.docid">
                <v-expansion-panel-title>
                  <v-btn icon="mdi-delete" style="color:red" class="mr-3" @click="removeDocument(selectedRelation,ind)"></v-btn>
                  <p>{{document.filename}}</p>
                </v-expansion-panel-title>
                <v-expansion-panel-text class="pa-1">

                  <v-text-field label="Document Name" :rules="rules" hide-details="auto" v-model="document.filename" class="my-2"></v-text-field>

                  <v-file-input solo label="Click and upload a document here" v-model="document.fileb64" accept="image/png, image/jpeg, application/pdf" prepend-icon="" prepend-inner-icon="mdi-file-document"></v-file-input>

                  <v-text-field label="Classification Threshold" :rules="rules" hide-details="auto" v-model="document.payload.classificationThreshold" class="my-2" type="Number"></v-text-field>

                  <div>
                    <v-text-field :label="'Detail Check (Enter comma seperated value)'" :rules="rules" hide-details="auto" v-model="document.payload.detailCheck" class="mt-2"></v-text-field>
                    <p style="font-size:small;" class="mb-2" v-if="configs.infoChecks[document.payload.doclabel]">For ex: <span style="padding-right: 5px" v-for="check,idx in configs.infoChecks[document.payload.doclabel]" :key="idx">{{ check }},</span>etc.</p>
                  </div>

                  <v-select v-model="document.payload.doclabel" label="Pick document type" hide-details="auto" :items="labels"></v-select>

                  <div v-if="showIdChecks(document.payload.doclabel)">
                    <v-label>Pick features to find in the ID</v-label>
                    <v-checkbox v-for="checks in configs.idChecks[document.payload.doclabel]" :key="checks" :label="checks" :value="checks" hide-details="true" v-model="document.payload.idChecks"></v-checkbox>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
            <div class="my-10 d-flex justify-center">
              <v-btn @click="addDocument(selectedRelation)" class="mr-4">Add Document</v-btn>
            </div>
          </div>
        </template>
        <h2 v-else class="mt-5" style="font-weight: 500;">Please create a relation</h2>

      </v-main>
    </v-layout>

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
export default {
  components: {
    NavBar,
  },
  data() {
    return {
      // checks: ["logo-stamp", "profile-image"],
      labels: ["1040", "Other", "Driving", "PAN Card", "PFS", "Aadhar"],
      documents: [],
      relations: [],
      selectedRelation: 0,
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

      const relationsCopy = [];

      for (let i = 0; i < this.relations.length; i++) {

        relationsCopy[i] = {
          ...this.relations[i],
        }

        const docsCopy = [];

        if (this.relations[i].relationName.length == 0 ) {
          this.snackbar = true;
          this.errorMsg = `Please enter all the details for ${this.relations[i].relationName}`;
          return;
        }

        relationsCopy[i].relationImage = await this.toBase64(relationsCopy[i].relationImage[0]);

        const documents = this.relations[i].documents;

        for (let j = 0; j < documents.length; j++) {
          docsCopy[j] = {
            ...documents[j],
          }
          if (docsCopy[j].fileb64.length == 0) { //checking if user has select a doc image to proceed with.
            this.snackbar = true;
            this.errorMsg = `Please select a document for ${this.relations[i].relationName} / ${docsCopy[j].payload.doclabel}`;
            return;
          }
          if (docsCopy[j].payload.doclabel.length == 0) { //checking if user has select a doc label
            this.snackbar = true;
            this.errorMsg = `Please select a doc Label for ${this.relations[j].relationName} documents`;
            return;
          }
          docsCopy[j].fileb64 = await this.toBase64(docsCopy[j].fileb64[0]);

          let detailCheck = docsCopy[j].payload.detailCheck;

          detailCheck = detailCheck.split(',');
          detailCheck = detailCheck.map(check => {
            return check.trim();
          })

          docsCopy[j].payload.detailCheck = detailCheck;
        }

        relationsCopy[i].documents = docsCopy;
      }

      const requestObject = {
        'applicationId': 9876543210,
        'relations': relationsCopy
      }

      this.loading = true;

      this.$store.commit('setRelations', this.relations);
      console.log(this.relations)

      let relationResults = [];

      console.log(requestObject)
      await axios.post('http://35.153.103.13/documind', requestObject)
        .then(res => {
          console.log("response data", res.data);
          relationResults = res.data;
        })
        .catch(err => {
          console.log(err)
          this.loading = false;
        })

      console.log("Response", relationResults);

      this.$store.commit('setRelationsResults', relationResults);

      this.$router.push({
        name: "HOME",
      })
    },
    addRelation() {
      const sampleRelation = {
        'relationName': 'Relation x',
        'relationImage': '',
        'documents': [],
        'relationId': Math.floor((Math.random() * 1e9))
      }
      this.relations.push(sampleRelation);
    },
    removeRelation(relationNo) {
      this.relations = this.relations.filter((_, ind) => ind != relationNo);
      if (relationNo == this.selectedRelation) { //if this relation is deleted move to next relation
        this.selectedRelation = (this.selectedRelation + 1) % this.relations.length;
      }
    },
    addDocument(relationNo) {
      const sampleDoc = {
        "docid": Math.floor((Math.random() * 1e9)).toString(),
        "filename": "Document Name",
        "fileb64": [],
        "payload": {
          "doclabel": "",
          "classificationThreshold": 80,
          "idChecks": [],
          "detailCheck": ""
        }
      };
      this.relations[relationNo].documents.push(sampleDoc);
    },
    removeDocument(relationNo, index) {
      this.relations[relationNo].documents = this.relations[relationNo].documents.filter((doc, ind) => index != ind);
    },
    toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          resolve(reader.result.split(',')[1]) //removing metadata about file.
        };
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
.main {
  width: 100%;
  height: calc(100vh - 70px);
  display: flex;
  /* justify-content: center; */
  align-items: center;
  overflow: auto;
  flex-direction: column;
  background-color: var(--bgcolor);
}

/deep/ .v-expansion-panel-text__wrapper {
  display: grid !important;
  align-items: start;
  column-gap: 2rem;
  grid-template-columns: 1fr 1fr;
}

.formContainer {
  margin-top: 50px;
  border-radius: 5px;
  width: 90%;
}

/deep/ .v-navigation-drawer__content {
  background-color: #002e6d;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
}
</style>