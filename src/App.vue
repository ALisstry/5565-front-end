<template>
  <div class="container">
    <h1>5565 dApp</h1>

    <div class="account-info" id="accountInfo">
      <strong>Connection Status:</strong>
      <span :class="connectionStatusClass">{{ connectionStatusText }}</span
      ><br />
      <strong>Current Account:</strong> <span>{{ currentAccount || 'None' }}</span
      ><br />
      <strong>Contract Address:</strong>
      <input
        type="text"
        v-model="state.contractAddress"
        placeholder="Enter contract address"
        style="width: 400px"
      />
      <button @click="connectWallet">Connect Wallet</button>
      <button @click="loadContract">Load Contract</button>
    </div>

    <div class="tab">
      <button
        v-for="(tab, index) in state.tabs"
        :key="index"
        :class="{ tablinks: true, active: state.activeTab === tab.id }"
        @click="switchTab(tab.id)"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- Role Management Tab -->
    <div v-show="state.activeTab === 'RoleManagement'" class="tabcontent">
      <div class="section">
        <h2>Assign Role</h2>
        <div class="form-group">
          <label>User Address:</label>
          <input type="text" v-model="state.roleForm.userAddress" placeholder="0x..." />
        </div>
        <div class="form-group">
          <label>Role:</label>
          <select v-model="state.roleForm.role">
            <option value="1">Manufacturer</option>
            <option value="2">Retailer</option>
            <option value="3">Customer</option>
            <!-- <option value="4">Service Center</option> -->
          </select>
        </div>
        <button @click="assignRole">Assign Role</button>
        <div id="roleResult" class="result" v-html="state.results.roleResult"></div>
      </div>

      <div class="section">
        <h2>Add Service Center</h2>
        <div class="form-group">
          <label>Service Center Address:</label>
          <input type="text" v-model="state.serviceCenterForm.address" placeholder="0x..." />
        </div>
        <button @click="addServiceCenter">Add Service Center</button>
        <div
          id="serviceCenterResult"
          class="result"
          v-html="state.results.serviceCenterResult"
        ></div>
      </div>
    </div>

    <!-- Product Management Tab -->
    <div v-show="state.activeTab === 'Product'" class="tabcontent">
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
          <input
            type="text"
            v-model="state.productForm.specifications"
            placeholder="Titanium Case"
          />
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

    <!-- Warranty Management Tab -->
    <div v-show="state.activeTab === 'Warranty'" class="tabcontent">
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
            <!-- <option value="3">Completed</option> -->
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
        <div
          id="serviceActionResult"
          class="result"
          v-html="state.results.serviceActionResult"
        ></div>
      </div>
    </div>

    <!-- Query & Verification Tab -->
    <div v-show="state.activeTab === 'Query'" class="tabcontent">
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

    <div id="status" :class="['status', state.status.type]" v-if="state.status.message">
      {{ state.status.message }}
    </div>
  </div>
</template>

<script>
import contractService from './services/contractService.js'
import appStore from './store/appStore.js'

