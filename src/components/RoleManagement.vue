<template>
  <div class="tabcontent">
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
      <div id="serviceCenterResult" class="result" v-html="state.results.serviceCenterResult"></div>
    </div>
  </div>
</template>

<script>
import contractService from '../services/contractService.js'
import appStore from '../store/appStore.js'

export default {
  name: 'RoleManagement',
  data() {
    return { state: appStore.getState() }
  },
  methods: {
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
  },
}
</script>

<style scoped>
.section {
  margin-bottom: 20px;
}
</style>
