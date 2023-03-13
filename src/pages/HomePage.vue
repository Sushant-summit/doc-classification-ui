<template>
  <NavBar>
    <img src="src/assets/documindbg.png" style="height: 100%; object-fit: contain" />
    DocUMind
  </NavBar>
  <v-layout>
    <v-navigation-drawer floating permanent>
      <v-list density="compact" nav>
        <v-list-item :title="relation.relationName" :style="{ backgroundColor: ind == selectedRelation ? 'white' : 'transparent', color : ind == selectedRelation ? 'black' : 'white'}" value="home" v-for="(relation,ind) in relations" :key="ind" @click="selectedRelation = ind">
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="main">
      <v-table fixed-header style="width: 80%; margin: 20px; padding: 20px" class="elevation-3">
        <thead>
          <tr>
            <th class="text-left">
              <h4>Document Name</h4>
            </th>
            <th style="text-align: center;">
              <h4>Document Type</h4>
            </th>
            <th style="text-align: center;">
              <h4>Upload Date</h4>
            </th>
            <th style="text-align: center;">
              <h4>Recommended Action</h4>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, ind) in relations[selectedRelation].documents" :key="ind">
            <template v-if="ind < relations[selectedRelation].documents.length - 1">
              <tr style="font-size: small;">
                <td>{{ item.name }} - {{ item.label }}</td>
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
            <template v-else-if="relations[selectedRelation].documents[ind].length > 1">
              <tr style="overflow-x:scroll">
                <td :colspan="5" >
                  <p style="text-align: center; padding: 10px; color: red; font-weight: 600;">Different person detected!!</p>
                  <div class="d-flex" style="justify-content: center;">
                    <v-card v-for="(value, idx) in relations[selectedRelation].documents[ind]" :key="idx" width="400" :title="`Person ${idx + 1}`" class="ma-4">
                      <v-card-text class="personCard" style="padding-top: 20px;">
                        <div v-for="docLabel in value" :key="docLabel" class="mr-3 personCardDetails">
                          <v-img :width="100" cover aspect-ratio="16/9" :src="'data:image/jpeg;base64,' + docLabel[0]"></v-img>
                          <p>{{ docLabel[1] }}</p>
                        </div>
                      </v-card-text>
                    </v-card>
                  </div>
                </td>
              </tr>
            </template>
          </template>

        </tbody>
      </v-table>
    </v-main>
  </v-layout>

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
      panel: [],
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
      relations: this.$store.state.relationsResults.relations,
      selectedRelation: 0,
    };
  },
  computed: {
    getDocumentFeatures() {
      return this.relations[this.selectedRelation].documents[this.selectedDocumentId].features;
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
      if (index != null) return URL.createObjectURL(this.$store.state.relations[this.selectedRelation].documents[index].fileb64[0]);
      else return URL.createObjectURL(this.$store.state.relations[this.selectedRelation].documents[this.selectedDocumentId].fileb64[0]);
    }
  },
  mounted() {
    console.log("Home page loaded...")
    console.log(this.$store.state.documents);
    console.log(this.$store.state.documentsResults);
  }
};
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

/deep/.v-expansion-panel-text__wrapper {
  padding: 0px !important;
}

.personCard {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: baseline;
  text-align: center;
  justify-items: center;
}

.personCardDetails {
  min-height: 150px;
  display: flex;
  flex-direction: column;
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
