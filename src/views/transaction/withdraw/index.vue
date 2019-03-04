<template>
  <div class="app-container">
    <eHeader :roles="roles" :query="query"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="listdata.data" size="small" border style="width: 100%;">
      <el-table-column prop="id" label="序号"/>
      <el-table-column prop="userName" label="会员账号"/>
      <el-table-column prop="bankName" label="提现银行"/>
      <el-table-column prop="bankNo" label="银行卡号">
        <template slot-scope="scope">
          <span v-show="scope.row.sign==0">{{scope.row.bankNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bankNo" label="支付宝账号">
        <template slot-scope="scope">
          <span v-show="scope.row.sign!=0">{{scope.row.bankNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="realName" label="户名"/>
      <el-table-column prop="amount" label="提现金额"/>
      <el-table-column prop="fee" label="手续费"/>
      <el-table-column prop="price" label="到账金额"/>
      <el-table-column prop="createTime" label="申请日期"/>
      <el-table-column prop="updateTime" label="执行日期"/>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-show="scope.row.status==0">提现失败</span>
          <span v-show="scope.row.status==1">提现成功</span>
          <span v-show="scope.row.status==2">审核中</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <edit
            :data="scope.row"
            :roles="roles"
            :sup_this="sup_this"
          />
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
  </div>
</template>

<script>
import checkPermission from "@/utils/permission";
import initData from "@/mixins/initData";
import { getRoleTree } from "@/api/role";
import { parseTime } from "@/utils/index";
import eHeader from "./module/header";
import edit from "./module/edit";
export default {
  components: { eHeader, edit },
  mixins: [initData],
  data() {
    return {
      roles: [],
      sup_this: this,
      listdata: []
    };
  },
  created() {
    this.getRoles();
    this.initListData();
  },

  methods: {
    parseTime,
    checkPermission,
    initListData() {
      this.$nextTick(() => {
        this.init().then(res => {
          console.log("then", res);
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].status = res.data[i].status.toString();
          }
          this.listdata = res;
        });
      });
    },
    beforeInit() {
      this.url = "api/withdraw/getWithdrawLog";
      const sort = "id,desc";
      const query = this.query;
      const phone = query.phone;
      this.params = { page: this.page, size: this.size, phone: phone };
      console.log("params", query);
      return true;
    },
    getRoles() {
      getRoleTree().then(res => {
        this.roles = res;
      });
    }
  }
};
</script>

<style scoped>
</style>
