// src/store/appStore.js
import { reactive } from 'vue'

class AppStore {
  constructor() {
    this.state = reactive({
      web3: null,
      contract: null,
      accounts: [],
      contractAddress: '0x9450456c3a25a57b9725e49a3ec4e1b71244ff86',
      activeTab: 'RoleManagement',
      tabs: [
        { id: 'RoleManagement', name: 'Role Management' },
        { id: 'Product', name: 'Product Management' },
        { id: 'Warranty', name: 'Warranty Management' },
        { id: 'Query', name: 'Query & Verification' },
      ],

      // Form data
      roleForm: {
        userAddress: '',
        role: '1',
      },
      serviceCenterForm: {
        address: '',
      },
      productForm: {
        productId: '',
        serialNumber: '',
        model: '',
        specifications: '',
        warrantyDuration: 365,
        maxClaims: 3,
      },
      transferForm: {
        productId: '',
        targetAddress: '',
        transactionDetails: '',
        transferType: 'manufacturerToRetailer',
      },
      warrantyClaimForm: {
        productId: '',
        description: '',
      },
      processWarrantyForm: {
        productId: '',
        claimId: 0,
        status: '1',
        serviceNotes: '',
      },
      serviceActionForm: {
        productId: '',
        serviceDescription: '',
        partsReplaced: '',
      },
      verifyForm: {
        productId: '',
      },
      queryForm: {
        productId: '',
      },
      warrantyCheckForm: {
        productId: '',
      },
      historyForm: {
        productId: '',
      },
      warrantyHistoryForm: {
        productId: '',
      },

      // Results display
      results: {
        roleResult: '',
        serviceCenterResult: '',
        registerResult: '',
        transferResult: '',
        claimResult: '',
        processResult: '',
        serviceActionResult: '',
        verifyResult: '',
        detailsResult: '',
        warrantyResult: '',
        historyResult: '',
        warrantyHistoryResult: '',
      },

      // Status information
      status: {
        message: '',
        type: '',
      },
    })
  }

  getState() {
    return this.state
  }

  updateState(updates) {
    Object.assign(this.state, updates)
  }

  resetForm(formName) {
    const formDefaults = {
      roleForm: {
        userAddress: '',
        role: '1',
      },
      serviceCenterForm: {
        address: '',
      },
      productForm: {
        productId: '',
        serialNumber: '',
        model: '',
        specifications: '',
        warrantyDuration: 365,
        maxClaims: 3,
      },
      transferForm: {
        productId: '',
        targetAddress: '',
        transactionDetails: '',
        transferType: 'manufacturerToRetailer',
      },
      warrantyClaimForm: {
        productId: '',
        description: '',
      },
      processWarrantyForm: {
        productId: '',
        claimId: 0,
        status: '1',
        serviceNotes: '',
      },
      serviceActionForm: {
        productId: '',
        serviceDescription: '',
        partsReplaced: '',
      },
      verifyForm: {
        productId: '',
      },
      queryForm: {
        productId: '',
      },
      warrantyCheckForm: {
        productId: '',
      },
      historyForm: {
        productId: '',
      },
      warrantyHistoryForm: {
        productId: '',
      },
    }

    if (formDefaults[formName]) {
      this.state[formName] = { ...formDefaults[formName] }
    }
  }

  updateResult(resultField, message, type = 'info') {
    const typeClass =
      {
        success: 'success',
        error: 'error',
        info: 'info',
      }[type] || 'info'

    this.state.results[resultField] = `<div class="${typeClass}">${message}</div>`
  }

  showStatus(message, type = 'info') {
    this.state.status.message = message
    this.state.status.type = type

    setTimeout(() => {
      this.state.status.message = ''
      this.state.status.type = ''
    }, 5000)
  }
}

export default new AppStore()
