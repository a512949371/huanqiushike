<template>
  <div class="head-container">
    <!-- 搜索 -->
    <span class="filter-item">账号：</span>
    <el-input
      v-model="query.userName"
      clearable
      placeholder="请输入用户账号"
      style="width: 200px;"
      class="filter-item"
      @keyup.enter.native="toQuery"
    />
    <span class="filter-item">手机号：</span>
    <el-input
      v-model="query.phone"
      clearable
      placeholder="请输入用户手机号码"
      style="width: 200px;"
      class="filter-item"
      @keyup.enter.native="toQuery"
    />

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
      downloadLoading: false
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
          "会员昵称",
          "扣款前余额",
          "扣款金额",
          "扣款后余额",
          "后台扣款账号",
          "扣款时间",
          "备注"
        ];
        const filterVal = [
          "id",
          "account",
          "nickName",
          "rechargeBefore",
          "deductionsAmount",
          "rechargeAfter",
          "userName",
          "addTime",
          "remark"
        ];
        const data = this.formatJson(filterVal, this.$parent.listdata.data);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "withhold-list"
        });
        this.downloadLoading = false;
      });
    },
    // 数据转换
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          let deductions = v["deductions"];
          if (j === "nickName") {
            return v[j];
          } else if (j === "id") {
            return deductions.id;
          } else if (j === "account") {
            return deductions.account.userName;
          } else if (j === "rechargeBefore") {
            return deductions.rechargeBefore;
          } else if (j === "deductionsAmount") {
            return deductions.deductionsAmount;
          } else if (j === "rechargeAfter") {
            return deductions.rechargeAfter;
          } else if (j === "userName") {
            return deductions.userName;
          } else if (j === "addTime") {
            return parseTime(deductions.addTime);
          } else if (j === "remark") {
            return deductions.remark;
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
