<template>
  <div>
    <NavBar>
      <img src="src/assets/documindbg.png" style="height: 100%; object-fit: contain" />
      DocUMind
    </NavBar>
    <v-layout>
      <v-navigation-drawer floating permanent>
        <v-list density="compact">
          <p class="pa-4">Application id:<br/> <span style="font-size:22px">{{ applicationId }}</span></p>
          <p class="pa-4 pt-0" >Relations</p>
          <v-list-item class="list-item" :style="{ backgroundColor: ind == selectedRelation ? '#C13C00' : 'transparent'}" value="home" v-for="(relation,ind) in relations" :key="ind" @click="selectedRelation = ind">
            <template v-slot:prepend>
              <v-icon icon="mdi-delete" @click="removeRelation(ind)"></v-icon>
            </template>
            <v-list-item-title style="font-size: small;"> {{ relation.relationName ? relation.relationName : 'Borrower' }}</v-list-item-title>
          </v-list-item>
        </v-list>
        <div style="width:100%; display: flex; flex-direction: column; align-items: center;" v-if="!loading" class="pb-5">
          <v-btn @click="addRelation" style="width:80%; margin-bottom:10px ;text-decoration: underline; text-decoration-color: #B8252B;">
            Add Relation
          </v-btn>
          <v-btn style="background-color:#B8252B; color:white; width:80%" @click="processDocs">
            Submit
          </v-btn>
        </div>
      </v-navigation-drawer>
      <v-main class="main" :style="{justifyContent: loading ? 'center' : 'start'}">
        <v-progress-circular indeterminate v-if="loading"></v-progress-circular>
        <p class="ml-2" v-if="loading">Hold tight processing your documents</p>

        <template v-else-if="relations.length > 0">
          <div style="width: 70%; display: grid; grid-template-columns: 1fr 1fr; align-items: center; padding-top: 30px;">
            <v-text-field label="Relation Name" :rules="rules" v-model="relations[selectedRelation].relationName" hide-details="auto" style="width:90%; max-height: 50px;" class="my-2"></v-text-field>
            <v-file-input hide-details="true" solo label="Click and upload user image" style="width:90%; max-height: 50px;" accept="image/*" prepend-icon="" prepend-inner-icon="mdi-file-document" v-model="relations[selectedRelation].relationImage"></v-file-input>
          </div>

          <div class="formContainer" style="width: 70%;">
            <v-expansion-panels style="width: 95%">
              <v-expansion-panel v-for="(document, ind) in relations[selectedRelation].documents" :key="document.docid">
                <v-expansion-panel-title>
                  <v-btn icon="mdi-delete" style="color:red" class="mr-3" @click="removeDocument(selectedRelation,ind)"></v-btn>
                  <p v-if="document.filename">{{document.filename}}</p>
                  <p v-else> Document</p>
                </v-expansion-panel-title>
                <v-expansion-panel-text class="pa-1">

                  <v-select style="padding-top: 10px;" v-model="document.payload.doclabel" label="Pick document type" hide-details="true" :items="labels"></v-select>
                  <v-text-field label="Document Name" :rules="rules" hide-details="auto" v-model="document.filename" class="my-2"></v-text-field>

                  <v-file-input hide-details="true" solo label="Click and upload a document here" v-model="document.fileb64" accept="image/png, image/jpeg, application/pdf" prepend-icon="" prepend-inner-icon="mdi-file-document"></v-file-input>

                  <v-text-field label="Classification Threshold" :rules="rules" hide-details="auto" v-model="document.payload.classificationThreshold" class="my-2" type="Number"></v-text-field>

                  <div>
                    <v-text-field :label="'Detail Check (Enter comma seperated value)'" :rules="rules" hide-details="auto" v-model="document.payload.detailCheck" class="mt-2"></v-text-field>
                    <p style="font-size:small;" class="mb-2" v-if="configs.infoChecks[document.payload.doclabel]">For ex: <span style="padding-right: 5px" v-for="check,idx in configs.infoChecks[document.payload.doclabel]" :key="idx">{{ check }},</span>etc.</p>
                  </div>

                  <div v-if="showIdChecks(document.payload.doclabel)">
                    <v-label>Pick features to find in the ID</v-label>
                    <v-checkbox v-for="checks in configs.idChecks[document.payload.doclabel]" :key="checks" :label="checks.label" :value="checks.value" hide-details="true" v-model="document.payload.idChecks"></v-checkbox>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
            <div class="my-10 d-flex justify-center">
              <v-btn @click="addDocument(selectedRelation)" class="mr-4">Add Document</v-btn>
            </div>
          </div>
        </template>
        <div v-else>
          <h3 class="mt-5" style="font-weight: 500;">Application Id</h3>
          <v-text-field label="Application Id" :rules="rules" v-model="applicationId"  hide-details="auto" style="width:120%; max-height: 50px;" class="my-2"></v-text-field>
          <h3 class="mt-10" style="font-weight: 500;">Please create a relation</h3>
        </div>

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
import LoanDetailHeader from "@/components/LoanDetailHeader.vue";

export default {
  components: {
    NavBar,
    LoanDetailHeader,
  },
  data() {
    return {
      // checks: ["logo-stamp", "profile-image"],
      labels: ["1040", "Driving", "PAN Card", "PFS", "ID"],
      documents: [],
      relations: this.$store.state.relations,
      selectedRelation: 0,
      loading: false,
      snackbar: false,
      errorMsg: null,
      configs: null,
      applicationId: 123124,
    }
  },
  methods: {
    showIdChecks(docLabel) {
      let a = ["ID", "PAN Card", "Driving"]
      return a.includes(docLabel);
    },
    async processDocs() {

      this.$store.commit('setRelations', this.relations);

      const relationsCopy = [];

      for (let i = 0; i < this.relations.length; i++) {

        relationsCopy[i] = {
          ...this.relations[i],
        }

        const docsCopy = [];

        if (this.relations[i].relationName.length == 0) {
          this.snackbar = true;
          this.errorMsg = `Please enter all the details for ${this.relations[i].relationName}`;
          return;
        }

        if (relationsCopy[i].relationImage.length > 0) relationsCopy[i].relationImage = await this.toBase64(relationsCopy[i].relationImage[0]);
        else relationsCopy[i].relationImage = "";


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

          if (!Array.isArray(detailCheck)) {
            detailCheck = detailCheck.split(',');
            detailCheck = detailCheck.map(check => {
              return check.trim();
            })
          }

          docsCopy[j].payload.detailCheck = detailCheck;
        }

        relationsCopy[i].documents = docsCopy;
      }

      const requestObject = {
        'applicationId': this.applicationId,
        'relations': relationsCopy
      }

      this.loading = true;

      
      console.log(requestObject)

      let relationResults = [];

      await axios.post('http://52.70.151.60/documind', requestObject)
        .then(res => {
          console.log("response data", res.data);
          relationResults = res.data;
        })
        .catch(err => {
          this.snackbar = true;
          this.errorMsg = `Something went wrong please try again.`;
          this.loading = false;
          relationResults = null;
        })

      if (!relationResults) return;

      this.$store.commit('setRelationsResults', relationResults);

      this.$router.push({
        name: "HOME",
      })
    },
    addRelation() {
      const sampleRelation = {
        'relationName': '',
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
        "filename": "",
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
  align-items: center;
  column-gap: 2rem;
  grid-template-columns: 1fr 1fr;
}

/deep/ .v-field__field {
  overflow: hidden;
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
  /* padding: 10px; */
}
.list-item {
  color: white;
  border-bottom: 2px #c13c00 solid;
}
</style>