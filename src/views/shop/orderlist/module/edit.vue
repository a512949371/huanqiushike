<template>
  <div>
    <el-dialog
      :append-to-body="false"
      :visible.sync="dialog"
      title="会员信息"
      width="70%"
      style="max-height:80%;overflow: scroll-y"
    >
      <div ref="form">
        <div class="left flex-bwteen pt10">
          <div class="desc">订单编号:</div>
          <div class="info">{{data.orderNo}}</div>
        </div>
        <div class="left flex-bwteen pt10">
          <div class="desc">账号:</div>
          <div class="info">{{data.account}}</div>
        </div>
        <div class="left flex-bwteen pt10">
          <div class="desc">下单时间:</div>
          <div class="info" v-if="data.createTime">{{parseTime(data.createTime)}}</div>
        </div>
        <div class="left flex-bwteen pt10">
          <div class="desc">购买时间:</div>
          <div class="info" v-if="data.payTime">{{ parseTime(data.payTime) }}</div>
        </div>
        <div class="left flex-bwteen pt10">
          <div class="desc">购买商品:</div>
          <div class="info">{{data.productName}}</div>
        </div>
        <div class="left flex-bwteen pt10">
          <div class="desc">备注:</div>
          <div class="info">{{data.remark}}</div>
        </div>
        <div class="left flex-bwteen pt10">
          <div class="desc">数量:</div>
          <div class="info">{{data.productNum}}</div>
        </div>
        <div class="left flex-bwteen pt10">
          <div class="desc">单价:</div>
          <div class="info">{{data.singlePrice}}</div>
        </div>
        <div class="left flex-bwteen pt10">
          <div class="desc">总价:</div>
          <div class="info">{{data.totalPrice}}</div>
        </div>
        <div class="left flex-bwteen pt10">
          <div class="desc">支付方式:</div>
          <div class="info">{{data.payWay=='wx'?"微信支付":"积分支付"}}</div>
        </div>
        <div class="left flex-bwteen pt10">
          <div class="desc">支付状态:</div>
          <div class="info">
            <span v-if="data.payStatus=='0'" class="blue">未支付</span>
            <span v-if="data.payStatus=='1'" class="red">已支付</span>
          </div>
        </div>
        <div class="left flex-bwteen pt10">
          <div class="desc">提货方式:</div>
          <div class="info">
            <span v-if="data.takeMethod=='0'">自提</span>
            <span v-if="data.takeMethod=='1'">物流配送</span>
          </div>
        </div>
        <div class="left flex-bwteen pt10">
          <div class="desc">地址:</div>
          <div class="info">{{data.address}}</div>
        </div>
        <div class="left flex-bwteen pt10">
          <div class="desc">收件人:</div>
          <div class="info">{{data.addressee}}</div>
        </div>
        <div class="left flex-bwteen pt10">
          <div class="desc">快递公司:</div>
          <div class="info">
            <el-input v-model="courierCompany"></el-input>
          </div>
        </div>
        <div class="left flex-bwteen pt10">
          <div class="desc">快递单号:</div>
          <div class="info">
            <el-input v-model="courierNum"></el-input>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer flex-box-center">
        <el-button type="primary" :loading="loading" @click="truepost(data.id)">确认保存</el-button>
        <el-button type="info" @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { Notification, MessageBox } from "element-ui";
import { parseTime } from "@/utils/index";
import { orderlogistics } from "@/api/shop";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  props: {
    data: {
      type: Object,
      required: true
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
      onedata: {},
      courierCompany: "",
      courierNum: ""
    };
  },
  created() {},
  methods: {
    parseTime,
    cancel() {
      this.dialog = false;
      //this.$emit('closealert',{dialog:false});
    },
    truepost(id) {
      if (this.courierCompany != "" && this.courierNum != "") {
        let data = {
          courierCompany: this.courierCompany,
          courierNum: this.courierNum,
          id: id
        };
        orderlogistics(data)
          .then(res => {
            console.log("...", res);
            this.loading = false;
            this.$notify({
              title: res.data,
              type: "success",
              duration: 1500
            });
            this.dialog = false;
            console.log(this.su_this, this.$parent);
            this.$parent.init().then(res => {
              console.log("then", res);
              this.$parent.listdata = res;
            });
          })
          .catch(res => {
            console.log("err", res);
            this.loading = false;
          });
      } else {
        Notification.error({
          title: "快递公司或者单号不能为空"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.bule {
  color: forestgreen;
}
.red {
  color: #f00;
}
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
.left {
  display: flex;
}
.desc {
  font-size: 14px;
  width: 120px;
  color: #545454;
}
.info {
  font-size: 14px;
  color: #545454;
}
</style>
 
