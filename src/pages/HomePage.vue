<template>
  <NavBar>
    <img src="src/assets/documindbg.png" style="height: 100%; object-fit: contain" />
    DocUMind
  </NavBar>
  <div class="container" style="background-color: var(--dark)">

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
            <td style="text-align: center;">{{ item.docType }}</td>
            <td style="text-align: center;">{{ item.uploadedDate }}</td>
            <td style="display:flex; align-items:center; justify-content:center;">
              <v-chip style="font-size:smaller; padding: 6px 8px; height: auto">
                {{ item.status }}
              </v-chip>
            </td>
            <td>
              <v-btn color="red" :icon="
                  isExpanded(item.docid) ? 'mdi-chevron-up' : 'mdi-chevron-down'
                " size="x-small" variant="tonal" @click="handleExpandClick(item.docid)"></v-btn>
            </td>
          </tr>
          <td :colspan="5">
            <v-expansion-panels v-model="panel">
              <v-expansion-panel :value="item.docid">
                <v-expansion-panel-text>
                  <DocumentDetail @showDetailView="handleShowDetailView" :documentId="ind" :features="item.features" :image="getDocumentImage(ind)" />
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </td>
        </template>
      </tbody>
    </v-table>
  </div>
  <v-dialog v-model="dialog" width="90%">
    <DetailView :features="getDocumentFeatures" :image="getDocumentImage()" />
  </v-dialog>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import DetailView from "@/pages/DetailViewPage.vue";
import DocumentDetail from "@/components/DocumentDetail.vue";

export default {
  props: ['docsCopy'],
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
        {
          title: "Status",
          align: "end", sortable: false, key:
            "status"
        },
        { text: "", value: "data-table-expand" },
      ],
      documents: this.$store.state.documentsResults,
    };
  },
  computed: {
    getDocumentFeatures() {
      return this.documents[this.selectedDocumentId].features;
    },
  },
  methods: {
    handleExpandClick(docid) {
      if (this.isExpanded(docid)) {
        const data = this.panel.filter((id) => {
          return id != docid;
        });
        this.panel = data;
      } else {
        this.panel.push(docid);
      }
    },
    isExpanded(docid) {
      let ind = this.panel.findIndex((id) => {
        return id == docid;
      });
      return ind != -1;
    },
    handleShowDetailView(documentId) {
      console.log(documentId)
      this.selectedDocumentId = documentId;
      this.dialog = true;
    },
    getDocumentImage(index) {
      console.log("getting image", index)
      if (index != null) return  URL.createObjectURL(this.$store.state.documents[index].fileb64[0]);
      else return URL.createObjectURL(this.$store.state.documents[this.selectedDocumentId].fileb64[0]);
    }
  },
  mounted() {
    console.log("Home page loaded...")
    console.log(this.$store.state.documents);
    console.log(this.$store.state.documentsResults);
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
