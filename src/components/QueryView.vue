<template>
  <div class="tabcontent">
    <div class="section">
      <h2>Verify Product Ownership</h2>
      <div class="form-group">
        <label>Product ID:</label>
        <input type="text" v-model="state.verifyForm.productId" placeholder="WATCH001" />
      </div>
      <button @click="verifyOwnership">Verify Ownership</button>
      <div id="verifyResult" class="result" v-html="state.results.verifyResult"></div>
    </div>

    <div class="section">
      <h2>Query Product Details</h2>
      <div class="form-group">
        <label>Product ID:</label>
        <input type="text" v-model="state.queryForm.productId" placeholder="WATCH001" />
      </div>
      <button @click="getProductDetails">Query Details</button>
      <div id="detailsResult" class="result" v-html="state.results.detailsResult"></div>
    </div>

    <div class="section">
      <h2>Check Warranty Status</h2>
      <div class="form-group">
        <label>Product ID:</label>
        <input type="text" v-model="state.warrantyCheckForm.productId" placeholder="WATCH001" />
      </div>
      <button @click="checkWarrantyStatus">Check Status</button>
      <div id="warrantyResult" class="result" v-html="state.results.warrantyResult"></div>
    </div>

    <div class="section">
      <h2>View Ownership History</h2>
      <div class="form-group">
        <label>Product ID:</label>
        <input type="text" v-model="state.historyForm.productId" placeholder="WATCH001" />
      </div>
      <button @click="getOwnershipHistory">View History</button>
      <div id="historyResult" class="result" v-html="state.results.historyResult"></div>
    </div>

    <div class="section">
      <h2>View Warranty History</h2>
      <div class="form-group">
        <label>Product ID:</label>
        <input type="text" v-model="state.warrantyHistoryForm.productId" placeholder="WATCH001" />
      </div>
      <button @click="getWarrantyHistory">View Warranty History</button>
      <div
        id="warrantyHistoryResult"
        class="result"
        v-html="state.results.warrantyHistoryResult"
      ></div>
    </div>
  </div>
</template>

<script>
import contractService from '../services/contractService.js'
import appStore from '../store/appStore.js'

