<template>
  <div></div>
</template>
<script>
import { parseTime } from "@/utils/index";
import Editname from "./editname";
import Reducemoney from "./reducemoney";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  inject: ["reload"],
  components: { Editname, Reducemoney },
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
  created() {
    console.log("this", this.data);
  },
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
 
