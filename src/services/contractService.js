// src/services/contractService.js
import Web3 from 'web3'
import contractABI from '../contractABI.json'
import appStore from '../store/appStore.js'

class ContractService {
  constructor() {
    this.web3 = null
    this.contract = null
    this.accounts = []
  }

  // Connect Wallet
  async connectWallet() {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask!')
    }

    this.web3 = new Web3(window.ethereum)
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    this.accounts = await this.web3.eth.getAccounts()

    // Update web3 and accounts in store
    const state = appStore.getState()
    state.web3 = this.web3
    state.accounts = this.accounts

    return {
      web3: this.web3,
      accounts: this.accounts,
    }
  }

  // Load Contract
  async loadContract(contractAddress) {
    if (!this.web3) {
      throw new Error('Please connect wallet first!')
    }

    if (!contractAddress) {
      throw new Error('Please enter contract address!')
    }

    // Validate address format
    if (!this.web3.utils.isAddress(contractAddress)) {
      throw new Error('Invalid contract address format!')
    }

    this.contract = new this.web3.eth.Contract(contractABI, contractAddress)

    // Validate if contract is valid - by calling a simple read-only method
    try {
      // Call getRole method with zero address, which always returns a value (even 0),
      // but can verify if contract exists
      await this.contract.methods.getRole('0x0000000000000000000000000000000000000000').call()
    } catch (error) {
      this.contract = null
      console.error('Contract validation failed:', error)
      throw new Error('Invalid contract address, please confirm contract is deployed')
    }

    // Update contract in store
    const state = appStore.getState()
    state.contract = this.contract
    state.contractAddress = contractAddress

    return this.contract
  }

  // Check if connected
  isConnected() {
    return !!this.web3
  }

  // Check if contract is loaded
  isContractLoaded() {
    return !!this.contract
  }

  // Get current account
  getCurrentAccount() {
    return this.accounts.length > 0 ? this.accounts[0] : null
  }

  // Role management methods
  async assignRole(userAddress, role) {
    this._validateContractCall()
    return await this.contract.methods
      .assignRole(userAddress, role)
      .send({ from: this.accounts[0] })
  }

  async addServiceCenter(address) {
    this._validateContractCall()
    return await this.contract.methods.addServiceCenter(address).send({ from: this.accounts[0] })
  }

  // Product management methods
  async registerProduct(productData) {
    this._validateContractCall()
    const { productId, serialNumber, model, specifications, warrantyDuration, maxClaims } =
      productData
    return await this.contract.methods
      .registerProduct(productId, serialNumber, model, specifications, warrantyDuration, maxClaims)
      .send({ from: this.accounts[0] })
  }

  async transferOwnership(transferData) {
    this._validateContractCall()
    const { productId, targetAddress, transactionDetails, transferType } = transferData

    // Call different methods based on transfer type
    switch (transferType) {
      case 'manufacturerToRetailer':
        return await this.contract.methods
          .transferToRetailer(productId, targetAddress, transactionDetails)
          .send({ from: this.accounts[0] })
      case 'retailerToCustomer':
        return await this.contract.methods
          .sellToCustomer(productId, targetAddress, transactionDetails)
          .send({ from: this.accounts[0] })
      case 'customerToCustomer':
        return await this.contract.methods
          .resellProduct(productId, targetAddress, transactionDetails)
          .send({ from: this.accounts[0] })
      default:
        throw new Error('Invalid transfer type')
    }
  }

  // Warranty management methods
  async submitWarrantyClaim(productId, description) {
    this._validateContractCall()
    return await this.contract.methods
      .submitWarrantyClaim(productId, description)
      .send({ from: this.accounts[0] })
  }

  async processWarrantyClaim(productId, claimId, status, serviceNotes) {
    this._validateContractCall()
    return await this.contract.methods
      .processWarrantyClaim(productId, claimId, status, serviceNotes)
      .send({ from: this.accounts[0] })
  }

  async logServiceAction(productId, serviceDescription, partsReplaced) {
    this._validateContractCall()
    return await this.contract.methods
      .logServiceAction(productId, serviceDescription, partsReplaced)
      .send({ from: this.accounts[0] })
  }

  // Query and verification methods
  async verifyOwnership(productId) {
    this._validateContractCall()
    return await this.contract.methods
      .verifyProductOwnership(productId)
      .call({ from: this.accounts[0] })
  }

  async getProductDetails(productId) {
    this._validateContractCall()
    return await this.contract.methods.getProductDetails(productId).call({ from: this.accounts[0] })
  }

  async checkWarrantyStatus(productId) {
    this._validateContractCall()
    return await this.contract.methods
      .checkWarrantyStatus(productId)
      .call({ from: this.accounts[0] })
  }

  async getOwnershipHistory(productId) {
    this._validateContractCall()
    return await this.contract.methods
      .getOwnershipHistory(productId)
      .call({ from: this.accounts[0] })
  }

  async getWarrantyHistory(productId) {
    this._validateContractCall()
    return await this.contract.methods
      .getWarrantyHistory(productId)
      .call({ from: this.accounts[0] })
  }

  async getUserProducts(userAddress) {
    this._validateContractCall()
    return await this.contract.methods.getUserProducts(userAddress).call({ from: this.accounts[0] })
  }

  async getRole(userAddress) {
    this._validateContractCall()
    return await this.contract.methods.getRole(userAddress).call({ from: this.accounts[0] })
  }

  async isServiceCenter(userAddress) {
    this._validateContractCall()
    return await this.contract.methods.isServiceCenter(userAddress).call({ from: this.accounts[0] })
  }

  // Private method to validate contract calls
  _validateContractCall() {
    if (!this.web3) {
      throw new Error('Please connect wallet first!')
    }

    if (!this.contract) {
      throw new Error('Please load contract first!')
    }

    if (this.accounts.length === 0) {
      throw new Error('No account detected, please reconnect wallet!')
    }
  }
}

export default new ContractService()
