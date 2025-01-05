<template>
  <div class="personal-wrapper">
    <div class="title">{{ title }}</div>
    <div class="router-warpper mt10">
      <div v-if="groupByRoute">
        <div
          v-for="{ name, meta: { title } } in list"
          :key="name"
          :uiid="`zd-menu-${name}`"
          :class="[name === currentName && 'active', 'name']"
          @click="handleClick(name)"
        >
          {{ title }}
        </div>
      </div>
      <div v-else>
        <div
          v-for="{ name, titleName } in routerList"
          :key="name"
          :class="[name === currentName && 'active', 'name']"
          @click="handleClick(name)"
        >
          {{ titleName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import superRouter from '@/router/superRouter'
import { find, cloneDeep } from 'lodash'
import { ACTIVE_NAMES } from '@/utils/constant'

export default {
  props: {
    routerList: {
      type: Array,
      required: true
    },

    groupByRoute: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      currentItem: null,
      currentName: '',
      title: ''
    }
  },

  computed: {
    list({currentItem}) {
      return currentItem?.children.filter(item => !item.hidden)
    }
  },

  watch: {
    $route: {
      handler($route) {
        const name = $route.name
        const data = this.getLastChildren(cloneDeep(superRouter), null)
        this.currentItem = find(data, { name })?.parent
        this.title = this.currentItem?.meta?.title
        this.currentName = ACTIVE_NAMES[name] || name
      },
      immediate:true
    }
  },

  methods: {
    getLastChildren(children, parent) {
      const tmpArr = []
      children.forEach((item) => {
        if (!item.children?.length) {
          item.parent = parent
          tmpArr.push(item)
        } else {
          const data = this.getLastChildren(item.children, item)
          tmpArr.push(...data)
        }
      })
      return tmpArr
    },

    handleClick(name) {
      this.currentName = name
      this.$router.push({ name })
    }
  }
}
</script>

<style lang="scss" scoped>
.personal-warpper {
  font-size: $text-small;
}

.title {
  color: $color-title;
}

.router-warpper {
  width: 200px;
  color: $color-content;
  border: 1px solid $color-background--extensive;
}

.name {
  padding-left: 48px;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  &:hover {
    color: $--color-primary;
  }
}

.active {
  background: $color-background--extensive;
}
</style>
