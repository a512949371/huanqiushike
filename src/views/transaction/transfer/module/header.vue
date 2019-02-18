<template>
  <div class="head-container" >
    <!-- 搜索 -->
    <span class="filter-item">付款人：</span>
    <el-input v-model="query.phone1" clearable placeholder="请输入付款人账号或手机号码" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
   
    <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery(1)">搜索</el-button>
    <span class="filter-item" style="margin-left:40px">收款人：</span>
    <el-input v-model="query.phone2" clearable placeholder="请输入收款人账号或手机号码" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
   
    <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery(2)">搜索</el-button>
    
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
    toQuery(type) {
      this.$parent.query.type=type;
      this.$parent.page = 0;
      this.$parent.initListData();
    },
  }
}
</script>
<style scoped>

</style>
