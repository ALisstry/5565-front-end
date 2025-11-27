<template>
  <div class="tabcontent">
    <div class="section">
      <h2>Submit Warranty Claim</h2>
      <div class="form-group">
        <label>Product ID:</label>
        <input type="text" v-model="state.warrantyClaimForm.productId" placeholder="WATCH001" />
      </div>
      <div class="form-group">
        <label>Description of Issue:</label>
        <textarea
          v-model="state.warrantyClaimForm.description"
          rows="3"
          placeholder="Describe the product issue in detail..."
        ></textarea>
      </div>
      <button @click="submitWarrantyClaim">Submit Warranty Claim</button>
      <div id="claimResult" class="result" v-html="state.results.claimResult"></div>
    </div>

    <div class="section">
      <h2>Process Warranty Claim</h2>
      <div class="form-group">
        <label>Product ID:</label>
        <input type="text" v-model="state.processWarrantyForm.productId" placeholder="WATCH001" />
      </div>
      <div class="form-group">
        <label>Claim ID:</label>
        <input type="number" v-model.number="state.processWarrantyForm.claimId" />
      </div>
      <div class="form-group">
        <label>Status:</label>
        <select v-model="state.processWarrantyForm.status">
          <option value="1">Approved</option>
          <option value="2">Rejected</option>
        </select>
      </div>
      <div class="form-group">
        <label>Service Notes:</label>
        <textarea
          v-model="state.processWarrantyForm.serviceNotes"
          rows="3"
          placeholder="Repair details and replaced parts..."
        ></textarea>
      </div>
      <button @click="processWarrantyClaim">Process Warranty Claim</button>
      <div id="processResult" class="result" v-html="state.results.processResult"></div>
    </div>

    <div class="section">
      <h2>Log Service Action</h2>
      <div class="form-group">
        <label>Product ID:</label>
        <input type="text" v-model="state.serviceActionForm.productId" placeholder="WATCH001" />
      </div>
      <div class="form-group">
        <label>Service Description:</label>
        <textarea
          v-model="state.serviceActionForm.serviceDescription"
          rows="3"
          placeholder="Service description..."
        ></textarea>
      </div>
      <div class="form-group">
        <label>Parts Replaced:</label>
        <textarea
          v-model="state.serviceActionForm.partsReplaced"
          rows="3"
          placeholder="Replaced parts..."
        ></textarea>
      </div>
      <button @click="logServiceAction">Log Service</button>
      <div id="serviceActionResult" class="result" v-html="state.results.serviceActionResult"></div>
    </div>
  </div>
</template>

<script>
import contractService from '../services/contractService.js'
import appStore from '../store/appStore.js'

export default {
  name: 'WarrantyManagement',
  data() {
    return { state: appStore.getState() }
  },
  methods: {
    async submitWarrantyClaim() {
      try {
        const result = await contractService.submitWarrantyClaim(
          this.state.warrantyClaimForm.productId,
          this.state.warrantyClaimForm.description,
        )

        const claimId = result.events.WarrantyClaimSubmitted.returnValues.claimId
        appStore.updateResult(
          'claimResult',
          `Warranty claim submitted successfully! Claim ID: ${claimId}`,
          'success',
        )
        appStore.resetForm('warrantyClaimForm')
      } catch (error) {
        appStore.updateResult('claimResult', 'Error: ' + error.message, 'error')
      }
    },
    async processWarrantyClaim() {
      try {
        await contractService.processWarrantyClaim(
          this.state.processWarrantyForm.productId,
          this.state.processWarrantyForm.claimId,
          this.state.processWarrantyForm.status,
          this.state.processWarrantyForm.serviceNotes,
        )
        appStore.updateResult('processResult', 'Warranty claim processed successfully!', 'success')
        appStore.resetForm('processWarrantyForm')
      } catch (error) {
        appStore.updateResult('processResult', 'Error: ' + error.message, 'error')
      }
    },
    async logServiceAction() {
      try {
        await contractService.logServiceAction(
          this.state.serviceActionForm.productId,
          this.state.serviceActionForm.serviceDescription,
          this.state.serviceActionForm.partsReplaced,
        )
        appStore.updateResult('serviceActionResult', 'Service logged successfully!', 'success')
        appStore.resetForm('serviceActionForm')
      } catch (error) {
        appStore.updateResult('serviceActionResult', 'Error: ' + error.message, 'error')
      }
    },
  },
}
</script>

<style scoped>
.section {
  margin-bottom: 20px;
}
</style>
