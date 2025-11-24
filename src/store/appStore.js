// src/store/appStore.js
import { reactive } from 'vue'

class AppStore {
  constructor() {
    this.state = reactive({
      web3: null,
      contract: null,
      accounts: [],
      contractAddress: '',
      activeTab: 'RoleManagement',
      tabs: [
        { id: 'RoleManagement', name: '角色管理' },
        { id: 'Product', name: '产品管理' },
        { id: 'Warranty', name: '保修管理' },
        { id: 'Query', name: '查询验证' },
      ],

      // 表单数据
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

      // 结果显示
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

      // 状态信息
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
