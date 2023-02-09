<template>
  <div class="toolbar">
    <div class="toolbar-function">
      <div style="width: 370px; padding-right: 12px;">
        <el-date-picker v-model="period" type="daterange" range-separator="-" />
      </div>
      <el-button type="success" icon="Plus" @click="add">{{ $t('system.view.new') }}</el-button>
    </div>
    <div class="toolbar-search">
      <el-button type="primary" @click="query(1)">{{ $t('system.view.search') }}</el-button>
    </div>
  </div>
  <el-table :data="list">
    <el-table-column prop="id" label="序号" />
    <el-table-column prop="from" label="起始日期" width="250" />
    <el-table-column prop="to" label="截止日期" width="250" />
    <el-table-column prop="created_at" :label="$t('system.view.createdAt')" width="180" align="center">
      <template #default="scope">
        <span>{{ new Date(scope.row.created_at).format('yyyy-MM-dd HH:mm:ss') }}</span>
      </template>
    </el-table-column>
    <el-table-column :label="$t('system.view.command')" width="120" align="center">
      <template #default="scope">
        <el-button-group>
          <el-button type="warning" icon="Edit" size="small" @click="edit(scope.row)" />
          <el-button type="danger" icon="Delete" size="small" @click="remove(scope.row, scope.$index)" />
        </el-button-group>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination v-model:current-page="pageNumber" :page-size="8" background layout="->, prev, pager, next"
    :total="total" style="margin-top: 10px;" @current-change="query" />
  <el-dialog v-model="showDialog" title="报告内容" width="960" top="5vh">
    <v-md-editor v-model="text" height="300px"></v-md-editor>
    <template #footer>
      <el-button @click="showDialog = false">{{ $t('system.view.cancel') }}</el-button>
      <el-button type="primary" @click="save">{{ $t('system.view.save') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { list, add, edit, remove } from '../api/calendar';
export default {
  name: 'Calendar',
  data() {
    return {
      period: [],
      list: [],
      pageNumber: 1,
      total: 0,
      showDialog: false,
      currentRow: null,
      text: '',
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    async query(pageNumber) {
      try {
        let res = await list(pageNumber || this.pageNumber);
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
    async add() {
      if (!this.period[0] || !this.period[1]) {
        this.$message({
          type: 'warning',
          message: this.$t('system.view.incomplete')
        });
        return;
      }
      try {
        let res = await add({
          from: this.period[0].format('yyyy-MM-dd'),
          to: this.period[1].format('yyyy-MM-dd')
        });
        if (res.data.code !== 0) {
          this.$message({
            type: 'error',
            message: this.$t('system.msg.actionFailed', [this.$t(res.data.msg)])
          });
        } else {
          this.list.push(res.data.data);
          this.$message({
            type: 'success',
            message: this.$t('system.msg.actionSucceeded')
          });
        }
      } catch (err) {
        this.$message({
          type: 'error',
          message: this.$t('system.msg.actionFailed', [err.message])
        });
      }
    },
    edit(row) {
      this.currentRow = row;
      this.text = row.content;
      this.showDialog = true;
    },
    remove(row, index) {
      this.$confirm(this.$t('system.view.confirmRemove'))
        .then(async () => {
          try {
            let res = await remove(row.id);
            if (res.data.code !== 0) {
              this.$message({
                type: 'error',
                message: this.$t('system.msg.actionFailed', [this.$t(res.data.msg)])
              });
            } else {
              this.list.splice(index, 1);
              this.$message({
                type: 'success',
                message: this.$t('system.msg.actionSucceeded')
              });
            }
          } catch (err) {
            this.$message({
              type: 'error',
              message: this.$t('system.msg.actionFailed', [err.message])
            });
          }
        })
        .catch(() => { });
    },
    async save() {
      try {
        let res = await edit({
          id: this.currentRow.id,
          content: this.text
        });
        if (res.data.code !== 0) {
          this.$message({
            type: 'error',
            message: this.$t('system.msg.actionFailed', [this.$t(res.data.msg)])
          });
        } else {
          this.currentRow.content = this.text;
          this.currentRow = null;
          this.showDialog = false;
          this.$message({
            type: 'success',
            message: this.$t('system.msg.actionSucceeded')
          });
        }
      } catch (err) {
        this.$message({
          type: 'error',
          message: this.$t('system.msg.actionFailed', [err.message])
        });
      }
    }
  }
}
</script>