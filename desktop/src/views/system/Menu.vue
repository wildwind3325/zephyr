<template>
  <div class="toolbar">
    <div class="toolbar-function">
      <el-button type="success" @click="add">{{ $t('system.view.new') }}</el-button>
    </div>
    <div class="toolbar-search">
    </div>
  </div>
  <el-table row-key="id" :data="list">
    <el-table-column v-if="$i18n.locale === 'zh'" prop="label" :label="$t('system.view.name')" />
    <el-table-column v-if="$i18n.locale === 'en'" prop="label_en" :label="$t('system.view.name')" />
    <el-table-column prop="type" :label="$t('system.view.type')" width="120" align="center">
      <template #default="scope">
        {{ scope.row.type === 0 ? $t('system.menu.menu') : $t('system.menu.permission') }}
      </template>
    </el-table-column>
    <el-table-column prop="icon" :label="$t('system.menu.icon')" width="60" align="center">
      <template #default="scope">
        <el-icon :size="24">
          <component :is="scope.row.icon"></component>
        </el-icon>
      </template>
    </el-table-column>
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
          <el-button type="danger" icon="Delete" size="small" @click="remove(scope.row)" />
        </el-button-group>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="showDialog" :title="$t('system.menu.title')">
    <el-form :model="form" :label-width="80">
      <el-form-item :label="$t('system.menu.parent')">
        <el-tree-select v-model="form.parent_id" :data="list" clearable check-strictly default-expand-all value-key="id"
          :disabled="form.id > 0" />
      </el-form-item>
      <el-form-item :label="$t('system.menu.icon')">
        <el-popover :title="$t('system.menu.allIcons')" :width="600" trigger="click" v-model:visible="showIcons">
          <template #reference>
            <el-input v-model="form.icon" :prefix-icon="form.icon" />
          </template>
          <el-scrollbar height="200px">
            <el-icon v-for="(item, index) in icons" :key="index" :size="24" class="icon" @click="setIcon(item)">
              <component :is="item"></component>
            </el-icon>
          </el-scrollbar>
        </el-popover>
      </el-form-item>
      <el-form-item :label="$t('system.view.name')">
        <el-input v-model="form.label" />
      </el-form-item>
      <el-form-item :label="$t('system.view.nameEn')">
        <el-input v-model="form.label_en" />
      </el-form-item>
      <el-form-item :label="$t('system.view.type')">
        <el-select v-model="form.type">
          <el-option :label="$t('system.menu.menu')" :value="0" />
          <el-option :label="$t('system.menu.permission')" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('system.menu.route')" v-show="form.type === 0">
        <el-input v-model="form.route" />
      </el-form-item>
      <el-form-item :label="$t('system.view.code')" v-show="form.type === 1">
        <el-input v-model="form.code" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showDialog = false">{{ $t('system.view.cancel') }}</el-button>
      <el-button type="primary" @click="save">{{ $t('system.view.save') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { list, add, edit, remove } from '../../api/system/menu';
export default {
  name: 'SystemMenu',
  data() {
    return {
      keyword: '',
      list: [],
      showDialog: false,
      form: {
        id: 0,
        parent_id: 0,
        label: '',
        label_en: '',
        type: 0,
        route: '',
        icon: '',
        code: ''
      },
      showIcons: false,
      icons: []
    };
  },
  mounted() {
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      this.icons.push(key);
    }
    this.query();
  },
  methods: {
    setIcon(val) {
      this.form.icon = val;
      this.showIcons = false;
    },
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
        parent_id: row ? row.id : 0,
        label: '',
        label_en: '',
        type: 0,
        route: '',
        icon: '',
        code: ''
      };
      this.showDialog = true;
    },
    edit(row) {
      this.form = {
        id: row.id,
        parent_id: row.parent_id === 0 ? null : row.parent_id,
        label: row.label,
        label_en: row.label_en,
        type: row.type,
        route: row.route,
        icon: row.icon,
        code: row.code
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
      let form = JSON.parse(JSON.stringify(this.form));
      if (!form.parent_id) form.parent_id = 0;
      if (!form.label || !form.label_en) {
        this.$message({
          type: 'warning',
          message: this.$t('system.view.incomplete')
        });
        return;
      }
      if (form.type === 0) {
        form.code = '';
        if (!form.route) {
          this.$message({
            type: 'warning',
            message: this.$t('system.menu.menuNoRoute')
          });
          return;
        }
      } else {
        form.route = '';
        if (!form.code) {
          this.$message({
            type: 'warning',
            message: this.$t('system.menu.permissionNoCode')
          });
          return;
        }
      }
      if (form.id == form.parent_id && form.id !== 0) {
        this.$message({
          type: 'warning',
          message: this.$t('system.menu.parentBeSelf')
        });
        return;
      }
      try {
        let res;
        if (form.id === 0) {
          res = await add(form);
        } else {
          res = await edit(form);
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

<style scoped>
.icon {
  cursor: pointer;
  margin: 0px 5px 5px 0px;
}
</style>