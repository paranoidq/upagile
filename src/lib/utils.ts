import { type ClassValue, clsx } from 'clsx'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { twMerge } from 'tailwind-merge'

// 注册插件以支持自定义解析格式
dayjs.extend(customParseFormat)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | number | null | undefined, format: string = 'YYYY/MM/DD') {
  if (date === null || date === undefined || date === '') {
    return ''
  }

  let result

  if (typeof date === 'string') {
    // 处理 yyyy-MM-dd 格式
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      result = dayjs(date, 'YYYY-MM-DD')
    }
    // 处理 yyyy-MM-dd HH:mm:ss 格式
    else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(date)) {
      result = dayjs(date, 'YYYY-MM-DD HH:mm:ss')
    } else {
      result = dayjs(date)
    }
  } else {
    result = dayjs(date)
  }

  return result.isValid() ? result.format(format) : ''
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
