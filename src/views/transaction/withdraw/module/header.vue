<template>
  <div class="head-container">
    <!-- 搜索 -->
    <el-input
      v-model="query.phone"
      clearable
      placeholder="请输入用户账号或手机号码"
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
import eForm from "./form";
// 查询条件
export default {
  components: { eForm },
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
          "提现银行",
          "提现账号",
          "户名",
          "提现金额",
          "手续费",
          "到账金额",
          "申请日期",
          "执行日期",
          "状态"
        ];
        const filterVal = [
          "id",
          "userName",
          "bankName",
          "bankNo",
          "realName",
          "amount",
          "fee",
          "price",
          "createTime",
          "updateTime",
          "status"
        ];
        const data = this.formatJson(filterVal, this.$parent.listdata.data);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "withdraw-list"
        });
        this.downloadLoading = false;
      });
    },
    // 数据转换
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createTime' || j === 'updateTime') {
          return parseTime(v[j])
        } else if (j === 'status') {
          let status='';
          if(v[j]==0){
            status='提现失败';
          }else if(v[j]==1){
            status='提现成功';
          }else if(v[j]==2){
            status='审核中';
          }
          return status
        } else {
          return v[j]
        }
      }))
    },
    // 去查询
    toQuery() {
      this.$parent.page = 0;
      this.$parent.initListData();
    }
  }
};
</script>
