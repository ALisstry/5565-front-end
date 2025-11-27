<template>
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
</template>

<script>
import contractService from '../services/contractService.js'
import appStore from '../store/appStore.js'

export default {
  name: 'AccountInfo',
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
    async connectWallet() {
      try {
        const result = await contractService.connectWallet()
        this.state.web3 = result.web3
        this.state.accounts = result.accounts
        appStore.showStatus('Wallet connected successfully!', 'success')
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
  },
}
</script>

<style scoped>
.account-info {
  background: #e7f3ff;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}
</style>
