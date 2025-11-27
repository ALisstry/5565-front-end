<template>
  <div class="container">
    <h1>5565 Group 5 dApp</h1>

    <AccountInfo />

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

    <RoleManagement v-show="state.activeTab === 'RoleManagement'" />
    <ProductManagement v-show="state.activeTab === 'Product'" />
    <WarrantyManagement v-show="state.activeTab === 'Warranty'" />
    <QueryView v-show="state.activeTab === 'Query'" />

    <div id="status" :class="['status', state.status.type]" v-if="state.status.message">
      {{ state.status.message }}
    </div>
  </div>
</template>

<script>
import contractService from './services/contractService.js'
import appStore from './store/appStore.js'
import AccountInfo from './components/AccountInfo.vue'
import RoleManagement from './components/RoleManagement.vue'
import ProductManagement from './components/ProductManagement.vue'
import WarrantyManagement from './components/WarrantyManagement.vue'
import QueryView from './components/QueryView.vue'

export default {
  name: 'ProductProvenanceDApp',
  components: {
    AccountInfo,
    RoleManagement,
    ProductManagement,
    WarrantyManagement,
    QueryView,
  },
  data() {
    return {
      state: appStore.getState(),
    }
  },
  computed: {
    connectionStatusText() {
      return this.state.web3 || contractService.isConnected() ? 'Connected' : 'Not Connected'
    },
    connectionStatusClass() {
      return this.state.web3 || contractService.isConnected() ? 'success' : ''
    },
    currentAccount() {
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
  },
}
</script>
