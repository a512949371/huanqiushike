<template>
  <div class="head-container" >
    <!-- 搜索 -->
    <span class="filter-item">账号：</span>
    <el-input v-model="query.userName" clearable placeholder="请输入用户账号" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
        <span class="filter-item">手机号：</span>
    <el-input v-model="query.phone" clearable placeholder="请输入用户手机号码" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
   
    <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
  
    
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import { parseTime } from '@/utils/index'
// 查询条件
export default {
  components: {  },
  props: {
    roles: {
      type: Array,
      required: true
    },
    query: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      downloadLoading: false,
    }
  },
  methods: {
    checkPermission,
    // 去查询
    toQuery() {
      this.$parent.page = 0;
      this.$parent.initListData();
    },
  }
}
</script>
<style scoped>

</style>
