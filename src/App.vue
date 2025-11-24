<template>
  <div class="container">
    <h1>🔗 Product Provenance dApp</h1>

    <div class="account-info" id="accountInfo">
      <strong>连接状态:</strong>
      <span :class="connectionStatusClass">{{ connectionStatusText }}</span
      ><br />
      <strong>当前账户:</strong> <span>{{ currentAccount || '无' }}</span
      ><br />
      <strong>合约地址:</strong>
      <input
        type="text"
        v-model="contractAddress"
        placeholder="输入合约地址"
        style="width: 400px"
      />
      <button @click="connectWallet">连接钱包</button>
      <button @click="loadContract">加载合约</button>
    </div>

    <div class="tab">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :class="{ tablinks: true, active: activeTab === tab.id }"
        @click="switchTab(tab.id)"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- 角色管理标签 -->
    <div v-show="activeTab === 'RoleManagement'" class="tabcontent">
      <div class="section">
        <h2>分配角色</h2>
        <div class="form-group">
          <label>用户地址:</label>
          <input type="text" v-model="roleForm.userAddress" placeholder="0x..." />
        </div>
        <div class="form-group">
          <label>角色:</label>
          <select v-model="roleForm.role">
            <option value="1">制造商 (Manufacturer)</option>
            <option value="2">零售商 (Retailer)</option>
            <option value="3">消费者 (Customer)</option>
          </select>
        </div>
        <button @click="assignRole">分配角色</button>
        <div id="roleResult" class="result" v-html="results.roleResult"></div>
      </div>

      <div class="section">
        <h2>添加服务中心</h2>
        <div class="form-group">
          <label>服务中心地址:</label>
          <input type="text" v-model="serviceCenterForm.address" placeholder="0x..." />
        </div>
        <button @click="addServiceCenter">添加服务中心</button>
        <div id="serviceCenterResult" class="result" v-html="results.serviceCenterResult"></div>
      </div>
    </div>

    <!-- 产品管理标签 -->
    <div v-show="activeTab === 'Product'" class="tabcontent">
      <div class="section">
        <h2>注册新产品</h2>
        <div class="form-group">
          <label>产品ID:</label>
          <input type="text" v-model="productForm.productId" placeholder="WATCH001" />
        </div>
        <div class="form-group">
          <label>序列号:</label>
          <input type="text" v-model="productForm.serialNumber" placeholder="SN123456" />
        </div>
        <div class="form-group">
          <label>型号:</label>
          <input type="text" v-model="productForm.model" placeholder="Apple Watch" />
        </div>
        <div class="form-group">
          <label>规格:</label>
          <input type="text" v-model="productForm.specifications" placeholder="Titanium Case" />
        </div>
        <div class="form-group">
          <label>保修时长 (天):</label>
          <input type="number" v-model.number="productForm.warrantyDuration" />
        </div>
        <div class="form-group">
          <label>最大保修次数:</label>
          <input type="number" v-model.number="productForm.maxClaims" />
        </div>
        <button @click="registerProduct">注册产品</button>
        <div id="registerResult" class="result" v-html="results.registerResult"></div>
      </div>

      <div class="section">
        <h2>转移所有权</h2>
        <div class="form-group">
          <label>产品ID:</label>
          <input type="text" v-model="transferForm.productId" placeholder="WATCH001" />
        </div>
        <div class="form-group">
          <label>目标地址:</label>
          <input type="text" v-model="transferForm.targetAddress" placeholder="0x..." />
        </div>
        <div class="form-group">
          <label>交易详情:</label>
          <input type="text" v-model="transferForm.transactionDetails" placeholder="描述转移原因" />
        </div>
        <div class="form-group">
          <label>转移类型:</label>
          <select v-model="transferForm.transferType">
            <option value="manufacturerToRetailer">制造商 → 零售商</option>
            <option value="retailerToCustomer">零售商 → 消费者</option>
            <option value="customerToCustomer">消费者 → 消费者 (转售)</option>
          </select>
        </div>
        <button @click="transferOwnership">转移所有权</button>
        <div id="transferResult" class="result" v-html="results.transferResult"></div>
      </div>
    </div>

    <!-- 保修管理标签 -->
    <div v-show="activeTab === 'Warranty'" class="tabcontent">
      <div class="section">
        <h2>提交保修申请</h2>
        <div class="form-group">
          <label>产品ID:</label>
          <input type="text" v-model="warrantyClaimForm.productId" placeholder="WATCH001" />
        </div>
        <div class="form-group">
          <label>问题描述:</label>
          <textarea
            v-model="warrantyClaimForm.description"
            rows="3"
            placeholder="详细描述产品问题..."
          ></textarea>
        </div>
        <button @click="submitWarrantyClaim">提交保修申请</button>
        <div id="claimResult" class="result" v-html="results.claimResult"></div>
      </div>

      <div class="section">
        <h2>处理保修申请</h2>
        <div class="form-group">
          <label>产品ID:</label>
          <input type="text" v-model="processWarrantyForm.productId" placeholder="WATCH001" />
        </div>
        <div class="form-group">
          <label>申请ID:</label>
          <input type="number" v-model.number="processWarrantyForm.claimId" />
        </div>
        <div class="form-group">
          <label>处理状态:</label>
          <select v-model="processWarrantyForm.status">
            <option value="1">批准 (Approved)</option>
            <option value="2">拒绝 (Rejected)</option>
          </select>
        </div>
        <div class="form-group">
          <label>服务说明:</label>
          <textarea
            v-model="processWarrantyForm.serviceNotes"
            rows="3"
            placeholder="维修详情和更换部件..."
          ></textarea>
        </div>
        <button @click="processWarrantyClaim">处理保修申请</button>
        <div id="processResult" class="result" v-html="results.processResult"></div>
      </div>
    </div>

    <!-- 查询验证标签 -->
    <div v-show="activeTab === 'Query'" class="tabcontent">
      <div class="section">
        <h2>验证产品所有权</h2>
        <div class="form-group">
          <label>产品ID:</label>
          <input type="text" v-model="verifyForm.productId" placeholder="WATCH001" />
        </div>
        <button @click="verifyOwnership">验证所有权</button>
        <div id="verifyResult" class="result" v-html="results.verifyResult"></div>
      </div>

      <div class="section">
        <h2>查询产品详情</h2>
        <div class="form-group">
          <label>产品ID:</label>
          <input type="text" v-model="queryForm.productId" placeholder="WATCH001" />
        </div>
        <button @click="getProductDetails">查询详情</button>
        <div id="detailsResult" class="result" v-html="results.detailsResult"></div>
      </div>

      <div class="section">
        <h2>检查保修状态</h2>
        <div class="form-group">
          <label>产品ID:</label>
          <input type="text" v-model="warrantyCheckForm.productId" placeholder="WATCH001" />
        </div>
        <button @click="checkWarrantyStatus">检查状态</button>
        <div id="warrantyResult" class="result" v-html="results.warrantyResult"></div>
      </div>

      <div class="section">
        <h2>查看所有权历史</h2>
        <div class="form-group">
          <label>产品ID:</label>
          <input type="text" v-model="historyForm.productId" placeholder="WATCH001" />
        </div>
        <button @click="getOwnershipHistory">查看历史</button>
        <div id="historyResult" class="result" v-html="results.historyResult"></div>
      </div>
    </div>

    <div id="status" :class="['status', status.type]" v-if="status.message">
      {{ status.message }}
    </div>
  </div>