export default {
  name: 'ProductProvenanceDApp',
  data() {
    return {
      state: appStore.getState(),
    }
  },
  computed: {
    connectionStatusText() {
      // Check web3 instance in contractService or local state
      return this.state.web3 || contractService.isConnected() ? 'Connected' : 'Not Connected'
    },
    connectionStatusClass() {
      return this.state.web3 || contractService.isConnected() ? 'success' : ''
    },
    currentAccount() {
      // Get from local state first, then from contractService
      if (this.state.accounts && this.state.accounts.length > 0) {
        return this.state.accounts[0]
      }
      return contractService.getCurrentAccount() || ''
    },
  },
  methods: {
    switchTab(tabId) {
      this.state.activeTab = tabId
    },

    async connectWallet() {
      try {
        const result = await contractService.connectWallet()
        // Ensure web3 and accounts are updated in store
        this.state.web3 = result.web3
        this.state.accounts = result.accounts
        appStore.showStatus('Wallet connected successfully!', 'success')
        // Force update computed properties
        this.$forceUpdate()
      } catch (error) {
        appStore.showStatus('Connection failed: ' + error.message, 'error')
      }
    },

    async loadContract() {
      try {
        await contractService.loadContract(this.state.contractAddress)
        appStore.showStatus('Contract loaded successfully!', 'success')
      } catch (error) {
        appStore.showStatus('Failed to load contract: ' + error.message, 'error')
      }
    },

    async assignRole() {
      try {
        await contractService.assignRole(this.state.roleForm.userAddress, this.state.roleForm.role)
        appStore.updateResult('roleResult', 'Role assigned successfully!', 'success')
      } catch (error) {
        appStore.updateResult('roleResult', 'Error: ' + error.message, 'error')
      }
    },

    async addServiceCenter() {
      try {
        await contractService.addServiceCenter(this.state.serviceCenterForm.address)
        appStore.updateResult(
          'serviceCenterResult',
          'Service center added successfully!',
          'success',
        )
      } catch (error) {
        appStore.updateResult('serviceCenterResult', 'Error: ' + error.message, 'error')
      }
    },

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

        // Warranty Information
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
        result.forEach((record, index) => {
          html += `<li>
            Owner: ${record.owner}<br>
            Role: ${this.getRoleText(record.role)}<br>
            Transfer Time: ${new Date(parseInt(record.transferTimestamp.toString()) * 1000).toLocaleString()}<br>
            Transaction Details: ${record.transactionDetails}<br>
            Visibility: ${record.isVisible ? '✅ Yes' : '❌ No'}
          </li>`
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
            html += `<li>
              Claim ID: ${claim.claimId.toString()}<br>
              Customer: ${claim.customer}<br>
              Service Center: ${claim.serviceCenter || 'Not Processed'}<br>
              Description: ${claim.description}<br>
              Service Notes: ${claim.serviceNotes || 'Not Processed'}<br>
              Submit Time: ${new Date(parseInt(claim.submitTimestamp.toString()) * 1000).toLocaleString()}<br>
              Process Time: ${claim.processTimestamp ? new Date(parseInt(claim.processTimestamp.toString()) * 1000).toLocaleString() : 'Not Processed'}<br>
              Status: ${this.getClaimStatusText(claim.status)}<br>
              Visibility: ${claim.isVisible ? '✅ Yes' : '❌ No'}<br>
            </li>`
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
      const statusMap = {
        0: 'Active',
        1: 'Expired',
        2: 'Revoked',
        3: 'Claim Limit Reached',
      }
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
      const statusMap = {
        0: 'Pending',
        1: 'Approved',
        2: 'Rejected',
        3: 'Completed',
      }
      return statusMap[status] || 'Unknown'
    },
  },

  async mounted() {
    // Automatically try to connect wallet
    if (window.ethereum) {
      try {
        const result = await contractService.connectWallet()
        // Ensure web3 and accounts are updated in store
        this.state.web3 = result.web3
        this.state.accounts = result.accounts
      } catch (error) {
        console.log('Wallet not auto-connected')
      }
    }
  },
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  padding: 20px;
  min-height: 100vh;
  margin: 0;
}

.container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex: 1;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

.section h2 {
  color: #555;
  margin-bottom: 15px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 5px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

input,
select,
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
  margin-bottom: 10px;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.result {
  margin-top: 10px;
  padding: 10px;
  background: #e9ecef;
  border-radius: 4px;
  border-left: 4px solid #007bff;
}

.status {
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
}

.success {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.error {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.info {
  background: #d1ecf1;
  border: 1px solid #bee5eb;
  color: #0c5460;
}

.tab {
  overflow: hidden;
  border: 1px solid #ccc;
  background-color: #f1f1f1;
  border-radius: 4px 4px 0 0;
}

.tab button {
  background-color: inherit;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  transition: 0.3s;
  color: #333;
  margin: 0;
  border-radius: 0;
}

.tab button:hover {
  background-color: #ddd;
}

.tab button.active {
  background-color: #007bff;
  color: white;
}

.tabcontent {
  padding: 20px;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
}

.account-info {
  background: #e7f3ff;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}

/* Responsive Design */
@media (max-width: 768px) {
  body {
    padding: 10px;
  }

  .container {
    padding: 15px;
  }

  .account-info input {
    width: 100%;
    margin-bottom: 10px;
  }

  .tab button {
    padding: 10px 12px;
    font-size: 14px;
  }
}
</style>
