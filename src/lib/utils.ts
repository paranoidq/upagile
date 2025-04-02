import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | number | null | undefined, opts: Intl.DateTimeFormatOptions = {}) {
  // 如果日期为 null、undefined 或空字符串，直接返回空字符串
  if (date === null || date === undefined || date === '') {
    return ''
  }

  let dateObj: Date

  if (typeof date === 'string') {
    // 处理 yyyy-MM-dd 格式
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split('-').map(Number)
      // 注意：JavaScript 中月份是从 0 开始的，所以需要 month - 1
      dateObj = new Date(year, month - 1, day)
    }
    // 处理 yyyy-MM-dd HH:mm:ss 格式
    else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(date)) {
      const [datePart, timePart] = date.split(' ')
      const [year, month, day] = datePart.split('-').map(Number)
      const [hours, minutes, seconds] = timePart.split(':').map(Number)
      dateObj = new Date(year, month - 1, day, hours, minutes, seconds)
    } else {
      // 尝试正常解析其他格式的日期字符串
      dateObj = new Date(date)
    }
  } else {
    // 处理 Date 对象或时间戳
    dateObj = new Date(date)
  }

  // 检查日期是否有效，如果无效则返回空字符串
  if (isNaN(dateObj.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat('zh-CN', {
    month: opts.month ?? 'long',
    day: opts.day ?? 'numeric',
    year: opts.year ?? 'numeric',
    ...opts,
  }).format(dateObj)
}

export function toSentenceCase(str: string) {
  return str
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim()
}
