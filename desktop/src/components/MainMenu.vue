<template>
  <el-menu-item v-if="!node.children || node.children.length === 0" :index="node.route">
    <el-icon>
      <component :is="node.icon"></component>
    </el-icon>
    <span>{{ $i18n.locale === 'zh' ? node.label : node.label_en }}</span>
  </el-menu-item>
  <el-sub-menu v-else :index="node.route">
    <template #title>
      <el-icon>
        <component :is="node.icon"></component>
      </el-icon>
      <span>{{ $i18n.locale === 'zh' ? node.label : node.label_en }}</span>
    </template>
    <MainMenu v-for="(item, index) in node.children" :key="item.route" :node="item"></MainMenu>
  </el-sub-menu>
</template>

<script>
export default {
  name: 'MainMenu',
  props: {
    node: Object
  }
}
</script>