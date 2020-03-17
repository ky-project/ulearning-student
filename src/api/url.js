// 系统认证接口
export const VCODE_URL = '/auth/vCode' // 获取验证码
export const LOGIN_URL = '/auth/login' // 登录
export const LOG_OUT_URL = '/auth/logout' // 登出
export const INFO_URL = '/auth/info' // 获取个人信息
export const UPLOAD_AVATAR_URL = '/auth/uploadPhoto' // 上传头像
export const UPDATE_PWD_URL = '/auth/updatePassword' // 修改密码
export const UPDATE_INFO_URL = '/auth/update/info' // 修改个人信息
// 学生选课管理
export const GET_SELECTED_COURSE_ARRAY_URL = '/student/studentTeachingTask/getTeachingTaskArray' // 查询所有已选教学任务数组
export const GET_SELECTED_COURSE_LIST = '/student/studentTeachingTask/pageSelectedList' // 分页查询已选的教学任务
export const GET_UNSELECTED_COURSE_LIST = '/student/studentTeachingTask/pageNotSelectedList' // 分页查询未选的教学任务
export const SELECT_COURSE = '/student/studentTeachingTask/select' // 选课
export const UNSELECT_COURSE = '/student/studentTeachingTask/cancelSelected' // 退选
// 文件资料管理
export const GET_DOCUMENT_ROOT_URL = '/student/courseDocumentation/getRootFolder' // 查询文件资料根节点
export const GET_DOCUMENT_LIST_URL = '/student/courseDocumentation/list' // 查询文件资料列表
export const DOWNLOAD_DOCUMENT_URL = '/student/courseDocumentation/download' // 下载文件资料
// 教学资料管理
export const GET_RESOURCE_ROOT_URL = '/student/courseResource/getRootFolder' // 查询教学资源根节点
export const GET_RESOURCE_LIST_URL = '/student/courseResource/list' // 查询教学资源列表
export const DOWNLOAD_RESOURCE_URL = '/student/courseResource/download' // 下载教学资源
// 试验管理
export const GET_EXPERIMENT_PAGE_URL = '/student/teachingTaskExperiment/pageExperimentList' // 分页查询实验
export const DOWNLOAD_EXPERIMENT_ATTACHMENT_URL = '/student/teachingTaskExperiment/downloadAttachment' // 下载附件
// 实验结果管理
export const SUBMIT_EXPERIMENT_RESULT = '/student/experimentResult/submitExperimentResult' // 提交实验结果
export const GET_EXPERIMENT_RESULT = '/student/experimentResult/getByExperimentId' // 根据id查询实验结果
// 通告管理
export const GET_NOTICE_PAGE_URL = '/student/teachingTaskNotice/pageList' // 分页查询通告
export const DOWNLOAD_NOTICE_URL = '/student/teachingTaskNotice/downloadAttachment' // 下载附件
// 测试管理
export const GET_EXAMLIST_URL = '/student/examinationTask/getExaminationTaskArr' // 根据教学任务id查询测试任务数组
export const GET_EXAM_URL = '/student/examinationTask/getById' // 根据id查询测试任务
// 学生测试管理
export const START_EXAM_URL = '/student/studentExaminationTask/startExaminationTask' // 开始测试
export const SAVE_EXAM_URL = '/student/studentExaminationTask/submitResult' // 保存/提交测试结果
