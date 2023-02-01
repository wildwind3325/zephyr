<template>
  <div class="toolbar">
    <div class="toolbar-function">
    </div>
    <div class="toolbar-search">
      <el-input v-model="module" clearable :placeholder="$t('system.log.module')" style="width: 180px;" />
      <el-select v-model="category" clearable :placeholder="$t('system.log.level')" style="margin-left: 12px;">
        <el-option :label="$t('system.log.debug')" value="DEBUG" />
        <el-option :label="$t('system.log.info')" value="INFO" />
        <el-option :label="$t('system.log.warn')" value="WARN" />
        <el-option :label="$t('system.log.error')" value="ERROR" />
      </el-select>
      <el-input v-model="keyword" clearable :placeholder="$t('system.view.keywordHint')"
        style="width: 180px; margin-left: 12px;" />
      <el-date-picker v-model="created_at" type="daterange" :placeholder="$t('system.view.createdAt')"
        style="margin-left: 12px;" />
      <el-button type="primary" style="margin-left: 12px;" @click="query(1)">{{ $t('system.view.search') }}</el-button>
    </div>
  </div>
  <el-table :data="list">
    <el-table-column prop="module" :label="$t('system.log.module')" width="180" />
    <el-table-column prop="category" :label="$t('system.log.level')" width="80" align="center">
      <template #default="scope">
        {{ getTitle(scope.row.category) }}
      </template>
    </el-table-column>
    <el-table-column prop="content" :label="$t('system.view.content')" />
    <el-table-column prop="created_at" :label="$t('system.view.createdAt')" width="180" align="center">
      <template #default="scope">
        <span>{{ new Date(scope.row.created_at).format('yyyy-MM-dd HH:mm:ss') }}</span>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination v-model:current-page="pageNumber" :page-size="8" background layout="->, prev, pager, next"
    :total="total" style="margin-top: 10px;" @current-change="query" />
</template>

<script>
import { list } from '../../api/system/log';
export default {
  name: 'Log',
  data() {
    return {
      module: '',
      category: '',
      keyword: '',
      created_at: [],
      list: [],
      pageNumber: 1,
      total: 0
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    async query(pageNumber) {
      try {
        let from = this.created_at && this.created_at.length > 0 ? this.created_at[0] : '';
        let to = this.created_at && this.created_at.length > 1 ? this.created_at[1] : '';
        let res = await list(this.module, this.category, this.keyword, from, to, pageNumber || this.pageNumber);
        if (res.data.code !== 0) {
          this.$message({
            type: 'error',
            message: this.$t('system.view.loadFailed', [this.$t(res.data.msg)])
          });
        } else {
          this.total = res.data.data.total;
          this.pageNumber = res.data.data.pageNumber;
          this.list = res.data.data.rows;
        }
      } catch (err) {
        this.$message({
          type: 'error',
          message: this.$t('system.view.loadFailed', [err.message])
        });
      }
    },
    getTitle(category) {
      switch (category) {
        case 'DEBUG':
          return this.$t('system.log.debug');
        case 'INFO':
          return this.$t('system.log.info');
        case 'WARN':
          return this.$t('system.log.warn');
        case 'ERROR':
          return this.$t('system.log.error');
        default:
          return '';
      }
    }
  }
}
</script>