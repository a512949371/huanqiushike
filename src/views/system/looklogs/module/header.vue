<template>
  <div class="head-container">
    <!-- 搜索 -->
    <div class="flex">
      <div class="flex-box-center">
        <span class="demotime">选择起止日期:</span>
        <el-date-picker
          v-model="query.createTime"
          align="right"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions1">
        </el-date-picker>
        <span class="demotime">至:</span>
        <el-date-picker
          v-model="query.endTime"
          align="right"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions1">
        </el-date-picker>
      </div>
      <div class="flex-box-center pl20">
        <span class="demotime" style="width:120px">操作名称:</span>
        <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="query.description"></el-input>
      </div>
      <div class="pl20">
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-search"
          @click="toQuery"
        >搜索</el-button>
      </div>
      
    </div>
    <!-- 新增 -->
    <!-- <div style="display: inline-block;margin: 0px 2px;">
      <el-button
        v-if="checkPermission(['ADMIN','USER_ALL','USER_CREATE'])"
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="$refs.form.dialog = true">新增</el-button>
      <eForm ref="form" :roles="roles" :is-add="true"/>
    </div>-->
    <!-- 导出 -->
    <!-- <el-button
      v-if="checkPermission(['ADMIN'])"
      :loading="downloadLoading"
      size="mini"
      class="filter-item"
      type="primary"
      icon="el-icon-download"
    @click="download">导出</el-button>-->
  </div>
</template>

<script>
import checkPermission from "@/utils/permission"; // 权限判断函数
import { parseTime } from "@/utils/index";
// 查询条件
export default {
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
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      }
    };
  },
  methods: {
    checkPermission,
    // 去查询
    toQuery() {
      this.$emit("childMethod");
    },
    // 导出
    download() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "ID",
          "用户名",
          "邮箱",
          "头像地址",
          "状态",
          "注册日期",
          "最后修改密码日期"
        ];
        const filterVal = [
          "id",
          "username",
          "email",
          "avatar",
          "enabled",
          "createTime",
          "lastPasswordResetTime"
        ];
        const data = this.formatJson(filterVal, this.$parent.data);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list"
        });
        this.downloadLoading = false;
      });
    },
    // 数据转换
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "createTime" || j === "lastPasswordResetTime") {
            return parseTime(v[j]);
          } else if (j === "enabled") {
            return parseTime(v[j]) ? "启用" : "禁用";
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.demotime {
  font-size: 16px;
  color: #545454;
  padding-right: 10px;
}
</style>

