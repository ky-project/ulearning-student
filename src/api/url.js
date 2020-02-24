// 系统认证接口
export const VCODE_URL = '/auth/vCode' // 获取验证码
export const LOGIN_URL = '/auth/login' // 登录
export const LOG_OUT_URL = '/auth/logout' // 登出
export const INFO_URL = '/auth/info' // 获取个人信息
export const UPLOAD_AVATAR_URL = '/auth/uploadPhoto' // 上传头像
export const UPDATE_PWD_URL = '/auth/updatePassword' // 修改密码
export const UPDATE_INFO_URL = '/auth/update/info' // 修改个人信息
// 学生选课管理
export const GET_SELECTED_COURSE_LIST = '/student/studentTeachingTask/pageSelectedList' // 分页查询已选的教学任务
export const GET_UNSELECTED_COURSE_LIST = '/student/studentTeachingTask/pageNotSelectedList' // 分页查询未选的教学任务
export const SELECT_COURSE = '/student/studentTeachingTask/select' // 选课
export const UNSELECT_COURSE = '/student/studentTeachingTask/cancelSelected' // 退选
