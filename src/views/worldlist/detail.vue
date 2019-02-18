<template>
  <div class="app-container">
    <eHeader :query="query" v-on:childMethod="parentMethod"></eHeader>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="listdata.data" size="small" border style="width: 100%;">
      <el-table-column label="位置">
        <template slot-scope="scope">
          <span>{{ scope.row.groupName+scope.row.position }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="accountNo" label="子账号"/>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="accountNumber" label="所属账号"/>
      <el-table-column label="账号类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type=='0'">真实子账号</span>
          <span v-if="scope.row.type=='1'">虚拟子账号</span>
        </template>
      </el-table-column>
      <el-table-column label="出局时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.effectiveTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="groupEnum" label="出局位置"/>
      <el-table-column label="当前状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status=='NORMAL'">正常</span>
          <span v-if="scope.row.status=='OUT'">出局</span>
          <span v-if="scope.row.status=='ADVANCE'">晋级</span>
          <span v-if="scope.row.status=='RANKING'">排位中</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.type=='1'"
            slot="reference"
            type="primary"
            size="mini"
            @click="to(scope.row.id)"
          >关联子账号</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="listdata.count"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
    <Reducemoney ref="reducemoney" :accid="accid"></Reducemoney>
  </div>
</template>
<script>
import initData from "@/mixins/initData";
import { parseTime } from "@/utils/index";
import eHeader from "./module/header";
import Reducemoney from "./module/reducemoney";
const Detail = {
  components: { eHeader, Reducemoney },
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
      accid: 0
    };
  },
  created() {
    var that = this;
    this.$nextTick(() => {
      this.init().then(res => {
        console.log("then", res);
        that.listdata = res;
      });
    });
  },
  methods: {
    parseTime,
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    },
    to(id) {
      const _this = this.$refs.reducemoney;
      this.accid = Number(id);
      _this.dialog = true;
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
    beforeInit() {
      this.url = "api/accountRankConfig/selectsub";
      const query = this.query;
      console.log("query", this.$route.query);
      const accountNo = query.accountNo || "";
      const status = query.status || "";
      const type = query.type || "";
      const position = query.position || "";
      this.params = {
        page: this.page,
        size: this.size,
        groupName: this.$route.query.groupName,
        accountNo: accountNo,
        status: status,
        type: type,
        position: position
      };
      return true;
    }
  }
};
export default Detail;
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
