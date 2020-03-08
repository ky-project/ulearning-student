<template>
  <div class="experiment-content">
    <!-- <el-button type="info" size="mini" class="back" @click="back">{{ '<< 返回' }}</el-button> -->
    <div class="experiment-content-block">
      <span>题目内容</span>
      <el-button class="fr" type="text" @click="back">返回</el-button>
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
          <a v-if="experiment.experimentAttachmentName" href="#">
            {{ experiment.experimentAttachmentName }}
          </a>
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
    <tinymce v-model="experimentResult" :toolbar="toolbar" menubar="" :statusbar="false" />
    <div class="flex experiment-content-footer">
      <upload-attachment v-model="file" />
      <el-button type="primary" class="submit" :is-loading="isLoading" @click="submit">
        <svg-icon v-if="!isLoading" icon-class="tijiao" />
        <span>提交</span>
      </el-button>
    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { mapGetters } from 'vuex'
import UploadAttachment from '@/components/UploadAttachment'
import { SUBMIT_EXPERIMENT_RESULT } from '@/api/url.js'
import { axiosPost } from '@/utils/axios'
export default {
  name: 'ExperimentContent',

  components: { Tinymce, UploadAttachment },
  props: [''],
  data() {
    return {
      isLoading: false,
      toolbar: ['undo redo | fontselect fontsizeselect bold italic underline strikethrough | alignleft aligncenter alignright | bullist numlist indent outdent | image table link | hr emoticons'],
      attachment: '',
      experimentResult: '', // 实验内容
      file: '' // 附件
    }
  },

  computed: {
    ...mapGetters(['experiment'])
  },

  watch: {},

  beforeMount() {},

  mounted() {},

  methods: {
    // 提交事件
    submit() {
      const data = {
        experimentId: this.experiment.id,
        experimentResult: this.experimentResult,
        file: this.file
      }
      this.submitExperimentResult(data)
        .then(() => {
          this.$router.push('/experiment/experiment-list')
        })
    },
    // 提交实验结果
    submitExperimentResult(data) {
      return new Promise((resolve, reject) => {
        this.isLoading = true
        axiosPost(SUBMIT_EXPERIMENT_RESULT, data)
          .then(response => {
            this.$message.success('实验提交成功')
            this.isLoading = false
            resolve(response)
          })
          .catch(error => {
            this.$message.error(error.message || '出错')
            this.isLoading = false
            reject(error)
          })
      })
    },
    back() {
      this.$router.go(-1)
    }
  }

}

</script>
<style lang='scss' scoped>
.experiment-content {
  /* .back {
    padding: 5px;
    margin-left: 20px;
  } */
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
