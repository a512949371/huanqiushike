<template>
  <div class="head-container">
    <!-- 搜索 -->
    <el-input v-model="query.accountNo" clearable placeholder="请输入查询账号" style="width: 240px">
      <template slot="prepend">账号:</template>
    </el-input>
    <el-input  v-model="query.position" clearable placeholder="请输入查询位置序号" style="width: 280px">
      <template slot="prepend">位置：{{groupName}}
      </template>
    </el-input>
    <el-select
      v-model="query.type"
      clearable
      placeholder="请选择账号类型"
      class="filter-item"
      style="width: 150px;margin-bottom:5px"
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
      placeholder="请选择当前状态"
      class="filter-item"
      style="width: 150px;margin-bottom:5px"
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
    >搜索</el-button>
    <!-- 新增 -->
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button
        v-if="isshowbtn"
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="$refs.form.dialog = true"
      >创建虚拟子账号</el-button>
      <Editname ref="form"/>
    </div>
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
import { parseTime } from "@/utils/index";
import Editname from "./editname";
// 查询条件
export default {
  name: "eHeader",
  components: { Editname },
  props: {
    query: {
      type: Object,
      required: true
    },
    isshowbtn: {
      type: Boolean,
      required: true
    },
    groupName:{
      type:String,
      required:false
    }
  },
  data() {
    return {
      downloadLoading: false,
      queryTypeOptions: [
        { key: "0", display_name: "真实子账号" },
        { key: "1", display_name: "后台创建虚拟账号" },
        { key: "2", display_name: "系统创建虚拟账号" }
      ],
      enabledTypeOptions: [
        { key: "0", display_name: "正常" },
        { key: "1", display_name: "出局" },
        { key: "2", display_name: "晋级" },
        { key: "3", display_name: "排位中" }
      ]
    };
  },
  methods: {
    // 去查询
    toQuery() {
      console.log(this.query)
      if(this.query.position){
        if(!isNaN(Number(this.query.position)) &&
          Number(this.query.position) > 0 &&
          this.query.position.toString().indexOf(".") == -1
          ){}else{
            this.$notify({
            title: "查询位置请输入一个正整数",
            type: "success",
            duration: 1500
          });
          return
          }
      }
      this.$emit("childMethod");
    }
  }
};
</script>
