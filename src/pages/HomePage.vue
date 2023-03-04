<template>
  <NavBar style="background-color: var(--lorange); color: white;">
    <img src="src/assets/documindbg.png" style="height: 100%; object-fit: contain" />
    DocUMind
  </NavBar>
  <div class="container" style="background-color: var(--dark)">
    <!-- <v-card v-for="(data, ind) in documents" :key="ind" width="80%" style="margin:5px; border:1px solid grey" :title="data.name" :class="data.documentVerified ? 'verifiedDocument' : 'nonVerifiedDocument'">
      <v-expansion-panels>
        <v-expansion-panel title="Show Details">
          <v-expansion-panel-text>
            <DocumentDetail @showDetailView="dialog = true" />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card> -->

    <v-table fixed-header style="width: 80%; margin: 20px; padding: 20px" class="elevation-3">
      <thead>
        <tr>
          <th class="text-left">
            <h3>Document Name</h3>
          </th>
          <th style="text-align: center;">
            <h3>Document Type</h3>
          </th>
          <th style="text-align: center;">
            <h3>Upload Date</h3>
          </th>
          <th style="text-align: center;">
            <h3>Status</h3>
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, ind) in documents" :key="item.name">
          <tr style="font-size: small;">
            <td>{{ item.name }}</td>
            <td style="text-align: center;">{{ item.documentType }}</td>
            <td style="text-align: center;">{{ item.uploadedDate }}</td>
            <td style="display:flex; align-items:center; justify-content:center;">
              <v-chip style="font-size:smaller; padding: 6px 8px; height: auto">
                {{ item.status }}
              </v-chip>
            </td>
            <td>
              <v-btn color="red" :icon="
                  isExpanded(item.name) ? 'mdi-chevron-up' : 'mdi-chevron-down'
                " size="x-small" variant="tonal" @click="handleExpandClick(item.name)"></v-btn>
            </td>
          </tr>
          <td :colspan="5">
            <v-expansion-panels v-model="panel">
              <v-expansion-panel :value="item.name">
                <v-expansion-panel-text>
                  <DocumentDetail @showDetailView="handleShowDetailView" :documentId="ind" :features="item.features" />
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </td>
        </template>
      </tbody>
    </v-table>
  </div>
  <v-dialog v-model="dialog" width="90%">
    <DetailView :features="getDocumentFeatures" />
  </v-dialog>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import DetailView from "@/pages/DetailViewPage.vue";
import DocumentDetail from "@/components/DocumentDetail.vue";
import axios from 'axios';

export default {
  components: {
    NavBar,
    DetailView,
    DocumentDetail,
  },
  data() {
    return {
      dialog: false,
      itemsPerPage: 5,
      expanded: [],
      singleExpand: false,
      selectedDocumentId: 0,
      panel: ["Form 1040 Tax Return", "Driving License"],
      headers: [
        {
          title: "Document Name",
          align: "start",
          sortable: false,
          key: "name",
        },
        {
          title: "Document Type",
          align: "end",
          sortable: false,
          key: "documentType",
        },
        {
          title: "Uploaded Date",
          align: "end",
          sortable: false,
          key: "uploadedDate",
        },
        { title: "Status", align: "end", sortable: false, key: "status" },
        { text: "", value: "data-table-expand" },
      ],
      documents: [

      ],
    };
  },
  computed: {
    getDocumentFeatures() {
      return this.documents[this.selectedDocumentId].features;
    }
  },
  methods: {
    handleExpandClick(docName) {
      if (this.isExpanded(docName)) {
        const data = this.panel.filter((name) => {
          return name != docName;
        });
        this.panel = data;
      } else {
        this.panel.push(docName);
      }
    },
    isExpanded(docName) {
      let ind = this.panel.findIndex((name) => {
        return name == docName;
      });
      return ind != -1;
    },
    handleShowDetailView(documentId) {
      console.log(documentId)
      this.selectedDocumentId = documentId;
      this.dialog = true;
    }
  },
  mounted() {
    const customDoc = {
      name: "Sample Document",
      documentType: "Non ID Proof",
      uploadedDate: "26/02/2023",
      status: "Auto Approved",
      features: [
        {
          "name": "Label Check",
          "predictedValue": "Driving",
          "receivedValue": "PAN Card",
          "status": "Not Matched",
          "probability": 99.76442456245422,
          "coordinates": []
        },
        {
          "name": "Logo-stamp",
          "predictedValue": "",
          "receivedValue": "",
          "status": "Feature Found",
          "probability": 0.8281083703041077,
          "coordinates": [
            206.29293823242188,
            24.367475509643555,
            459.1795349121094,
            317.6627502441406
          ]
        },
        {
          "name": "Profile-image",
          "predictedValue": "",
          "receivedValue": "",
          "status": "Feature Found",
          "probability": 0.8335363268852234,
          "coordinates": [
            1625.2255859375,
            331.0448913574219,
            2147.237060546875,
            929.6051025390625
          ]
        },
        {
          "name": "Info Check",
          "predictedValue": "PIYUSH BANSAL",
          "receivedValue": "Piyush Bansal",
          "status": "Info Found",
          "probability": 100,
          "coordinates": [
            153,
            912,
            774,
            984
          ]
        }
      ],
    };

    const customDoc2 = {
      name: "Sample Document 2",
      documentType: "ID Proof",
      uploadedDate: "26/02/2023",
      status: "Auto Approved",
      features: [
        {
          "name": "Label Check",
          "predictedValue": "Driving",
          "receivedValue": "Driving",
          "status": "Matched",
          "probability": 99.76442456245422,
          "coordinates": []
        },
        {
          "name": "Logo-stamp",
          "predictedValue": "",
          "receivedValue": "",
          "status": "Feature Found",
          "probability": 0.8281083703041077,
          "coordinates": [
            206.29293823242188,
            24.367475509643555,
            459.1795349121094,
            317.6627502441406
          ]
        },
        {
          "name": "Profile-image",
          "predictedValue": "",
          "receivedValue": "",
          "status": "Feature Found",
          "probability": 0.8335363268852234,
          "coordinates": [
            1625.2255859375,
            331.0448913574219,
            2147.237060546875,
            929.6051025390625
          ]
        },
        {
          "name": "Info Check",
          "predictedValue": "PIYUSH BANSAL",
          "receivedValue": "Piyush Bansal",
          "status": "Info Found",
          "probability": 100,
          "coordinates": [
            153,
            912,
            774,
            984
          ]
        }
      ],
    };

    console.log('calling api')

    this.documents.push(customDoc)
    this.documents.push(customDoc2)

    // axios.get('http://127.0.0.1:5000/documind')
    //   .then(res => {
    //     customDoc['features'] = res.data;
    //     this.documents.push(customDoc)
    //     console.log(customDoc)
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   })
  }
};
</script>

<style>
.container {
  width: 100%;
  min-height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(239, 239, 239);
}

.verifiedDocument {
  background-color: lightgreen;
  color: black;
}

.nonVerifiedDocument {
  background-color: lightcoral;
  color: white;
}

tbody tr:nth-of-type(even) {
  background-color: white;
}

tbody tr:nth-of-type(odd) {
  background-color: #e9f1f5;
}

.v-expansion-panel-text__wrapper {
  padding: 0px !important;
}
</style>
