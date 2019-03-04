<template>
  <div class="head-container flex-box-bwteen">
    <!-- 搜索 -->
    <div>
      <el-input v-model="query.orderNo" clearable placeholder="请输入订单编号或者账号" style="width: 300px">
        <template slot="prepend">查询:</template>
      </el-input>
      <el-select
        v-model="query.takeMethod"
        clearable
        placeholder="请选择提货方式"
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
        v-model="query.payWay"
        clearable
        placeholder="请选择支付方式"
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
      <el-select
        v-model="query.payStatus"
        clearable
        placeholder="请选择支付状态"
        class="filter-item"
        style="width: 130px;margin-bottom:5px"
        @change="toQuery"
      >
        <el-option
          v-for="item in payTypeOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="query.state"
        clearable
        placeholder="请选择订单状态"
        class="filter-item"
        style="width: 130px;margin-bottom:5px"
        @change="toQuery"
      >
        <el-option
          v-for="item in orderTypeOptions"
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
    <div>
      <el-button
        v-if="checkPermission(['ADMIN'])"
        :loading="downloadLoading"
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="download"
      >导出</el-button>
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="toadd"
      >添加订单</el-button>
    </div>
    <Add ref="add"></Add>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission"; // 权限判断函数
import { parseTime } from "@/utils/index";
import Add from "./add";
// 查询条件
export default {
  components: { Add },
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
        { key: "0", display_name: "自提" },
        { key: "1", display_name: "物流配送" }
      ],
      enabledTypeOptions: [
        { key: "wx", display_name: "微信支付" },
        { key: "jf", display_name: "积分支付" }
      ],
      payTypeOptions: [
        { key: "0", display_name: "未支付" },
        { key: "1", display_name: "已支付" }
      ],
      orderTypeOptions: [
        { key: "201", display_name: "未发货" },
        { key: "301", display_name: "已发货" }
      ]
    };
  },
  methods: {
    checkPermission,
    // 去查询
    toQuery() {
      this.$emit("childMethod");
    },
    //新增订单
    toadd() {
      var _this = this.$refs.add;
      _this.dialog = true;
    },
    // 导出
    download() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "订单编号",
          "账号",
          "商品名称",
          "商品属性",
          "总价",
          "数量",
          "下单时间",
          "提货方式",
          "支付方式",
          "支付状态",
          "订单状态"
        ];
        const filterVal = [
          "orderNo",
          "account",
          "productName",
          "productModel",
          "totalPrice",
          "productNum",
          "orderTime",
          "takeMethod",
          "payWay",
          "payStatus",
          "state"
        ];
        const data = this.formatJson(filterVal, this.$parent.listdata.data);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "订单列表"
        });
        this.downloadLoading = false;
      });
    },
    // 数据转换
    formatJson(filterVal, jsonData) {
      console.log("jsonData", jsonData);
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "orderTime") {
            return parseTime(v[j]);
          } else if (j === "productModel") {
            return v[j] == 0 ? "普通商品" : "公排商品";
          } else if (j === "takeMethod") {
            return v[j] == 0 ? "自提" : "物流配送";
          } else if (j === "payWay") {
            return v[j] == "wx" ? "微信支付" : "积分支付";
          } else if (j === "payStatus") {
            return v[j] == 0 ? "未支付" : "已支付";
          } else if (j === "state") {
            let txt = "";
            switch (v[j]) {
              case 101:
                txt = "未付款";
                break;
              case 201:
                txt = "未发货";
                break;
              case 301:
                txt = "已发货";
                break;
              case 401:
                txt = "已完成";
                break;
              default:
                txt = "";
                break;
            }
            return txt;
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>
