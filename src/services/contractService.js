// src/services/contractService.js
import Web3 from 'web3'
import contractABI from '../contractABI.json'

class ContractService {
  constructor() {
    this.web3 = null
    this.contract = null
    this.accounts = []
  }

  // 连接钱包
  async connectWallet() {
    if (!window.ethereum) {
      throw new Error('请安装MetaMask!')
    }

    this.web3 = new Web3(window.ethereum)
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    this.accounts = await this.web3.eth.getAccounts()

    return {
      web3: this.web3,
      accounts: this.accounts,
    }
  }

  // 加载合约
  async loadContract(contractAddress) {
    if (!this.web3) {
      throw new Error('请先连接钱包!')
    }

    if (!contractAddress) {
      throw new Error('请输入合约地址!')
    }

    // 验证地址格式
    if (!this.web3.utils.isAddress(contractAddress)) {
      throw new Error('合约地址格式不正确!')
    }

    this.contract = new this.web3.eth.Contract(contractABI, contractAddress)

    // 验证合约是否有效
    try {
      await this.contract.methods.address().call()
    } catch (error) {
      this.contract = null
      throw new Error('合约地址无效，请确认合约已部署')
    }

    return this.contract
  }

  // 检查是否已连接
  isConnected() {
    return !!this.web3
  }

  // 检查合约是否已加载
  isContractLoaded() {
    return !!this.contract
  }

  // 获取当前账户
  getCurrentAccount() {
    return this.accounts.length > 0 ? this.accounts[0] : null
  }

  // 角色管理相关方法
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

  // 产品管理相关方法
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

    // 根据转移类型调用不同方法
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
        throw new Error('无效的转移类型')
    }
  }

  // 保修管理相关方法
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

  // 查询验证相关方法
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

  // 验证合约调用的私有方法
  _validateContractCall() {
    if (!this.web3) {
      throw new Error('请先连接钱包!')
    }

    if (!this.contract) {
      throw new Error('请先加载合约!')
    }

    if (this.accounts.length === 0) {
      throw new Error('未检测到账户，请重新连接钱包!')
    }
  }
}

export default new ContractService()
