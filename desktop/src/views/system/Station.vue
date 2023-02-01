<template>
  <div class="toolbar">
    <div class="toolbar-function">
      <el-button type="success" icon="Plus" @click="add">{{ $t('system.view.new') }}</el-button>
    </div>
  </div>
  <el-table :data="list">
    <el-table-column prop="label" :label="$t('system.view.name')" />
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
</template>

<script>
import { list, add, edit, remove } from '../../api/system/station';
export default {
  name: 'Station',
  data() {
    return {
      list: [],
      form: {
        id: 0,
        label: ''
      }
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    async query() {
      try {
        let res = await list();
        if (res.data.code !== 0) {
          this.$message({
            type: 'error',
            message: this.$t('system.view.loadFailed', [this.$t(res.data.msg)])
          });
        } else {
          this.list = res.data.data;
        }
      } catch (err) {
        this.$message({
          type: 'error',
          message: this.$t('system.view.loadFailed', [err.message])
        });
      }
    },
    add() {
      this.form = {
        id: 0,
        label: ''
      };
      this.save();
    },
    edit(row) {
      this.form = {
        id: row.id,
        label: row.label
      };
      this.save(row);
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
    save(row) {
      this.$prompt(this.$t('system.view.nameHint'), { inputValue: this.form.label })
        .then(async ret => {
          if (!ret.value) {
            this.$message({
              type: 'warning',
              message: this.$t('system.view.incomplete')
            });
            return;
          }
          if (this.form.label === ret.value) return;
          this.form.label = ret.value;
          try {
            let res;
            if (this.form.id === 0) {
              res = await add(this.form);
            } else {
              res = await edit(this.form);
            }
            if (res.data.code !== 0) {
              this.$message({
                type: 'error',
                message: this.$t('system.msg.actionFailed', [this.$t(res.data.msg)])
              });
            } else {
              if (this.form.id === 0) {
                this.list.push(res.data.data);
              } else {
                row.label = this.form.label;
              }
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
    }
  }
}
</script>