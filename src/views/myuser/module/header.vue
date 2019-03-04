<template>
  <div class="head-container">
    <!-- 搜索 -->
    <el-input v-model="query.phone" clearable placeholder style="width: 240px">
      <template slot="prepend">账号:</template>
    </el-input>
    <!-- <el-input v-model="query.userName" clearable placeholder style="width: 300px">
      <template slot="prepend">推荐人账号:</template>
    </el-input>-->
    <el-select
      v-model="query.type"
      clearable
      placeholder="会员类型"
      class="filter-item"
      style="width: 130px;margin-bottom:5px"
      @change="toQuery"
    >
      <el-option
        v-for="item in queryTypeOptions"
        :key="item.key"
        :label="item.display_name"
        :value="item.key"
      />
    </el-select>
    <el-select
      v-model="query.status"
      clearable
      placeholder="会员状态"
      class="filter-item"
      style="width: 130px;margin-bottom:5px"
      @change="toQuery"
    >
      <el-option
        v-for="item in enabledTypeOptions"
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
      style="margin-top:4px"
    >搜索</el-button>
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
      downloadLoading: false,
      queryTypeOptions: [
        { key: "0", display_name: "普通会员" },
        { key: "9", display_name: "系统会员" }
      ],
      enabledTypeOptions: [
        { key: "0", display_name: "正常" },
        { key: "-1", display_name: "冻结" },
        { key: "1", display_name: "解冻" }
      ]
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
