import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
  state () {
    return {
      count: 0,
      relations: [],
      relationsResults: null,
    }
  },
  mutations: {
    setRelations(state, relations) {
      state.relations = relations;
    },
    setRelationsResults(state, relationsResults) {
      state.relationsResults = relationsResults;
    }
  }
})

export default store;