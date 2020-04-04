<template>
  <div v-wh:h="device === 'mobile' ? 'calc(100vh - 105px)' : 'calc(100vh - 50px)'" class="experiment-content">
    <el-scrollbar style="height:100%">
      <!-- <el-button type="info" size="mini" class="back" @click="back">{{ '<< 返回' }}</el-button> -->
      <div class="experiment-content-block">
        <span>题目内容</span>
        <el-button v-desktop class="fr" type="text" @click="back">返回</el-button>
      </div>
      <div class="experiment-content-header">
        <h3 class="title">[实验{{ experiment.experimentOrder }}] {{ experiment.experimentTitle }}</h3>
        <div class="line task">
          <label>教学任务:</label>
          <span>{{ experiment.teachingTaskAlias }}</span>
        </div>
        <div class="line time">
          <label>时间:</label>
          <span>{{ experiment.updateTime }}</span>
        </div>
        <div class="line attachment">
          <label>附件:</label>
          <span>
            <el-button v-if="experiment.experimentAttachmentName" type="text" :style="{padding: 0}" @click="downloadAttachment">
              {{ experiment.experimentAttachmentName }}
            </el-button>
            <span v-else>无</span>
          </span>
        </div>
      </div>
      <tinymce
        :value="experiment.experimentContent"
        :toolbar="['']"
        menubar=""
        :readonly="1"
        :statusbar="false"
      />
      <div class="experiment-content-block">
        <span>作答区</span>
      </div>
      <tinymce
        :value="experimentResult.experimentResult"
        :toolbar="experimentMode === 'check' ? [''] : toolbar"
        :readonly="experimentMode === 'check' ? 1 : 0"
        menubar=""
        :statusbar="false"
        @input="(experimentResult) => {setExperimentResult({experimentResult})}"
      />
      <div class="flex justify-between experiment-content-footer">
        <upload-attachment
          :value="experimentResult.file"
          :disabled="experimentMode === 'check'"
          @input="(file) =>
          {setExperimentResult({file})}"
        />
        <el-button
          v-if="experimentMode !== 'check'"
          type="primary"
          class="submit"
          :loading="isLoading"
          @click="submit"
        >
          <svg-icon v-if="!isLoading" icon-class="tijiao" />
          <span>提交</span>
        </el-button>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import UploadAttachment from '@/components/UploadAttachment'
import { DOWNLOAD_EXPERIMENT_ATTACHMENT_URL } from '@/api/url.js'
export default {
  name: 'ExperimentContent',

  components: { Tinymce, UploadAttachment },
  props: [''],
  data() {
    return {
      isLoading: false,
      device: this.$store.getters.device,
      attachment: '' // 附件
    }
  },

  computed: {
    ...mapGetters(['experiment', 'experimentMode', 'experimentResult']),
    toolbar() {
      if (this.$store.getters.device === 'desktop') {
        return ['undo redo | fontselect fontsizeselect bold italic underline strikethrough | alignleft aligncenter alignright | bullist numlist indent outdent | image table link | hr emoticons']
      } else {
        return [' bold italic underline strikethrough | bullist numlist ']
      }
    }
  },

  watch: {},

  beforeMount() {},

  mounted() {},

  methods: {
    ...mapMutations({
      'setExperiment': 'experiment/SET_EXPERIMENT',
      'setExperimentResult': 'experiment/SET_EXPERIEMNT_RESULT'
    }),
    ...mapActions({ 'submitExperimentResult': 'experiment/submitExperimentResult' }),
    // 下载附件
    downloadAttachment() {
      const { experimentAttachmentName, id } = this.experiment
      var a = document.createElement('a')
      a.download = experimentAttachmentName
      a.style.display = 'none'
      const fileurl = process.env.VUE_APP_BASE_API + DOWNLOAD_EXPERIMENT_ATTACHMENT_URL + '?id=' + id
      a.href = fileurl
      document.body.appendChild(a)
      a.click() // 触发点击
      document.body.removeChild(a) // 然后移除
    },
    // 提交事件
    submit() {
      // 1. 检查
      if (!this.experimentResult.experimentResult && !this.experimentResult.file) {
        this.$message.warning('请填写实验结果或者提交附件')
        return false
      }
      this.isLoading = true
      this.submitExperimentResult()
        .then(() => {
          this.isLoading = false
          this.$router.push('/experiment/experiment-list')
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    back() {
      this.$router.go(-1)
    }
  }

}

</script>
<style lang='scss' scoped>
::v-deep .el-scrollbar__wrap {
    overflow-x: hidden;
  }
.experiment-content {
  /* .back {
    padding: 5px;
    margin-left: 20px;
  } */
  // height: 100px;
  .upload-attachment {
    flex-grow: 0;
  }
  &-block {
    line-height: 40px;
    font-size: 16px;
    color: #333;
    background-color: #f5f7fa;
    border-bottom: 1px solid #eee;
    padding-right: 10px;
    // background-color: #eee;
    &::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 30px;
      vertical-align: middle;
      background-color: #409EFF;
      margin-right: 16px;
    }
  }
  &-header {
    // margin-bottom: 10px;
    background-color: #f5f7fa;
    padding: 10px 20px;
    border-bottom: 1px solid #ccc;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      line-height: 23px;
    }
    .line {
      line-height: 20px;
      label {
        font-weight: normal;
        font-size: 14px;
        color: #666;
      }
      span {
        font-weight: normal;
        font-size: 14px;
      }
    }
  }
  &-footer {
    padding: 10px 20px;
    .submit {
      height: 40px;
    }
  }
}
</style>
