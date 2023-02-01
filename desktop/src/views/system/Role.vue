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
  <el-drawer v-model="showDrawer" :title="$t('system.role.title')" size="60%">
    <el-form :label-width="80">
      <el-form-item :label="$t('system.view.name')">
        <el-input v-model="form.label" />
      </el-form-item>
      <el-form-item :label="$t('system.menu.permission')">
        <el-tree ref="roleTreeRef" :data="menus" node-key="id" show-checkbox check-strictly />
      </el-form-item>
    </el-form>
    <template #footer>
      <div>
        <el-button @click="showDrawer = false">{{ $t('system.view.cancel') }}</el-button>
        <el-button type="primary" @click="save">{{ $t('system.view.save') }}</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script>
import * as role from '../../api/system/role';
import { list } from '../../api/system/menu';
export default {
  name: 'Role',
  data() {
    return {
      list: [],
      showDrawer: false,
      form: {
        id: 0,
        label: '',
        menus: '[]'
      },
      currentRow: null,
      menus: []
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    async query() {
      try {
        let res = await list();
        if (res.data.code === 0) {
          this.menus = res.data.data;
        }
        res = await role.list();
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
        label: '',
        menus: '[]'
      };
      this.showDrawer = true;
      this.$nextTick(() => {
        this.$refs.roleTreeRef.setCheckedKeys([], false);
      });
    },
    edit(row) {
      this.form = {
        id: row.id,
        label: row.label,
        menus: row.menus
      };
      this.currentRow = row;
      this.showDrawer = true;
      this.$nextTick(() => {
        this.$refs.roleTreeRef.setCheckedKeys(JSON.parse(row.menus), false);
      });
    },
    remove(row, index) {
      this.$confirm(this.$t('system.view.confirmRemove'))
        .then(async () => {
          try {
            let res = await role.remove(row.id);
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
      if (!this.form.label) {
        this.$message({
          type: 'warning',
          message: this.$t('system.view.incomplete')
        });
        return;
      }
      try {
        let res;
        this.form.menus = JSON.stringify(this.$refs.roleTreeRef.getCheckedKeys(false));
        if (this.form.id === 0) {
          res = await role.add({
            id: this.form.id,
            label: this.form.label,
            menus: this.form.menus
          });
        } else {
          res = await role.edit({
            id: this.form.id,
            label: this.form.label,
            menus: this.form.menus
          });
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
            this.currentRow.label = this.form.label;
            this.currentRow.menus = this.form.menus;
          }
          this.currentRow = null;
          this.showDrawer = false;
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