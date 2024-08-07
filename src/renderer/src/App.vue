<script setup lang="ts">
import { useRouter } from 'vue-router'
import Titlebar from './components/views/Titlebar.vue'
const router = useRouter()
router.push('/Login')
</script>

<template>
  <div class="common-layout">
    <el-row>
      <Titlebar />
    </el-row>
    <el-container>
      <el-container>
        <el-main>
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