</template>

<script>
import Web3 from 'web3'
import contractABI from './contractABI.json'

export default {
  name: 'ProductProvenanceDApp',
  data() {
    return {
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

      // 结果显示
      results: {
        roleResult: '',
        serviceCenterResult: '',
        registerResult: '',
        transferResult: '',
        claimResult: '',
        processResult: '',
        verifyResult: '',
        detailsResult: '',
        warrantyResult: '',
        historyResult: '',
      },

      // 状态信息
      status: {
        message: '',
        type: '',
      },
    }
  },
  computed: {
    connectionStatusText() {
      return this.web3 ? '已连接' : '未连接'
    },
    connectionStatusClass() {
      return this.web3 ? 'success' : ''
    },
    currentAccount() {
      return this.accounts.length > 0 ? this.accounts[0] : ''
    },
  },
  methods: {
    switchTab(tabId) {
      this.activeTab = tabId
    },

    async connectWallet() {
      try {
        if (window.ethereum) {
          this.web3 = new Web3(window.ethereum)
          await window.ethereum.request({ method: 'eth_requestAccounts' })
          this.accounts = await this.web3.eth.getAccounts()

          this.showStatus('钱包连接成功!', 'success')
        } else {
          this.showStatus('请安装MetaMask!', 'error')
        }
      } catch (error) {
        this.showStatus('连接失败: ' + error.message, 'error')
      }
    },

    async loadContract() {
      if (!this.contractAddress) {
        this.showStatus('请输入合约地址!', 'error')
        return
      }

      if (!this.web3) {
        this.showStatus('请先连接钱包!', 'error')
        return
      }

      try {
        this.contract = new this.web3.eth.Contract(contractABI, this.contractAddress)
        this.showStatus('合约加载成功!', 'success')
      } catch (error) {
        this.showStatus('合约加载失败: ' + error.message, 'error')
      }
    },

    async assignRole() {
      try {
        await this.contract.methods
          .assignRole(this.roleForm.userAddress, this.roleForm.role)
          .send({ from: this.accounts[0] })

        this.results.roleResult = '<div class="success">角色分配成功!</div>'
      } catch (error) {
        this.results.roleResult = '<div class="error">错误: ' + error.message + '</div>'
      }
    },

    async addServiceCenter() {
      // 实现添加服务中心逻辑
      this.results.serviceCenterResult = '<div class="info">功能待实现</div>'
    },

    async registerProduct() {
      try {
        await this.contract.methods
          .registerProduct(
            this.productForm.productId,
            this.productForm.serialNumber,
            this.productForm.model,
            this.productForm.specifications,
            this.productForm.warrantyDuration,
            this.productForm.maxClaims,
          )
          .send({ from: this.accounts[0] })

        this.results.registerResult = '<div class="success">产品注册成功!</div>'
      } catch (error) {
        this.results.registerResult = '<div class="error">错误: ' + error.message + '</div>'
      }
    },

    async transferOwnership() {
      // 实现转移所有权逻辑
      this.results.transferResult = '<div class="info">功能待实现</div>'
    },

    async submitWarrantyClaim() {
      try {
        const result = await this.contract.methods
          .submitWarrantyClaim(this.warrantyClaimForm.productId, this.warrantyClaimForm.description)
          .send({ from: this.accounts[0] })

        this.results.claimResult =
          '<div class="success">保修申请提交成功! Claim ID: ' +
          result.events.WarrantyClaimSubmitted.returnValues.claimId +
          '</div>'
      } catch (error) {
        this.results.claimResult = '<div class="error">错误: ' + error.message + '</div>'
      }
    },

    async processWarrantyClaim() {
      // 实现处理保修申请逻辑
      this.results.processResult = '<div class="info">功能待实现</div>'
    },

    async verifyOwnership() {
      try {
        const result = await this.contract.methods
          .verifyProductOwnership(this.verifyForm.productId)
          .call({ from: this.accounts[0] })

        let html = '<div class="info">'
        html += '<strong>验证结果:</strong><br>'
        html += '您是所有者: ' + (result[0] ? '✅ 是' : '❌ 否') + '<br>'
        html += '产品真实: ' + (result[1] ? '✅ 是' : '❌ 否') + '<br>'
        html += '当前所有者: ' + result[2] + '<br>'
        html += '制造商: ' + result[3] + '<br>'
        html += '</div>'

        this.results.verifyResult = html
      } catch (error) {
        this.results.verifyResult = '<div class="error">错误: ' + error.message + '</div>'
      }
    },

    async getProductDetails() {
      // 实现查询产品详情逻辑
      this.results.detailsResult = '<div class="info">功能待实现</div>'
    },

    async checkWarrantyStatus() {
      // 实现检查保修状态逻辑
      this.results.warrantyResult = '<div class="info">功能待实现</div>'
    },

    async getOwnershipHistory() {
      // 实现查看所有权历史逻辑
      this.results.historyResult = '<div class="info">功能待实现</div>'
    },

    showStatus(message, type) {
      this.status.message = message
      this.status.type = type

      setTimeout(() => {
        this.status.message = ''
        this.status.type = ''
      }, 5000)
    },
  },

  async mounted() {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum)
      try {
        this.accounts = await this.web3.eth.getAccounts()
      } catch (error) {
        console.log('未自动连接钱包')
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

body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
</style>