export default {
  name: 'QueryView',
  data() {
    return { state: appStore.getState() }
  },
  methods: {
    async verifyOwnership() {
      try {
        const result = await contractService.verifyOwnership(this.state.verifyForm.productId)

        let html = '<div class="info">'
        html += '<strong>Verification Result:</strong><br>'
        html += 'You are owner: ' + (result[0] ? '✅ Yes' : '❌ No') + '<br>'
        html += 'Product authentic: ' + (result[1] ? '✅ Yes' : '❌ No') + '<br>'
        html += 'Current owner: ' + result[2] + '<br>'
        html += 'Manufacturer: ' + result[3] + '<br>'
        html += '</div>'

        this.state.results.verifyResult = html
      } catch (error) {
        appStore.updateResult('verifyResult', 'Error: ' + error.message, 'error')
      }
    },

    async getProductDetails() {
      try {
        const result = await contractService.getProductDetails(this.state.queryForm.productId)

        let html = '<div class="info">'
        html += '<strong>Product Details:</strong><br>'
        html += 'Serial Number: ' + result[0] + '<br>'
        html += 'Model: ' + result[1] + '<br>'
        html += 'Specifications: ' + result[2] + '<br>'
        html += 'Manufacturer: ' + result[3] + '<br>'
        html += 'Current Owner: ' + result[4] + '<br>'
        html +=
          'Production Time: ' +
          new Date(parseInt(result[5].toString()) * 1000).toLocaleString() +
          '<br>'

        const warranty = result[6]
        html += '<strong>Warranty Information:</strong><br>'
        html +=
          'Start Date: ' +
          new Date(parseInt(warranty.startDate.toString()) * 1000).toLocaleString() +
          '<br>'
        html += 'Duration: ' + parseInt(warranty.duration.toString()) / (24 * 60 * 60) + ' days<br>'
        html += 'Max Claims: ' + warranty.maxClaims.toString() + '<br>'
        html += 'Used Claims: ' + warranty.usedClaims.toString() + '<br>'
        html += 'Status: ' + this.getWarrantyStatusText(warranty.status) + '<br>'
        html += 'Visibility: ' + (result[7] ? '✅ Visible' : '❌ Hidden') + '<br>'
        html += '</div>'

        this.state.results.detailsResult = html
      } catch (error) {
        appStore.updateResult('detailsResult', 'Error: ' + error.message, 'error')
      }
    },

    async checkWarrantyStatus() {
      try {
        const result = await contractService.checkWarrantyStatus(
          this.state.warrantyCheckForm.productId,
        )

        let html = '<div class="info">'
        html += '<strong>Warranty Status:</strong><br>'
        html += 'Status: ' + this.getWarrantyStatusText(result[0]) + '<br>'
        html += 'Remaining Claims: ' + result[1].toString() + '<br>'
        html +=
          'Expiration Time: ' +
          new Date(parseInt(result[2].toString()) * 1000).toLocaleString() +
          '<br>'
        html += '</div>'

        this.state.results.warrantyResult = html
      } catch (error) {
        appStore.updateResult('warrantyResult', 'Error: ' + error.message, 'error')
      }
    },

    async getOwnershipHistory() {
      try {
        const result = await contractService.getOwnershipHistory(this.state.historyForm.productId)

        let html = '<div class="info">'
        html += '<strong>Ownership History:</strong><br>'
        html += '<ul>'
        result.forEach((record) => {
          html += `<li>Owner: ${record.owner}<br>Role: ${this.getRoleText(record.role)}<br>Transfer Time: ${new Date(parseInt(record.transferTimestamp.toString()) * 1000).toLocaleString()}<br>Transaction Details: ${record.transactionDetails}<br>Visibility: ${record.isVisible ? '✅ Yes' : '❌ No'}</li>`
        })
        html += '</ul>'
        html += '</div>'

        this.state.results.historyResult = html
      } catch (error) {
        appStore.updateResult('historyResult', 'Error: ' + error.message, 'error')
      }
    },

    async getWarrantyHistory() {
      try {
        const result = await contractService.getWarrantyHistory(
          this.state.warrantyHistoryForm.productId,
        )

        let html = '<div class="info">'
        html += '<strong>Warranty History:</strong><br>'
        if (result.length === 0) {
          html += 'No warranty records<br>'
        } else {
          html += '<ul>'
          result.forEach((claim) => {
            html += `<li>Claim ID: ${claim.claimId.toString()}<br>Customer: ${claim.customer}<br>Service Center: ${claim.serviceCenter || 'Not Processed'}<br>Description: ${claim.description}<br>Service Notes: ${claim.serviceNotes || 'Not Processed'}<br>Submit Time: ${new Date(parseInt(claim.submitTimestamp.toString()) * 1000).toLocaleString()}<br>Process Time: ${claim.processTimestamp ? new Date(parseInt(claim.processTimestamp.toString()) * 1000).toLocaleString() : 'Not Processed'}<br>Status: ${this.getClaimStatusText(claim.status)}<br>Visibility: ${claim.isVisible ? '✅ Yes' : '❌ No'}<br></li>`
          })
          html += '</ul>'
        }
        html += '</div>'

        this.state.results.warrantyHistoryResult = html
      } catch (error) {
        appStore.updateResult('warrantyHistoryResult', 'Error: ' + error.message, 'error')
      }
    },

    getWarrantyStatusText(status) {
      const statusMap = { 0: 'Active', 1: 'Expired', 2: 'Revoked', 3: 'Claim Limit Reached' }
      return statusMap[status] || 'Unknown'
    },
    getRoleText(role) {
      const roleMap = {
        0: 'None',
        1: 'Manufacturer',
        2: 'Retailer',
        3: 'Customer',
        4: 'Service Center',
      }
      return roleMap[role] || 'Unknown'
    },
    getClaimStatusText(status) {
      const statusMap = { 0: 'Pending', 1: 'Approved', 2: 'Rejected', 3: 'Completed' }
      return statusMap[status] || 'Unknown'
    },
  },
}
</script>

<style scoped>
.section {
  margin-bottom: 20px;
}
</style>
