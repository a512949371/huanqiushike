<template>
  <div class="head-container">
    <!-- 搜索 -->
    <span class="filter-item">选择起止时间：</span>
    <el-date-picker
      v-model="query.startTime"
      format="yyyy-MM-dd HH:mm:ss"
      value-format="yyyy-MM-dd HH:mm:ss"
      clearable
      style="width: 200px;"
      class="filter-item"
      :picker-options="startDatePicker"
      type="datetime"
      :placeholder="'选择开始时间'"
    ></el-date-picker>
    <el-date-picker
      v-model="query.endTime"
      format="yyyy-MM-dd HH:mm:ss"
      value-format="yyyy-MM-dd HH:mm:ss"
      clearable
      style="width: 200px;"
      class="filter-item"
      :picker-options="endDatePicker"
      type="datetime"
      :placeholder="'选择结束时间'"
    ></el-date-picker>

    <el-button
      class="filter-item"
      size="mini"
      type="primary"
      icon="el-icon-search"
      @click="toQuery"
    >搜索</el-button>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission"; // 权限判断函数
import { parseTime } from "@/utils/index";
// 查询条件
export default {
  components: {},
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
      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate(),
      downloadLoading: false
    };
  },
  methods: {
    checkPermission,
    // 去查询
    toQuery() {
      this.$parent.page = 0;
      this.$parent.initListData();
    },
    beginDate() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.query.endTime) {
            //如果结束时间不为空，则小于结束时间
            return new Date(self.query.endTime).getTime() < time.getTime();
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      };
    },
    processDate() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.query.startTime) {
            //如果开始时间不为空，则结束时间大于开始时间
            return new Date(self.query.startTime).getTime() > time.getTime();
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      };
    }
  }
};
</script>
<style scoped>
</style>
