<template>
  <div class="app-container">
    <eHeader :roles="roles" :query="query" v-on:childMethod="parentMethod"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="listdata.data" size="small" border style="width: 100%;">
      <el-table-column type="index" label="编号"/>
      <el-table-column prop="userName" label="账号"/>
      <el-table-column prop="realName" label="姓名"/>
      <el-table-column prop="parentName" label="推荐人账号"/>
      <el-table-column prop="createTime" label="注册时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="level" label="当前等级"/>
      <el-table-column prop="orderNum" label="总购买单数"/>
      <el-table-column prop="createTime" label="会员类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type==0?'普通会员':'系统会员' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="会员状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status=='0'">正常</span>
          <span v-if="scope.row.status=='-1'">冻结</span>
          <span v-if="scope.row.status=='1'">解冻</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <span class="desc" @click="to(scope.row.id)">会员详情</span>
          <el-popover
            v-if="checkPermission(['ADMIN','USER_ALL','USER_DELETE'])"
            :ref="scope.row.id"
            placement="top"
            width="180"
          >
            <p>确定改变该会员状态？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button
                :loading="delLoading"
                type="primary"
                size="mini"
                @click="subDelete(scope.row)"
              >确定</el-button>
            </div>
            <el-button
              v-if="scope.row.status==1||scope.row.status==0"
              slot="reference"
              type="danger"
              size="mini"
            >冻结</el-button>
            <el-button v-if="scope.row.status==-1" slot="reference" type="danger" size="mini">解冻</el-button>
          </el-popover>
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
    <edit
      v-if="isRouterAlive"
      ref="form"
      :childdata="childdata"
      :data="getdata"
      :roles="roles"
      :sup_this="sup_this"
    />
  </div>
</template>
<script>
import checkPermission from "@/utils/permission";
import { parseTime } from "@/utils/index";
import { updata } from "@/api/myuser";
import { getRoleTree } from "@/api/role";
import initData from "@/mixins/initData";
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
      this.$store.dispatch("Getuserinfo", { id: id }).then(res => {
        console.log("res", res);
        if (res) {
          let str = JSON.stringify(this.$store.state.myuser.infodata);
          str = str.replace(/null/g, '""');
          this.getdata = JSON.parse(str);
          console.log("2", this.getdata);
        }
      });
      this.$store.dispatch("Childlist", { id: id }).then(res => {
        console.log("res2", res);
        if (res) {
          let str = JSON.stringify(this.$store.state.myuser.childdata);
          str = str.replace(/null/g, '""');
          this.childdata = JSON.parse(str);
          console.log("3", this.childdata);
        }
      });
      _this.dialog = true;
    },
    beforeInit() {
      this.url = "api/account/selectList";
      const query = this.query;
      console.log("query", query);
      const type = query.type;
      const phone = query.phone;
      const status = query.status;
      this.params = {
        page: this.page,
        size: this.size,
        phone: phone,
        status: status,
        type: type,
      };
      return true;
    },
    subDelete(data) {
      let postdata = {
        id: data.id,
        status: 2
      };
      if (data.status == "0" || data.status == "1") {
        postdata.status = -1;
      } else {
        postdata.status = 1;
      }
      this.delLoading = true;
      updata(postdata)
        .then(res => {
          this.delLoading = false;
          this.$refs[data.id].doClose();
          this.init();
          this.$notify({
            title: "改变成功",
            type: "success",
            duration: 2500
          });
        })
        .catch(err => {
          this.delLoading = false;
          this.$refs[data.id].doClose();
          console.log(err.response.data.message);
        });
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
