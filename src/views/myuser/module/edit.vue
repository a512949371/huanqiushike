<template>
  <div>
    <el-dialog
      :append-to-body="false"
      :visible.sync="dialog"
      title="会员信息"
      width="70%"
      style="max-height:80%;overflow: scroll-y"
    >
      <div>
        <div class="tit">基础信息</div>
        <div class="flex">
          <div class="left flex-box-bwteen pt10 pr10">
            <div class="desc">账号:</div>
            <div class="info">{{data.account.userName||''}}</div>
          </div>
          <div class="right flex-box-bwteen pl10">
            <div class="desc">姓名:</div>
            <div class="info">{{data.account.realName}}</div>
          </div>
        </div>
        <div class="flex">
          <div class="left flex-box-bwteen pt10 pr10">
            <div class="desc">身份证号:</div>
            <div class="info">{{data.account.idCard}}</div>
          </div>
          <div class="right flex-box-bwteen pl10">
            <div class="desc">注册时间:</div>
            <div class="info">{{ parseTime(data.account.createTime) }}</div>
          </div>
        </div>
        <div class="flex">
          <div class="left flex-box-bwteen pt10 pr10">
            <div class="desc">推荐人账号:</div>
            <div class="info">
              <span class="editname" @click="editname()">修改</span>
              {{data.parentName}}
            </div>
          </div>
          <div class="right flex-box-bwteen pl10">
            <div class="desc">提现账号:</div>
            <div class="info">
              <span class="editname" @click="examine">查看</span>
            </div>
          </div>
        </div>
      </div>
      <div class="pt20">
        <div class="tit">购买信息</div>
        <div class="flex">
          <div class="left flex-box-bwteen pt10 pr10">
            <div class="desc">总购买单数:</div>
            <div class="info">{{data.buyNum||0}}单</div>
          </div>
          <div class="right flex-box-bwteen pl10">
            <div class="desc">当前等级:</div>
            <div class="info">VIP{{data.level||0}}</div>
          </div>
        </div>
        <div class="flex">
          <div class="left flex-box-bwteen pt10 pr10">
            <div class="desc">直推人数:</div>
            <div class="info">{{data.ruidNum||0}}人</div>
          </div>
          <div class="right flex-box-bwteen pl10">
            <div class="desc">团队人数:</div>
            <div class="info">{{ data.teamNum||0 }}人</div>
          </div>
        </div>
      </div>
      <div class="pt20">
        <div class="tit">余额信息</div>
        <div class="flex">
          <div class="left flex-box-bwteen pt10 pr10">
            <div class="desc">充值总金额:</div>
            <div class="info">
              <span class="editname" @click="getmoney">充值</span>
              {{data.topUpAmount||0}}元
            </div>
          </div>
          <div class="right flex-box-bwteen pl10">
            <div class="desc">当前余额:</div>
            <div class="info">
              <span class="editname" @click="reducemoney">扣除</span>
              {{data.balance||0}}元
            </div>
          </div>
        </div>
        <div class="flex">
          <div class="left flex-box-bwteen pt10 pr10">
            <div class="desc">消费金额:</div>
            <div class="info">{{data.consumeAmount}}</div>
          </div>
          <div class="right flex-box-bwteen pl10">
            <div class="desc">公排奖励总额:</div>
            <div class="info">{{ data.publicAmount||0 }}元</div>
          </div>
        </div>
        <div class="flex">
          <div class="left flex-box-bwteen pt10 pr10">
            <div class="desc">分享总奖励:</div>
            <div class="info">{{data.shareAmount||0}}元</div>
          </div>
          <div class="right flex-box-bwteen pl10">
            <div class="desc">体恤总奖金:</div>
            <div class="info">{{data.compassionateAmount||0}}元</div>
          </div>
        </div>
        <div class="flex">
          <div class="left flex-box-bwteen pt10 pr10">
            <div class="desc">提现总额:</div>
            <div class="info">{{data.withdrawAmount||0}}元</div>
          </div>
          <div class="right flex-box-bwteen pl10">
            <div class="desc"></div>
            <div class="info"></div>
          </div>
        </div>
      </div>
      <div class="pt20">
        <div class="tit">子账号信息</div>
        <el-table v-loading="loading" :data="childdata" size="small" border style="width: 100%;">
          <el-table-column prop="accountNo" label="子账号"/>
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="关联位置">
            <template slot-scope="scope">
              <span>{{ scope.row.groupName+scope.row.position }}</span>
            </template>
          </el-table-column>
          <el-table-column label="子账号状态">
            <template slot-scope="scope">
              <span>{{scope.row.status}}</span>
              <!-- <span v-if="scope.row.status=='0'">正常</span>
              <span v-if="scope.row.status=='1'">出局</span>
              <span v-if="scope.row.status=='2'">晋级</span>
              <span v-if="scope.row.status=='3'">排位中</span> -->
            </template>
          </el-table-column>
          <el-table-column prop="groupEnum" label="出局位置"/>
          <el-table-column label="出局时间">
            <template slot-scope="scope">
              <span v-if="scope.row.status=='出局'">{{ parseTime(scope.row.effectiveTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="公排奖励"/>
          <el-table-column prop="createTime" label="操作">
            <template slot-scope="scope">
              <el-button 
                v-if="scope.row.status=='正常'"
                slot="reference"
                type="danger"
                size="mini"
                @click="editadd(scope.row.id)"
              >修改位置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <Child :data="onedata" :accid="data.account.id" ref="child"></Child>
      <Editname ref="editname" :accid="data.account.id"></Editname>
      <Banklist ref="banklist" :data="data.withdrawlist"></Banklist>
      <Getmoney ref="getmoney" :accid="data.account.id"></Getmoney>
      <Reducemoney ref="reducemoney" :accid="data.account.id"></Reducemoney>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { parseTime } from "@/utils/index";
import Child from "./editchild";
import Editname from "./editname";
import Banklist from "./banklist";
import Getmoney from "./getmoney";
import Reducemoney from "./reducemoney";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  inject: ["reload"],
  components: { Child, Editname, Banklist, Getmoney, Reducemoney },
  props: {
    roles: {
      type: Array,
      required: true
    },
    data: {
      type: Object,
      required: true
    },
    childdata: {
      type: Array
    },
    // index.vue 的this 可用于刷新数据
    sup_this: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      getdata: {},
      dialog: false,
      loading: false,
      isadd: false,
      onedata: {}
    };
  },
  created() {},
  methods: {
    parseTime,
    cancel() {
      this.dialog = false;
      //this.$emit('closealert',{dialog:false});
    },
    editadd(id) {
      const _this = this.$refs.child;
      this.childdata.forEach(item => {
        if (item.id == id) {
          this.onedata = item;
        }
      });
      _this.dialog = true;
    },
    editname() {
      const _this = this.$refs.editname;
      _this.dialog = true;
    },
    examine() {
      const _this = this.$refs.banklist;
      _this.dialog = true;
    },
    getmoney() {
      const _this = this.$refs.getmoney;
      _this.dialog = true;
    },
    reducemoney() {
      const _this = this.$refs.reducemoney;
      _this.dialog = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.tit {
  font-size: 16px;
  font-weight: bold;
  padding: 10px 0;
}
.editname {
  font-size: 14px;
  color: #0066a1;
  text-decoration: underline;
  cursor: pointer;
  padding-right: 10px;
}
.left,
.right {
  flex: 1;
  padding-top: 5px;
  padding-bottom: 5px;
}
.right {
  border-left: 1px solid #969696;
}
.desc {
  font-size: 14px;
  color: #545454;
}
.info {
  font-size: 14px;
  color: #545454;
}
</style>
 
