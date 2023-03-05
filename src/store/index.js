import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
  state () {
    return {
      count: 0,
      documents: [],
      documentsResults: null,
    }
  },
  mutations: {
    setDocuments(state, documents) {
      state.documents = documents;
    },
    setDocumentsResults(state, results) {
      state.documentsResults = results;
    }
  }
})

export default store;