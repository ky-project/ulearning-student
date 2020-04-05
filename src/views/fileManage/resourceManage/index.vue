<template>
  <div class="document-manage" @contextmenu.prevent="()=>{}">
    <!-- 操作栏 -->
    <div class="sub-nav">
      <file-nav :data="navList" :is-root="isRoot" @update="handleUpdate" @back="handleBack" />
      <div class="filter fr">
        <el-select
          :value="teachingTaskId"
          placeholder="教学任务"
          :style="{width: '200px', marginTop: '5px'}"
          class="filter-item"
          size="mini"
          @change="(teachingTaskId) => {$store.commit('user/SET_TEACHING_TASK_ID', teachingTaskId)}"
        >
          <el-option
            v-for="item in $store.getters.teachingTask"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
      </div>
    </div>
    <!-- 文件区-pc -->
    <el-table
      ref="table"
      v-desktop
      v-loading="loading"
      :data="documentList"
      tooltip-effect="dark"
      style="width: 100%"
      size="mini"
      class="file-zone"
      :height="tableHeight"
      @row-dblclick="enterFile"
    >
      <el-table-column
        label="文件名"
        min-width="200px"
      >
        <template slot-scope="scope">
          <svg-icon :icon-class="setFileIcon(scope.row.fileExt)" class-name="icon" />
          <span>{{ setFileName(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        min-width="150px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="大小"
        min-width="120px"
      >
        <template slot-scope="scope">
          <span>{{ setFileSize(scope.row.fileSize) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="50px"
      >
        <template slot-scope="scope">
          <svg-icon icon-class="xiazai" :class="{disabled: scope.row.fileType === 2}" @click="download(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 文件区手机 -->
    <div v-mobile v-loading="loading" class="file-zone-mobile">
      <el-scrollbar style="height:100%">
        <ul v-if="documentList.length" class="file-zone-mobile-list">
          <li
            v-for="item in documentList"
            :key="item.id"
            class="file-zone-mobile-list-item"
            @click="() => enterFile(item)"
          >
            <svg-icon :icon-class="setFileIcon(item.fileExt)" class="file-icon" />
            <h4 class="file-name">{{ setFileName(item) }}</h4>
            <div class="file-info">
              <span class="file-date">{{ formatTime(item.updateTime) }}</span>
              <span class="file-size">{{ setFileSize(item.fileSize) }}</span>
            </div>
            <div v-if="item.fileType !== 2" class="file-download" @click="download(item)">
              <svg-icon icon-class="xiazai" />
            </div>
          </li>
        </ul>
        <div v-else class="file-zone-mobile-empty">暂无资源</div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { getViewportOffset, setFileIcon, setFileSize } from '@/utils/index'
import {
  GET_SELECTED_COURSE_ARRAY_URL, // 查询所有已选教学任务数组
  GET_RESOURCE_ROOT_URL, // 查询文件资料根节点
  GET_RESOURCE_LIST_URL, // 查询文件资料列表
  DOWNLOAD_RESOURCE_URL // 下载文件
} from '@/api/url'
import FileNav from '@/views/fileManage/components/FileNav'
import { axiosGet } from '@/utils/axios'
export default {
  // 文件资料管理
  name: 'ResourceManage',
  components: { FileNav },
  data() {
    return {
      teachingTask: [],
      teachingTaskId: '', // 教学任务id
      loading: false,
      fileParentId: '', // 父文件id
      navList: [], // 导航列表
      documentList: [] // 文件列表
    }
  },
  computed: {
    isRoot() {
      return this.navList.length <= 1
    },
    isMobile() {
      return this.$store.device === 'mobile'
    },
    tableHeight() {
      const height = getViewportOffset().h
      if (this.isisMobile) {
        return height - 145
      } else {
        return height - 90
      }
    }
  },
  watch: {
    '$store.getters.teachingTaskId': {
      handler(value) {
        this.teachingTaskId = value
        if (this.fileParentId) {
          this.initialFileList()
        }
      },
      immediate: true
    }
  },
  created() {
    this.initialFileList()
  },

  beforeMount() {},

  mounted() {},

  methods: {
    // 格式化时间
    formatTime(time) {
      const tempArr = time.split(' ')
      return tempArr[0].slice(2)
    },
    // 获取教学任务数组
    getTaskArray() {
      return new Promise((resolve, reject) => {
        axiosGet(GET_SELECTED_COURSE_ARRAY_URL)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            this.$message.error(error.message || '出错')
            reject(error)
          })
      })
    },
    // 查询文件资料根节点
    getDocumentRoot(data) {
      return new Promise((resolve, reject) => {
        this.loading = true
        axiosGet(GET_RESOURCE_ROOT_URL, { params: data })
          .then(response => {
            this.loading = false
            resolve(response)
          })
          .catch(error => {
            this.$message.error(error.message || '出错')
            this.loading = false
            reject(error)
          })
      })
    },
    // 查询文件资料列表
    getDocumentList(data) {
      return new Promise((resolve, reject) => {
        const data = {
          fileParentId: this.fileParentId,
          teachingTaskId: this.teachingTaskId
        }
        this.loading = true
        axiosGet(GET_RESOURCE_LIST_URL, { params: data })
          .then(response => {
            this.documentList = response.data
            this.loading = false
            resolve(response)
          })
          .catch(error => {
            this.$message.error(error.message || '出错')
            this.loading = false
            reject(error)
          })
      })
    },
    // 初始化文件列表
    initialFileList() {
      // 获取根文件
      this.getDocumentRoot({ teachingTaskId: this.teachingTaskId })
        .then((response) => {
          const { fileId, fileName } = response.data
          this.fileParentId = fileId
          // 添加导航
          this.navList = []
          this.navList.push({ fileId, fileName })
          // 获取文件列表
          this.getDocumentList()
        })
    },
    // 设置文件图标
    setFileIcon(ext) {
      return setFileIcon(ext)
    },
    // 计算文件大小
    setFileSize(size) {
      return setFileSize(size)
    },
    // 下载
    download(row) {
      const { fileName, id, fileType, fileExt } = row
      if (fileType !== 2) {
        this.downloadFile(fileName + '.' + fileExt, id)
      }
    },
    // 下载文件
    downloadFile(fileName, id) {
      var a = document.createElement('a')
      a.download = fileName
      a.style.display = 'none'
      const fileurl = process.env.VUE_APP_BASE_API + DOWNLOAD_RESOURCE_URL + '?id=' + id
      a.href = fileurl
      document.body.appendChild(a)
      a.click() // 触发点击
      document.body.removeChild(a) // 然后移除
    },
    // 设置文件名
    setFileName(item) {
      let fileName = item.fileName
      if (item.fileExt) {
        fileName += '.' + item.fileExt
      }
      return fileName
    },
    // 导航回退事件
    handleBack() {
      if (this.navList.length > 1) {
        this.navList.pop()
        this.fileParentId = this.navList[this.navList.length - 1].fileId
        this.getDocumentList()
      }
    },
    // 导航点击事件
    handleUpdate(navList) {
      this.navList = navList
      this.fileParentId = this.navList[this.navList.length - 1].fileId
      this.getDocumentList()
    },
    // 监听行双击事件
    enterFile(row) {
      const { fileType, fileId, fileName } = row
      // 1. 判断是否是文件夹
      if (fileType === 2) {
        // 2. 是，进入文件夹
        this.fileParentId = fileId
        this.getDocumentList()
          .then(() => {
            // 3. 添加导航
            this.navList.push({ fileId, fileName })
          })
      }
    }
  }

}

</script>
<style lang='scss' scoped>
.document-manage {
  .operator-bar {
    width: 100%;
    height: 36px;
    padding: 3px 10px;
    // background-color: #DCDFE6;
    &__list-item {
      padding: 5px;
      border-radius: 3px;
      margin-right: 10px;
      box-sizing: border-box;
      .upload {
        display: inline-block;
      }
      span {
        font-size: 14px;
      }
      span.disabled {
        color: #ccc;
      }
      &:hover {
        color:#409EFF;
        // border: 1px solid #409EFF;
        cursor: pointer;
      }
    }
    .zone {
      padding: 8px 10px;
    }
    .disabled {
      color: #ccc;
    }
  }
  .sub-nav {
    height: 40px;
    padding: 0 10px;
    // background-color: #EBEEF5;
    border: 1px solid #ddd;
    overflow: hidden;
    ::v-deep .el-breadcrumb {
      margin-top: 13px;
      width: 70%;
      float: left;
    }
    ::v-deep .el-button {
      padding: 6px;
      margin-top: 5px;
    }
  }
  .file-zone {
    .disabled {
      color: #ccc;
    }
    .icon {
      font-size: 18px;
      margin-right: 5px;
    }
    .operator {
      display: none;
      .item-icon {
        margin-right: 10px;
        font-size: 16px;
        cursor: pointer;
        &:hover {
          color: #409EFF;
        }
      }
    }
    &::v-deep .el-table__row {
      &:hover {
        cursor: pointer;
        .operator {
          display: inline-block;
        }
      }
    }
  }
}
</style>
<style lang='scss' scoped>
.document-manage {
  .file-zone-mobile {
    height: calc(100vh - 145px);
    position: relative;
    &-empty {
      position: absolute;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
      color: #ccc;
      font-size: 16px;
    }
    &-list {
      &-item {
        position: relative;
        padding-left: 40px;
        padding-right: 40px;
        height: 40px;
        border-bottom: 1px solid #ccc;
        &:active {
          background: #ccc;
        }
        .file-icon {
          position: absolute;
          top: 50%;
          left: 5px;
          transform: translateY(-50%);
          font-size: 30px;
        }
        .file-name {
          // width: calc(100vw - 100px);
          padding-top: 5px;
          font-size: 14px;
          // text-overflow: ellipsis;
          // white-space:nowrap;
          // line-height: 23px;
        }
        .file-info {
          color: #666;
          font-size: 12px;
        }
        .file-download {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
}
</style>
