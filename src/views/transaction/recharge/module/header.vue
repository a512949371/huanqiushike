<template>
  <div class="head-container">
    <!-- 搜索 -->
    <span class="filter-item">搜索：</span>
    <el-input
      v-model="query.phone"
      clearable
      placeholder="请输入用户账号或手机号码"
      style="width: 200px;"
      class="filter-item"
      @keyup.enter.native="toQuery"
    />

    <el-select
      v-model="query.type"
      clearable
      placeholder="请选择充值类型"
      class="filter-item"
      style="width: 160px"
      @change="toQuery"
    >
      <el-option
        v-for="item in selectOptions"
        :key="item.key"
        :label="item.display_name"
        :value="item.key"
      />
    </el-select>

    <el-button
      class="filter-item"
      size="mini"
      type="primary"
      icon="el-icon-search"
      @click="toQuery"
    >搜索</el-button>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission"; // 权限判断函数
import { parseTime } from "@/utils/index";
// 查询条件
export default {
  components: {},
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
      selectOptions: [
        { key: "1", display_name: "小程序端充值" },
        { key: "0", display_name: "pc端充值" }
      ]
    };
  },
  methods: {
    checkPermission,
    // 去查询
    toQuery() {
      this.$parent.page = 0;
      this.$parent.initListData();
    }
  }
};
</script>
<style scoped>
</style>
