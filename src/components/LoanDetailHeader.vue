<template>
  <div :class="'loan-details'">
    <div class="d-flex flex-column gap-2 justify-space-between">
      <div class="d-flex gap-2">
        <div class="info-box flex-grow-1">
          <span class="text-dark small d-block">Application Number</span>
          <span class="brand-text-primary h6">{{applicationId}}</span>
        </div>
        <div class="info-box flex-grow-1">
          <span class="text-dark small d-block">Loan Status</span>
          <span class="brand-text-primary h6">{{ "Pending" }}</span>
        </div>
      </div>
      <div class="info-box">
        <span class="text-dark small d-block">Document Fraud Risk</span>
        <span class="text-danger font-weight-bold h6">{{ risk }}</span>
      </div>
    </div>
    <div class="d-flex flex-column gap-2 justify-space-between">
      <div class="info-box">
        <span class="text-dark small d-block">Loan Officer</span>
        <span class="brand-text-primary h6">Admin</span>
      </div>
      <div class="info-box">
        <span class="text-dark small d-block">Bank Branch</span>
        <span class="brand-text-primary h6">124</span>
      </div>
    </div>
    <div class="d-flex flex-column">
      <div class="d-flex">
        <div class="info-box flex-grow-1">
          <div class="">
            <span class="text-dark small d-block">Relation</span>
            <span class="brand-text-primary mb-2 text-align-right h6">{{ relationName }}</span>
          </div>
          <span>&nbsp;</span>
          <div class="mt-1">
            <span class="text-dark small d-block">Relationship Code</span>
            <span class="brand-text-primary mb-2 text-align-right h6">124</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  props: {
    relationName: String,
    risk: String,
    applicationId: String
  },
  data() {
    return {
      branchCodeDisplay: false,
      loanOfficerDisplay: false,
    };
  },
};
</script>

<style scoped>
.small {
  font-size: 0.7rem;
}
.h6 {
  color: #264e71;
  font-size: 1rem;
}

.loan-details {
  margin-top: 20px;
  background: transparent;
  display: grid;
  width: 81%;
  grid-template-columns: repeat(3, 1fr);
  /* grid-gap: 1rem; */
}

/* @media (min-width: 1759.98px) {
  .loan-details {
    grid-template-columns: repeat(4, 1fr);
  }
} */
.info-box {
  background-color: white;
  margin: 5px;
  box-shadow: gray;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}

.info-box span {
  white-space: nowrap;
}

/* .info-box span:not(:first-child) {
  font-size: 1.1rem;
} */
/* .info-box:first-child {
  grid-column: 1 / span 2;
} */
</style>
