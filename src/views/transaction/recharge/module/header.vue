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
    <!-- 导出 -->
    <el-button
      v-if="checkPermission(['ADMIN'])"
      :loading="downloadLoading"
      size="mini"
      class="filter-item"
      type="primary"
      icon="el-icon-download"
      @click="download"
    >导出</el-button>
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
        { key: 1, display_name: "小程序端充值" },
        { key: 0, display_name: "PC端余额" }
      ]
    };
  },
  methods: {
    checkPermission,
    // 导出
    download() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "ID",
          "会员账号",
          "充值前余额",
          "充值金额",
          "充值后余额",
          "充值类型",
          "后台充值账号",
          "充值日期",
          "备注"
        ];
        const filterVal = [
          "id",
          "account",
          "rechargeBefore",
          "rechargeAmount",
          "rechargeAfter",
          "type",
          "userName",
          "addTime",
          "remark"
        ];
        const data = this.formatJson(filterVal, this.$parent.listdata.data);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "recharge-list"
        });
        this.downloadLoading = false;
      });
    },
    // 数据转换
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "addTime") {
            return parseTime(v[j]);
          } else if (j === "type") {
            let status = "";
            if (v[j] == 0) {
              status = "PC端余额";
            } else if (v[j] == 1) {
              status = "小程序充值";
            }
            return status;
          } else if (j === "account") {
            return v[j].userName;
          } else {
            return v[j];
          }
        })
      );
    },
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
