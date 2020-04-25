import defaultSettings from '@/settings'

const title = defaultSettings.title || 'U-Learning学生系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${title} - ${pageTitle}`
  }
  return `${title}`
}
