<template>
  <div class="tabcontent">
    <div class="section">
      <h2>Register New Product</h2>
      <div class="form-group">
        <label>Product ID:</label>
        <input type="text" v-model="state.productForm.productId" placeholder="WATCH001" />
      </div>
      <div class="form-group">
        <label>Serial Number:</label>
        <input type="text" v-model="state.productForm.serialNumber" placeholder="SN123456" />
      </div>
      <div class="form-group">
        <label>Model:</label>
        <input type="text" v-model="state.productForm.model" placeholder="Apple Watch" />
      </div>
      <div class="form-group">
        <label>Specifications:</label>
        <input type="text" v-model="state.productForm.specifications" placeholder="Titanium Case" />
      </div>
      <div class="form-group">
        <label>Warranty Duration (Days):</label>
        <input type="number" v-model.number="state.productForm.warrantyDuration" />
      </div>
      <div class="form-group">
        <label>Max Warranty Claims:</label>
        <input type="number" v-model.number="state.productForm.maxClaims" />
      </div>
      <button @click="registerProduct">Register Product</button>
      <div id="registerResult" class="result" v-html="state.results.registerResult"></div>
    </div>

    <div class="section">
      <h2>Transfer Ownership</h2>
      <div class="form-group">
        <label>Product ID:</label>
        <input type="text" v-model="state.transferForm.productId" placeholder="WATCH001" />
      </div>
      <div class="form-group">
        <label>Target Address:</label>
        <input type="text" v-model="state.transferForm.targetAddress" placeholder="0x..." />
      </div>
      <div class="form-group">
        <label>Transaction Details:</label>
        <input
          type="text"
          v-model="state.transferForm.transactionDetails"
          placeholder="Describe reason for transfer"
        />
      </div>
      <div class="form-group">
        <label>Transfer Type:</label>
        <select v-model="state.transferForm.transferType">
          <option value="manufacturerToRetailer">Manufacturer → Retailer</option>
          <option value="retailerToCustomer">Retailer → Customer</option>
          <option value="customerToCustomer">Customer → Customer (Resale)</option>
        </select>
      </div>
      <button @click="transferOwnership">Transfer Ownership</button>
      <div id="transferResult" class="result" v-html="state.results.transferResult"></div>
    </div>
  </div>
</template>

<script>
import contractService from '../services/contractService.js'
import appStore from '../store/appStore.js'

export default {
  name: 'ProductManagement',
  data() {
    return { state: appStore.getState() }
  },
  methods: {
    async registerProduct() {
      try {
        await contractService.registerProduct(this.state.productForm)
        appStore.updateResult('registerResult', 'Product registered successfully!', 'success')
        appStore.resetForm('productForm')
      } catch (error) {
        appStore.updateResult('registerResult', 'Error: ' + error.message, 'error')
      }
    },
    async transferOwnership() {
      try {
        await contractService.transferOwnership(this.state.transferForm)
        appStore.updateResult('transferResult', 'Ownership transferred successfully!', 'success')
        appStore.resetForm('transferForm')
      } catch (error) {
        appStore.updateResult('transferResult', 'Error: ' + error.message, 'error')
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
