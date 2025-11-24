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
        v-model="state.contractAddress"
        placeholder="输入合约地址"
        style="width: 400px"
      />
      <button @click="connectWallet">连接钱包</button>
      <button @click="loadContract">加载合约</button>
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

    <!-- 角色管理标签 -->
    <div v-show="state.activeTab === 'RoleManagement'" class="tabcontent">
      <div class="section">
        <h2>分配角色</h2>
        <div class="form-group">
          <label>用户地址:</label>
          <input type="text" v-model="state.roleForm.userAddress" placeholder="0x..." />
        </div>
        <div class="form-group">
          <label>角色:</label>
          <select v-model="state.roleForm.role">
            <option value="1">制造商 (Manufacturer)</option>
            <option value="2">零售商 (Retailer)</option>
            <option value="3">消费者 (Customer)</option>
            <option value="4">服务中心 (ServiceCenter)</option>
          </select>
        </div>
        <button @click="assignRole">分配角色</button>
        <div id="roleResult" class="result" v-html="state.results.roleResult"></div>
      </div>

      <div class="section">
        <h2>添加服务中心</h2>
        <div class="form-group">
          <label>服务中心地址:</label>
          <input type="text" v-model="state.serviceCenterForm.address" placeholder="0x..." />
        </div>
        <button @click="addServiceCenter">添加服务中心</button>
        <div
          id="serviceCenterResult"
          class="result"
          v-html="state.results.serviceCenterResult"
        ></div>
      </div>
    </div>

    <!-- 产品管理标签 -->
    <div v-show="state.activeTab === 'Product'" class="tabcontent">
      <div class="section">
        <h2>注册新产品</h2>
        <div class="form-group">
          <label>产品ID:</label>
          <input type="text" v-model="state.productForm.productId" placeholder="WATCH001" />
        </div>
        <div class="form-group">
          <label>序列号:</label>
          <input type="text" v-model="state.productForm.serialNumber" placeholder="SN123456" />
        </div>
        <div class="form-group">
          <label>型号:</label>
          <input type="text" v-model="state.productForm.model" placeholder="Apple Watch" />
        </div>
        <div class="form-group">
          <label>规格:</label>
          <input
            type="text"
            v-model="state.productForm.specifications"
            placeholder="Titanium Case"
          />
        </div>
        <div class="form-group">
          <label>保修时长 (天):</label>
          <input type="number" v-model.number="state.productForm.warrantyDuration" />
        </div>
        <div class="form-group">
          <label>最大保修次数:</label>
          <input type="number" v-model.number="state.productForm.maxClaims" />
        </div>
        <button @click="registerProduct">注册产品</button>
        <div id="registerResult" class="result" v-html="state.results.registerResult"></div>
      </div>

      <div class="section">
        <h2>转移所有权</h2>
        <div class="form-group">
          <label>产品ID:</label>
          <input type="text" v-model="state.transferForm.productId" placeholder="WATCH001" />
        </div>
        <div class="form-group">
          <label>目标地址:</label>
          <input type="text" v-model="state.transferForm.targetAddress" placeholder="0x..." />
        </div>
        <div class="form-group">
          <label>交易详情:</label>
          <input
            type="text"
            v-model="state.transferForm.transactionDetails"
            placeholder="描述转移原因"
          />
        </div>
        <div class="form-group">
          <label>转移类型:</label>
          <select v-model="state.transferForm.transferType">
            <option value="manufacturerToRetailer">制造商 → 零售商</option>
            <option value="retailerToCustomer">零售商 → 消费者</option>
            <option value="customerToCustomer">消费者 → 消费者 (转售)</option>
          </select>
        </div>
        <button @click="transferOwnership">转移所有权</button>
        <div id="transferResult" class="result" v-html="state.results.transferResult"></div>
      </div>
    </div>

    <!-- 保修管理标签 -->
    <div v-show="state.activeTab === 'Warranty'" class="tabcontent">
      <div class="section">
        <h2>提交保修申请</h2>
        <div class="form-group">
          <label>产品ID:</label>
          <input type="text" v-model="state.warrantyClaimForm.productId" placeholder="WATCH001" />
        </div>
        <div class="form-group">
          <label>问题描述:</label>
          <textarea
            v-model="state.warrantyClaimForm.description"
            rows="3"
            placeholder="详细描述产品问题..."
          ></textarea>
        </div>
        <button @click="submitWarrantyClaim">提交保修申请</button>
        <div id="claimResult" class="result" v-html="state.results.claimResult"></div>
      </div>

      <div class="section">
        <h2>处理保修申请</h2>
        <div class="form-group">
          <label>产品ID:</label>
          <input type="text" v-model="state.processWarrantyForm.productId" placeholder="WATCH001" />
        </div>
        <div class="form-group">
          <label>申请ID:</label>
          <input type="number" v-model.number="state.processWarrantyForm.claimId" />
        </div>
        <div class="form-group">
          <label>处理状态:</label>
          <select v-model="state.processWarrantyForm.status">
            <option value="1">批准 (Approved)</option>
            <option value="2">拒绝 (Rejected)</option>
            <option value="3">完成 (Completed)</option>
          </select>
        </div>
        <div class="form-group">
          <label>服务说明:</label>
          <textarea
            v-model="state.processWarrantyForm.serviceNotes"
            rows="3"
            placeholder="维修详情和更换部件..."
          ></textarea>
        </div>
        <button @click="processWarrantyClaim">处理保修申请</button>
        <div id="processResult" class="result" v-html="state.results.processResult"></div>
      </div>

      <div class="section">
        <h2>记录服务操作</h2>
        <div class="form-group">
          <label>产品ID:</label>
          <input type="text" v-model="state.serviceActionForm.productId" placeholder="WATCH001" />
        </div>
        <div class="form-group">
          <label>服务描述:</label>
          <textarea
            v-model="state.serviceActionForm.serviceDescription"
            rows="3"
            placeholder="服务描述..."
          ></textarea>
        </div>
        <div class="form-group">
          <label>更换部件:</label>
          <textarea
            v-model="state.serviceActionForm.partsReplaced"
            rows="3"
            placeholder="更换的部件..."
          ></textarea>
        </div>
        <button @click="logServiceAction">记录服务</button>
        <div
          id="serviceActionResult"
          class="result"
          v-html="state.results.serviceActionResult"
        ></div>
      </div>
    </div>

    <!-- 查询验证标签 -->
    <div v-show="state.activeTab === 'Query'" class="tabcontent">
      <div class="section">
        <h2>验证产品所有权</h2>
        <div class="form-group">
          <label>产品ID:</label>
          <input type="text" v-model="state.verifyForm.productId" placeholder="WATCH001" />
        </div>
        <button @click="verifyOwnership">验证所有权</button>
        <div id="verifyResult" class="result" v-html="state.results.verifyResult"></div>
      </div>

      <div class="section">
        <h2>查询产品详情</h2>
        <div class="form-group">
          <label>产品ID:</label>
          <input type="text" v-model="state.queryForm.productId" placeholder="WATCH001" />
        </div>
        <button @click="getProductDetails">查询详情</button>
        <div id="detailsResult" class="result" v-html="state.results.detailsResult"></div>
      </div>

      <div class="section">
        <h2>检查保修状态</h2>
        <div class="form-group">
          <label>产品ID:</label>
          <input type="text" v-model="state.warrantyCheckForm.productId" placeholder="WATCH001" />
        </div>
        <button @click="checkWarrantyStatus">检查状态</button>
        <div id="warrantyResult" class="result" v-html="state.results.warrantyResult"></div>
      </div>

      <div class="section">
        <h2>查看所有权历史</h2>
        <div class="form-group">
          <label>产品ID:</label>
          <input type="text" v-model="state.historyForm.productId" placeholder="WATCH001" />
        </div>
        <button @click="getOwnershipHistory">查看历史</button>
        <div id="historyResult" class="result" v-html="state.results.historyResult"></div>
      </div>

      <div class="section">
        <h2>查看保修历史</h2>
        <div class="form-group">
          <label>产品ID:</label>
          <input type="text" v-model="state.warrantyHistoryForm.productId" placeholder="WATCH001" />
        </div>
        <button @click="getWarrantyHistory">查看保修历史</button>
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
      // 检查contractService或本地状态中的web3实例
      return this.state.web3 || contractService.isConnected() ? '已连接' : '未连接'
    },
    connectionStatusClass() {
      return this.state.web3 || contractService.isConnected() ? 'success' : ''
    },
    currentAccount() {
      // 优先从本地状态获取，然后从contractService获取
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
        // 确保更新store中的web3和accounts
        this.state.web3 = result.web3
        this.state.accounts = result.accounts
        appStore.showStatus('钱包连接成功!', 'success')
        // 强制更新计算属性
        this.$forceUpdate()
      } catch (error) {
        appStore.showStatus('连接失败: ' + error.message, 'error')
      }
    },

    async loadContract() {
      try {
        await contractService.loadContract(this.state.contractAddress)
        appStore.showStatus('合约加载成功!', 'success')
      } catch (error) {
        appStore.showStatus('合约加载失败: ' + error.message, 'error')
      }
    },

    async assignRole() {
      try {
        await contractService.assignRole(this.state.roleForm.userAddress, this.state.roleForm.role)
        appStore.updateResult('roleResult', '角色分配成功!', 'success')
      } catch (error) {
        appStore.updateResult('roleResult', '错误: ' + error.message, 'error')
      }
    },

    async addServiceCenter() {
      try {
        await contractService.addServiceCenter(this.state.serviceCenterForm.address)
        appStore.updateResult('serviceCenterResult', '服务中心添加成功!', 'success')
      } catch (error) {
        appStore.updateResult('serviceCenterResult', '错误: ' + error.message, 'error')
      }
    },

    async registerProduct() {
      try {
        await contractService.registerProduct(this.state.productForm)
        appStore.updateResult('registerResult', '产品注册成功!', 'success')
        appStore.resetForm('productForm')
      } catch (error) {
        appStore.updateResult('registerResult', '错误: ' + error.message, 'error')
      }
    },

    async transferOwnership() {
      try {
        await contractService.transferOwnership(this.state.transferForm)
        appStore.updateResult('transferResult', '所有权转移成功!', 'success')
        appStore.resetForm('transferForm')
      } catch (error) {
        appStore.updateResult('transferResult', '错误: ' + error.message, 'error')
      }
    },

    async submitWarrantyClaim() {
      try {
        const result = await contractService.submitWarrantyClaim(
          this.state.warrantyClaimForm.productId,
          this.state.warrantyClaimForm.description,
        )

        const claimId = result.events.WarrantyClaimSubmitted.returnValues.claimId
        appStore.updateResult('claimResult', `保修申请提交成功! Claim ID: ${claimId}`, 'success')
        appStore.resetForm('warrantyClaimForm')
      } catch (error) {
        appStore.updateResult('claimResult', '错误: ' + error.message, 'error')
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
        appStore.updateResult('processResult', '保修申请处理成功!', 'success')
        appStore.resetForm('processWarrantyForm')
      } catch (error) {
        appStore.updateResult('processResult', '错误: ' + error.message, 'error')
      }
    },

    async logServiceAction() {
      try {
        await contractService.logServiceAction(
          this.state.serviceActionForm.productId,
          this.state.serviceActionForm.serviceDescription,
          this.state.serviceActionForm.partsReplaced,
        )
        appStore.updateResult('serviceActionResult', '服务记录成功!', 'success')
        appStore.resetForm('serviceActionForm')
      } catch (error) {
        appStore.updateResult('serviceActionResult', '错误: ' + error.message, 'error')
      }
    },

    async verifyOwnership() {
      try {
        const result = await contractService.verifyOwnership(this.state.verifyForm.productId)

        let html = '<div class="info">'
        html += '<strong>验证结果:</strong><br>'
        html += '您是所有者: ' + (result[0] ? '✅ 是' : '❌ 否') + '<br>'
        html += '产品真实: ' + (result[1] ? '✅ 是' : '❌ 否') + '<br>'
        html += '当前所有者: ' + result[2] + '<br>'
        html += '制造商: ' + result[3] + '<br>'
        html += '</div>'

        this.state.results.verifyResult = html
      } catch (error) {
        appStore.updateResult('verifyResult', '错误: ' + error.message, 'error')
      }
    },

    async getProductDetails() {
      try {
        const result = await contractService.getProductDetails(this.state.queryForm.productId)

        let html = '<div class="info">'
        html += '<strong>产品详情:</strong><br>'
        html += '序列号: ' + result[0] + '<br>'
        html += '型号: ' + result[1] + '<br>'
        html += '规格: ' + result[2] + '<br>'
        html += '制造商: ' + result[3] + '<br>'
        html += '当前所有者: ' + result[4] + '<br>'
        html +=
          '生产时间: ' + new Date(parseInt(result[5].toString()) * 1000).toLocaleString() + '<br>'

        // 保修信息
        const warranty = result[6]
        html += '<strong>保修信息:</strong><br>'
        html +=
          '开始日期: ' +
          new Date(parseInt(warranty.startDate.toString()) * 1000).toLocaleString() +
          '<br>'
        html += '持续时间: ' + parseInt(warranty.duration.toString()) / (24 * 60 * 60) + ' 天<br>'
        html += '最大申请次数: ' + warranty.maxClaims.toString() + '<br>'
        html += '已使用次数: ' + warranty.usedClaims.toString() + '<br>'
        html += '状态: ' + this.getWarrantyStatusText(warranty.status) + '<br>'
        html += '可见性: ' + (result[7] ? '✅ 可见' : '❌ 不可见') + '<br>'
        html += '</div>'

        this.state.results.detailsResult = html
      } catch (error) {
        appStore.updateResult('detailsResult', '错误: ' + error.message, 'error')
      }
    },

    async checkWarrantyStatus() {
      try {
        const result = await contractService.checkWarrantyStatus(
          this.state.warrantyCheckForm.productId,
        )

        let html = '<div class="info">'
        html += '<strong>保修状态:</strong><br>'
        html += '状态: ' + this.getWarrantyStatusText(result[0]) + '<br>'
        html += '剩余申请次数: ' + result[1].toString() + '<br>'
        html +=
          '过期时间: ' + new Date(parseInt(result[2].toString()) * 1000).toLocaleString() + '<br>'
        html += '</div>'

        this.state.results.warrantyResult = html
      } catch (error) {
        appStore.updateResult('warrantyResult', '错误: ' + error.message, 'error')
      }
    },

    async getOwnershipHistory() {
      try {
        const result = await contractService.getOwnershipHistory(this.state.historyForm.productId)

        let html = '<div class="info">'
        html += '<strong>所有权历史:</strong><br>'
        html += '<ul>'
        result.forEach((record, index) => {
          html += `<li>
            所有者: ${record.owner}<br>
            角色: ${this.getRoleText(record.role)}<br>
            转移时间: ${new Date(parseInt(record.transferTimestamp.toString()) * 1000).toLocaleString()}<br>
            交易详情: ${record.transactionDetails}<br>
            可见性: ${record.isVisible ? '✅ 是' : '❌ 否'}
          </li>`
        })
        html += '</ul>'
        html += '</div>'

        this.state.results.historyResult = html
      } catch (error) {
        appStore.updateResult('historyResult', '错误: ' + error.message, 'error')
      }
    },

    async getWarrantyHistory() {
      try {
        const result = await contractService.getWarrantyHistory(
          this.state.warrantyHistoryForm.productId,
        )

        let html = '<div class="info">'
        html += '<strong>保修历史:</strong><br>'
        if (result.length === 0) {
          html += '暂无保修记录<br>'
        } else {
          html += '<ul>'
          result.forEach((claim) => {
            html += `<li>
              申请ID: ${claim.claimId.toString()}<br>
              客户: ${claim.customer}<br>
              服务中心: ${claim.serviceCenter || '未处理'}<br>
              描述: ${claim.description}<br>
              服务说明: ${claim.serviceNotes || '未处理'}<br>
              提交时间: ${new Date(parseInt(claim.submitTimestamp.toString()) * 1000).toLocaleString()}<br>
              处理时间: ${claim.processTimestamp ? new Date(parseInt(claim.processTimestamp.toString()) * 1000).toLocaleString() : '未处理'}<br>
              状态: ${this.getClaimStatusText(claim.status)}<br>
              可见性: ${claim.isVisible ? '✅ 是' : '❌ 否'}<br>
            </li>`
          })
          html += '</ul>'
        }
        html += '</div>'

        this.state.results.warrantyHistoryResult = html
      } catch (error) {
        appStore.updateResult('warrantyHistoryResult', '错误: ' + error.message, 'error')
      }
    },

    getWarrantyStatusText(status) {
      const statusMap = {
        0: 'Active (激活)',
        1: 'Expired (过期)',
        2: 'Revoked (撤销)',
        3: 'ClaimLimitReached (达到申请上限)',
      }
      return statusMap[status] || 'Unknown'
    },

    getRoleText(role) {
      const roleMap = {
        0: 'None (无)',
        1: 'Manufacturer (制造商)',
        2: 'Retailer (零售商)',
        3: 'Customer (消费者)',
        4: 'ServiceCenter (服务中心)',
      }
      return roleMap[role] || 'Unknown'
    },

    getClaimStatusText(status) {
      const statusMap = {
        0: 'Pending (待处理)',
        1: 'Approved (已批准)',
        2: 'Rejected (已拒绝)',
        3: 'Completed (已完成)',
      }
      return statusMap[status] || 'Unknown'
    },
  },

  async mounted() {
    // 自动尝试连接钱包
    if (window.ethereum) {
      try {
        const result = await contractService.connectWallet()
        // 确保更新store中的web3和accounts
        this.state.web3 = result.web3
        this.state.accounts = result.accounts
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
