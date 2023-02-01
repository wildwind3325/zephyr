<template>
  <el-table row-key="id" :data="list">
    <el-table-column prop="label" :label="$t('system.view.name')" />
    <el-table-column prop="created_at" :label="$t('system.view.createdAt')" width="180" align="center">
      <template #default="scope">
        <span>{{ new Date(scope.row.created_at).format('yyyy-MM-dd HH:mm:ss') }}</span>
      </template>
    </el-table-column>
    <el-table-column :label="$t('system.view.command')" width="180" align="center">
      <template #default="scope">
        <el-button-group>
          <el-button type="success" icon="Plus" size="small" @click="add(scope.row)" />
          <el-button type="warning" icon="Edit" size="small" @click="edit(scope.row)" />
          <el-button v-if="scope.row.parent_id > 0" type="danger" icon="Delete" size="small"
            @click="remove(scope.row)" />
        </el-button-group>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="showDialog" :title="$t('system.orgnization.title')">
    <el-form :model="form" :label-width="80">
      <el-form-item :label="$t('system.orgnization.parent')" v-if="form.parent_id > 0">
        <el-tree-select v-model="form.parent_id" :data="list" check-strictly default-expand-all value-key="id" />
      </el-form-item>
      <el-form-item :label="$t('system.view.name')">
        <el-input v-model="form.label" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showDialog = false">{{ $t('system.view.cancel') }}</el-button>
      <el-button type="primary" @click="save">{{ $t('system.view.save') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { list, add, edit, remove } from '../../api/system/orgnization';
export default {
  name: 'Orgnization',
  data() {
    return {
      keyword: '',
      list: [],
      showDialog: false,
      form: {
        id: 0,
        parent_id: 0,
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
    add(row) {
      this.form = {
        id: 0,
        parent_id: row.id,
        label: ''
      };
      this.showDialog = true;
    },
    edit(row) {
      this.form = {
        id: row.id,
        parent_id: row.parent_id,
        label: row.label
      };
      this.showDialog = true;
    },
    remove(row) {
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
              await this.query();
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
      if (!this.form.label) {
        this.$message({
          type: 'warning',
          message: this.$t('system.view.incomplete')
        });
        return;
      }
      if (this.form.id == this.form.parent_id) {
        this.$message({
          type: 'warning',
          message: this.$t('system.menu.parentBeSelf')
        });
        return;
      }
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
          await this.query();
          this.$message({
            type: 'success',
            message: this.$t('system.msg.actionSucceeded')
          });
          this.showDialog = false;
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