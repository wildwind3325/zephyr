<template>
  <div style="display: flex;">
    <div style="width: 200px;">
      <div style="height: 40px; display: flex; align-items: center;">
        <el-button-group>
          <el-button type="success" icon="Plus" @click="addGroup" />
          <el-button type="warning" icon="Edit" @click="editGroup" />
          <el-button type="danger" icon="Delete" @click="removeGroup" />
        </el-button-group>
      </div>
      <div style="height: 10px;"></div>
      <el-scrollbar style="height: calc(100vh - 150px);">
        <el-table ref="groupTableRef" highlight-current-row :data="groups" @current-change="selectGroup">
          <el-table-column prop="label" :label="$t('system.configuration.group')" />
        </el-table>
      </el-scrollbar>
    </div>
    <div style="width: 12px;"></div>
    <div style="flex-grow: 1;">
      <div class="toolbar">
        <div class="toolbar-function">
          <el-button type="success" icon="Plus" @click="add">{{ $t('system.view.new') }}</el-button>
        </div>
        <div class="toolbar-search">
          <el-input v-model="keyword" prefix-icon="Search" clearable :placeholder="$t('system.view.keywordHint')"
            style="width: 250px;" />
          <el-button type="primary" style="margin-left: 12px;" @click="query">{{ $t('system.view.search') }}</el-button>
        </div>
      </div>
      <div style="height: 10px;"></div>
      <el-scrollbar style="height: calc(100vh - 150px);">
        <el-table :data="list">
          <el-table-column prop="label" :label="$t('system.view.name')" width="120" />
          <el-table-column prop="code" :label="$t('system.view.code')" width="180" />
          <el-table-column prop="value" :label="$t('system.view.value')" />
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
        <el-dialog v-model="showDialog" :title="$t('system.configuration.title')">
          <el-form :model="form" :label-width="80">
            <el-form-item :label="$t('system.configuration.group')">
              <el-select v-model="form.group_id" :disabled="form.id > 0">
                <el-option v-for="(item, index) in groups" :key="item.id" :label="item.label" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('system.view.name')">
              <el-input v-model="form.label" />
            </el-form-item>
            <el-form-item :label="$t('system.view.code')">
              <el-input v-model="form.code" />
            </el-form-item>
            <el-form-item :label="$t('system.view.value')">
              <el-input v-model="form.value" />
            </el-form-item>
            <el-form-item :label="$t('system.view.memo')">
              <el-input v-model="form.memo" />
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button @click="showDialog = false">{{ $t('system.view.cancel') }}</el-button>
            <el-button type="primary" @click="save">{{ $t('system.view.save') }}</el-button>
          </template>
        </el-dialog>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { listGroup, addGroup, editGroup, removeGroup, list, add, edit, remove } from '../../api/system/configuration';
export default {
  name: 'Configuration',
  data() {
    return {
      groups: [],
      selectedItem: null,
      formGroup: {
        id: 0,
        label: ''
      },
      keyword: '',
      list: [],
      showDialog: false,
      form: {
        id: 0,
        group_id: 0,
        code: '',
        label: '',
        value: '',
        memo: ''
      },
      currentRow: null
    };
  },
  async mounted() {
    try {
      let res = await listGroup();
      if (res.data.code !== 0) {
        this.$message({
          type: 'error',
          message: this.$t('system.view.loadFailed', [this.$t(res.data.msg)])
        });
      } else {
        this.groups = res.data.data;
        this.groups.unshift({
          id: 0,
          label: this.$t('system.view.all')
        });
        this.$nextTick(() => {
          this.$refs.groupTableRef.setCurrentRow(this.groups[0]);
        });
      }
    } catch (err) {
      this.$message({
        type: 'error',
        message: this.$t('system.view.loadFailed', [err.message])
      });
    }
  },
  methods: {
    selectGroup(currentRow, oldCurrentRow) {
      this.selectedItem = currentRow;
      if (currentRow) this.query();
    },
    addGroup() {
      this.formGroup = {
        id: 0,
        label: ''
      };
      this.saveGroup();
    },
    editGroup() {
      if (!this.selectedItem || this.selectedItem.id === 0) return;
      this.formGroup = {
        id: this.selectedItem.id,
        label: this.selectedItem.label
      };
      this.saveGroup();
    },
    removeGroup() {
      if (!this.selectedItem || this.selectedItem.id === 0) return;
      this.$confirm(this.$t('system.view.confirmRemove'))
        .then(async () => {
          try {
            let res = await removeGroup(this.selectedItem.id);
            if (res.data.code !== 0) {
              this.$message({
                type: 'error',
                message: this.$t('system.msg.actionFailed', [this.$t(res.data.msg)])
              });
            } else {
              this.groups.splice(this.groups.indexOf(this.selectedItem), 1);
              this.$nextTick(() => {
                this.$refs.groupTableRef.setCurrentRow(this.groups[0]);
              });
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
    saveGroup() {
      this.$prompt(this.$t('system.view.nameHint'), { inputValue: this.formGroup.label })
        .then(async ret => {
          if (!ret.value) {
            this.$message({
              type: 'warning',
              message: this.$t('system.view.incomplete')
            });
            return;
          }
          if (this.formGroup.label === ret.value) return;
          this.formGroup.label = ret.value;
          try {
            let res;
            if (this.formGroup.id === 0) {
              res = await addGroup(this.formGroup);
            } else {
              res = await editGroup(this.formGroup);
            }
            if (res.data.code !== 0) {
              this.$message({
                type: 'error',
                message: this.$t('system.msg.actionFailed', [this.$t(res.data.msg)])
              });
            } else {
              if (this.formGroup.id === 0) {
                this.groups.push(res.data.data);
              } else {
                this.selectedItem.label = this.formGroup.label;
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
    },
    async query() {
      try {
        let group_id = 0;
        if (this.selectedItem) group_id = this.selectedItem.id;
        let res = await list(group_id, this.keyword);
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
        group_id: this.selectedItem.id,
        code: '',
        label: '',
        value: '',
        memo: ''
      };
      this.showDialog = true;
    },
    edit(row) {
      this.form = {
        id: row.id,
        group_id: row.group_id,
        code: row.code,
        label: row.label,
        value: row.value,
        memo: row.memo
      };
      this.currentRow = row;
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
      if (this.form.group_id === 0) {
        this.$message({
          type: 'warning',
          message: this.$t('system.configuration.needGroup')
        });
        return;
      }
      if (!this.form.label || !this.form.code) {
        this.$message({
          type: 'warning',
          message: this.$t('system.view.incomplete')
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
          if (this.form.id === 0) {
            if (this.form.group_id === this.selectedItem.id) {
              this.list.push(res.data.data);
            }
          } else {
            this.currentRow.code = this.form.code;
            this.currentRow.label = this.form.label;
            this.currentRow.value = this.form.value;
            this.currentRow.memo = this.form.memo;
          }
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