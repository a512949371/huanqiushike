<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" title="会员信息" width="70%">
    <div>
      <div class="tit">基础信息</div>
      <div class="flex">
        <div class="left flex-bwteen pt10 pr10">
          <div class="desc">账号:</div>
          <div class="info"></div>
        </div>
        <div class="right pl10">
          <div class="desc">姓名:</div>
          <div class="info"></div>
        </div>
      </div>
      <div class="flex">
        <div class="left flex-bwteen pt10 pr10">
          <div class="desc">身份证号:</div>
          <div class="info"></div>
        </div>
        <div class="right pl10">
          <div class="desc">注册时间:</div>
          <div class="info"></div>
        </div>
      </div>
      <div class="flex">
        <div class="left flex-bwteen pt10 pr10">
          <div class="desc">推荐人账号:</div>
          <div class="info"></div>
        </div>
        <div class="right pl10">
          <div class="desc">查看提现账号:</div>
          <div class="info"></div>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { parseTime } from '@/utils/index'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'Form',
  props: {
    dataid: {
      type: Number,
      required: true,
    },
    isAdd: {
      type: Boolean,
      required: true
    },
    sup_this: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialog: false, loading: false,getdata:[]
    }
  },
  created(){
    console.log('isAdd',this.isAdd)
    if(this.isAdd){
      this.$store.dispatch('Getuserinfo',{ id:this.dataid }).then((res)=>{
        console.log('res',res)
        if(res){
          this.getdata=this.$store.state.myuser.infodata
          console.log('2',this.getdata)
        }
      })
    }
  },
  mounted(){
    console.log('3',this.dataid,this.getdata)
  },
  watch:{

  },
  methods: {
    parseTime,
    cancel() {
      this.dialog = false
    },
  }
}
</script>

<style scoped>
.tit{
  font-size: 16px;
  font-weight: bold;
  padding: 10px 0;
}
.left,.right{
  flex: 1;
  padding-top: 5px;
  padding-bottom: 5px;
}
.right{
  border-left: 1px solid #969696
}
.desc{
  font-size: 14px;
  color: #545454
}
.info{
  font-size: 14px;
  color: #545454
}
</style>
