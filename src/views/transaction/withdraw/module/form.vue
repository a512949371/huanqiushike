<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" title="提现记录" width="600px" style="max-height:80%;overflow: scroll-y">
    <el-form
      ref="form"
      :model="form"
      size="small"
      label-width="110px"
      label-position="left"
    >
      <el-form-item label="基本信息:"></el-form-item>
      <el-form-item label="状态:" class="item">
        <span v-show="form.status==0">提现失败</span>
        <span v-show="form.status==1">提现成功</span>
        <span v-show="form.status==2">审核中</span>
      </el-form-item>
      <el-form-item label="所属会员:" class="item">
        <span>{{form.userName}}</span>
      </el-form-item>
      <el-form-item label="真实姓名:" class="item">
        <span>{{form.realName}}</span>
      </el-form-item>
      <el-form-item label="银行开户行:" class="item">
        <span>{{form.bankName}}</span>
      </el-form-item>
      <el-form-item label="银行名称:" class="item">
        <span>{{form.bankName}}</span>
      </el-form-item>
      <el-form-item label="支付宝账号:" class="item">
        <span v-show="form.sign!=0">{{form.bankNo}}</span>
      </el-form-item>
      <el-form-item label="银行卡号:" class="item">
        <span v-show="form.sign==0">{{form.bankNo}}</span>
      </el-form-item>
      <el-form-item label="身份证号码:" class="item">
        <span >{{form.idCard}}</span>
      </el-form-item>
      <el-form-item label="提现金额:" class="item">
        <span>{{form.amount}}</span>
      </el-form-item>
      <el-form-item label="手续费:" class="item">
        <span>{{form.fee}}</span>
      </el-form-item>
      <el-form-item label="到账金额:" class="item">
        <span>{{form.price}}</span>
      </el-form-item>
      <el-form-item label="可用余额:" class="item">
        <span>{{form.balance}}</span>
      </el-form-item>
      <el-form-item label="申请时间:" class="item">
        <span>{{form.createTime}}</span>
      </el-form-item>
      <el-form-item label="操作:"></el-form-item>
      <el-form-item label="设置状态" prop="status" class="item" v-show="formStatus==2">
        <el-radio v-model="form.status" label="1">成功提现</el-radio>
        <el-radio v-model="form.status" label="0">提现失败</el-radio>
      </el-form-item>
      <el-form-item style="margin-top: -10px;" label="添加备注" prop="status" class="item">
        <el-input v-model="form.comment" style="width: 370px;" rows="5" type="textarea"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doEdit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { withdrawEdit } from "@/api/transaction";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "Form",
  components: { Treeselect },
  props: {
    sup_this: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      labelPosition: "right",
      dialog: false,
      loading: false,
      form: {
        id: "",
        status: "",
        comment: ""
      },
      formStatus:0,
      roleIds: [],
    };
  },
  methods: {
    cancel() {
      this.resetForm();
    },
    doEdit() {
      withdrawEdit(this.form)
        .then(res => {
          this.resetForm();
          this.$notify({
            title: "修改成功",
            type: "success",
            duration: 2500
          });
          this.loading = false;
          this.sup_this.initListData();
        })
        .catch(err => {
          this.loading = false;
          console.log(err.response.data.message);
        });
    },
    resetForm() {
      this.dialog = false;
      // this.$refs["form"].resetFields();
      this.roleIds = [];
      this.form = {
        id: "",
        status: "",
        comment: ""
      };
    }
    
  }
};
</script>

<style scoped>
.item{
  margin-left: 20px;
}
</style>
