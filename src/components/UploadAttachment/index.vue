<template>
  <div class="upload-attachment flex">
    <upload-base v-show="!value" v-if="!disabled" ref="upload" @onLoaded="onLoaded">
      <el-button type="text" :disabled="disabledBtn">
        <svg-icon icon-class="biezhen" />
        添加附件（仅限一个）
      </el-button>
    </upload-base>
    <div v-if="value" class="file flex">
      <div class="msg flex">
        <svg-icon :icon-class="setFileIcon(getExt(value))" class-name="icon fl" />
        <div>
          <h4>{{ value.name }}</h4>
          <p>{{ setFileSize(value.size) }}</p>
        </div>
      </div>
      <span v-if="!disabled" class="del" @click="deleteHandle">删除</span>
    </div>
  </div>
</template>

<script>
import UploadBase from '@/components/UploadBase'
import { setFileIcon, setFileSize } from '@/utils/index'
export default {
  name: 'UploadAttachment',

  components: { UploadBase },
  props: {
    value: {
      type: [File, String, Object],
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    disabledBtn() {
      return !!this.value
    }
  },

  watch: {},

  beforeMount() {},

  mounted() {},

  methods: {
    deleteHandle() {
      this.$emit('input', '')
      this.$refs.upload.clear()
    },
    setFileIcon(ext) {
      return setFileIcon(ext)
    },
    setFileSize(size) {
      return setFileSize(size)
    },
    onLoaded(file) {
      this.$emit('input', file)
    },
    getExt(file) {
      if (file && file.name) {
        const tempArr = file.name.split('.')
        return tempArr[tempArr.length - 1]
      }
    }
  }

}

</script>
<style lang='scss' scoped>
.upload-attachment {
  .file {
    width: 160px;
    height: 40px;
    padding: 5px 5px;
    background-color: #e3eaf4;
    .msg {
      .icon {
        font-size: 30px;
        margin-right: 5px;
      }
      h4 {
        color: #666;
        width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      p {
        font-size: 12px;
        color: #b0b0b0;
      }
    }
    .del {
      color: #409EFF;
      font-size: 12px;
      cursor: pointer;
    }
  }
}
</style>
