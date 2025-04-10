import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  name: z.string(),
  email: z.string().optional(),
  avatar: z.string().optional(),
})

export type UserType = z.infer<typeof userSchema>

export const teamSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  owner: z.object({
    id: z.string(),
    username: z.string(),
    name: z.string(),
    email: z.string().optional(),
    avatar: z.string().optional(),
  }),
  members: z.array(userSchema).optional(),
  createdTime: z.string().optional(),
  modifiedTime: z.string().optional(),
})

export type TeamType = z.infer<typeof teamSchema>

export const createTeamSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
})

export const updateTeamSchema = createTeamSchema.extend({
  id: z.string(),
})

export type CreateTeamType = z.infer<typeof createTeamSchema>

export type UpdateTeamType = z.infer<typeof updateTeamSchema>
