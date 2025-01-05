<template>
  <div class="app-wrapper" :class="appWrapperClass">
    <LayoutHeader v-show="hasLayoutHeader" />
    <div class="app-main-content">
      <section class="app-content">
        <div class="left-sidebar" v-if="showSidebar">
          <component class="sidebar-container" :is="sidebarComponent" :sidebarType="sidebarType"></component>
        </div>

        <app-main />
      </section>
    </div>
    <WebNotice v-if="hasBottom" class="bg-white"></WebNotice>
  </div>
</template>

<script>
import { Sidebar, AppMain } from './components'
import LayoutHeader from './components/LayoutHeader/index'
import ResizeMixin from './mixin/ResizeHandler'
import WebNotice from '@/views/login/module/webNotice.vue'
import { SHOW_SIDEBAR, SHOW_PERSONAL, isShowSidebar } from '@/utils/constant'
import { mapGetters } from 'vuex'

export default {
  name: 'Layout',

  components: {
    AppMain,
    LayoutHeader,
    WebNotice
  },

  mixins: [ResizeMixin],

  props: {
    hasLayoutHeader: {
      type: Boolean,
      default: true
    },
    hasBottom: {
      type: Boolean,
      default: true
    },
    sidebarType: {
      type: [Number, String],
      default: 1
    },
    breadcrumbOption: {}
  },

  data() {
    return {}
  },

  computed: {
    ...mapGetters(['name', 'isAuth']),
    showSidebar({ sidebarType }) {
      return isShowSidebar(sidebarType)
    },
    sidebarComponent() {
      return {
        [SHOW_SIDEBAR]: Sidebar,
        [SHOW_PERSONAL]: Sidebar
      }[this.sidebarType]
    },
    appWrapperClass({ sidebarType }) {
      return {
        'sidebar-personal': sidebarType === SHOW_PERSONAL
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  width: 100%;
  min-width: $app-min-width;
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .app-main-content {
    flex: 1;
    display: flex;
    overflow-y: hidden;
  }
  .app-content {
    display: flex;
    width: 100%;
    margin: $app-content-top $app-content-right $app-content-bottom $app-content-left;
    background-color: $color-white;
    overflow: hidden;
    .left-sidebar {
      padding-left: $app-container-left;
    }
  }
  .left-sidebar {
    min-width: $app-sidebar-width;
    height: 100%;
    padding-top: $app-container-top;
    background: #fff;
    overflow-y: auto;
    overflow-x: hidden;
  }

  &.sidebar-personal {
    .app-main {
      padding-top: 26px;
    }
  }
}
</style>
