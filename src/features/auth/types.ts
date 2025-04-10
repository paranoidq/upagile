import { z } from 'zod'

// 登录请求参数验证模式
export const loginRequestSchema = z.object({
  username: z.string().min(1, '用户名不能为空'),
  password: z.string().min(1, '密码不能为空'),
})

// 登录响应验证模式
export const accountSchema = z.object({
  id: z.string().optional(),
  username: z.string(),
  name: z.string(),
  avatar: z.string().optional(),
  email: z.string().optional(),
})

export const loginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  tokenType: z.string(),
  expiresIn: z.string(),
  account: accountSchema,
})

// 类型定义
export type LoginRequest = z.infer<typeof loginRequestSchema>
export type Account = z.infer<typeof accountSchema>
export type LoginResponse = z.infer<typeof loginResponseSchema>

// 用户认证状态
export type AuthState = {
  isAuthenticated: boolean
  accessToken: string | null
  refreshToken: string | null
  account: Account | null
}
