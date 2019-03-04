<template>
  <div class="app-container">
    <eHeader :roles="roles" :query="query" v-on:childMethod="parentMethod"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="listdata.data" size="small" border style="width: 100%;">
      <el-table-column type="index" label="编号"/>
      <el-table-column prop="orderNo" label="订单编号"/>
      <el-table-column prop="account" label="账号"/>
      <el-table-column prop="productName" label="商品名称"/>
      <el-table-column label="商品属性">
        <template slot-scope="scope">
          <span v-if="scope.row.productModel==0">普通商品</span>
          <span v-if="scope.row.productModel==1">公排商品</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalPrice" label="总价"/>
      <el-table-column prop="productNum" label="数量"/>
      <el-table-column label="下单时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.orderTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提货方式">
        <template slot-scope="scope">
          <span>{{ scope.row.takeMethod==0?'自提':'物流配送' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式">
        <template slot-scope="scope">
          <span>{{ scope.row.payWay=="wx"?'微信支付':'积分支付' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付状态">
        <template slot-scope="scope">
          <span>{{ scope.row.payStatus==0?'未支付':'已支付' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态">
        <template slot-scope="scope">
          <span v-if="scope.row.state=='101'">未付款</span>
          <span v-if="scope.row.state=='201'">未发货</span>
          <span v-if="scope.row.state=='301'">已发货</span>
          <span v-if="scope.row.state=='401'">已完成</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <span class="desc" @click="to(scope.row.id)">查看</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="listdata.count"
      :current-page="page+1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
    <edit v-if="isRouterAlive" ref="form" :data="getdata" :sup_this="sup_this"/>
  </div>
</template>
<script>
import checkPermission from "@/utils/permission";
import { parseTime } from "@/utils/index";
import { getRoleTree } from "@/api/role";
import initData from "@/mixins/initData";
import { orderdetail } from "@/api/shop";
import eHeader from "./module/header";
import edit from "./module/edit";
const Index = {
  components: { eHeader, edit },
  mixins: [initData],
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      roles: [],
      delLoading: false,
      sup_this: this,
      listdata: [],
      dialog: false,
      getdata: {},
      childdata: [],
      isRouterAlive: true
    };
  },
  created() {
    var that = this;
    this.getRoles();
    this.$nextTick(() => {
      this.init().then(res => {
        console.log("then", res);
        that.listdata = res;
      });
    });
  },
  methods: {
    parseTime,
    checkPermission,
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    },
    parentMethod() {
      var that = this;
      this.page = 0;
      this.init().then(res => {
        console.log("then2", res);
        that.listdata = res;
        console.log(that.listdata);
      });
    },
    to(id) {
      const _this = this.$refs.form;
      orderdetail(id)
        .then(res => {
          console.log("ord", res);
          this.getdata = res.data;
          _this.courierCompany = res.data.courierCompany;
          _this.courierNum = res.data.courierNum;
        })
        .catch(res => {
          this.getdata = [];
        });
      _this.dialog = true;
    },
    beforeInit() {
      this.url = "api/orders";
      const query = this.query;
      console.log("query", query);
      const orderNo = query.orderNo;
      const payStatus = query.payStatus;
      const payWay = query.payWay;
      const state = query.state;
      const takeMethod = query.takeMethod;
      this.params = {
        page: this.page,
        size: this.size,
        orderNo: orderNo,
        payStatus: payStatus,
        payWay: payWay,
        state: state,
        takeMethod: takeMethod
      };
      return true;
    },
    getRoles() {
      getRoleTree().then(res => {
        this.roles = res;
      });
    }
  }
};
export default Index;
</script>
<style lang="scss" scoped>
.desc {
  font-size: 14px;
  color: #0066a1;
  text-decoration: underline;
  cursor: pointer;
  padding-right: 10px;
}
</style>
