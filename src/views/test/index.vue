<template>
  <div>
    <QuestionCard :data="data" :active-name.sync="activeName" :question-id.sync="questionId" />
  </div>
</template>

<script>
import QuestionCard from '@/views/exam/components/QuestionCard'
export default {
  name: 'Test',

  components: { QuestionCard },
  props: [''],
  data() {
    return {
      /*
      props:
      [
        {
          tabLabel: '选择',
          tabValue: 0,
          questionIdList: [12, 33, 45, 67]
        }
      ]
      state:
      currentTabValue
      currentQuestionId
      */
      data: [
        {
          label: '单选',
          name: '0',
          ids: [1, 2, 3, 4, 5, 6, 7, 8]
        },
        {
          label: '多选',
          name: '1',
          ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        },
        {
          label: '判选',
          name: '2',
          ids: [1, 2, 3, 4]
        },
        {
          label: '填空',
          name: '3',
          ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        }
      ],
      activeName: '1',
      questionId: 2
    }
  },

  computed: {},

  watch: {},

  created() {
    this.currentName = this.data[0].name
  },
  beforeMount() {},

  mounted() {},

  methods: {}

}

</script>
<style lang='' scoped>

</style>
