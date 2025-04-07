'use client'

import * as React from 'react'
import { useEffect } from 'react'
import { IconCube, IconFlagFilled } from '@tabler/icons-react'
import { PRIORITIES } from '@/consts/enums'
import { Button, DatePicker, Drawer, Form, Input, Select, Tag } from 'antd'
import dayjs from 'dayjs'
import { toast } from 'sonner'
import { useTeamStore } from '@/stores/teamStore'
import { cn } from '@/lib/utils'
import { Sheet } from '@/components/ui/sheet'
import { useUpdateIssue } from '../_lib/services'
import { Issue, issueStatus, issueType, UpdateIssueSchema } from '../types'

interface UpdateIssueSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  open: boolean
  onOpenChange: (open: boolean) => void
  issue: Issue | null
}

const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
}
export function UpdateIssueSheet({ issue, ...props }: UpdateIssueSheetProps) {
  const { mutateAsync: updateIssue, isPending: isUpdatePending } = useUpdateIssue()
  const { teams } = useTeamStore()

  const [form] = Form.useForm()

  const initialValues = {
    id: issue?.id,
    title: issue?.title,
    description: issue?.description,
    type: issue?.type,
    status: issue?.status,
    priority: issue?.priority,
    // 确保日期值是 dayjs 对象或 null
    startTime: issue?.startTime ? dayjs(issue.startTime) : null,
    deadline: issue?.deadline ? dayjs(issue.deadline) : null,
    teamId: issue?.team?.id,
  }

  useEffect(() => {
    if (issue) {
      form.resetFields()
    }
  }, [issue])

  function onSubmit(input: UpdateIssueSchema) {
    // 确保 title 有值
    const data = {
      ...input,
      title: input.title || issue?.title || '',
      startTime: input.startTime ? dayjs(input.startTime).format('YYYY-MM-DD') : undefined,
      deadline: input.deadline ? dayjs(input.deadline).format('YYYY-MM-DD') : undefined,
    }

    toast.promise(updateIssue(data), {
      loading: 'Updating issue...',
      success: () => {
        props.onOpenChange?.(false)
        return 'Issue updated'
      },
      error: (error) => {
        return {
          message: error.msg,
          description: error.reason,
        }
      },
    })
  }

  return (
    <Drawer title='Update Issue' open={props.open} onClose={() => props.onOpenChange?.(false)} keyboard={true}>
      <Form
        form={form}
        {...formItemLayout}
        layout='vertical'
        initialValues={initialValues}
        onFinish={onSubmit}
        autoComplete='off'
      >
        <Form.Item name='id' label='ID' hidden>
          <Input />
        </Form.Item>

        <Form.Item name='title' label='Title'>
          <Input />
        </Form.Item>

        <Form.Item name='description' label='Description'>
          <Input.TextArea />
        </Form.Item>

        <Form.Item name='type' label='Type'>
          <Select>
            {issueType.map((type) => (
              <Select.Option key={type.value} value={type.value}>
                <Tag className={cn('text-white font-semibold', type.color)}>{type.label}</Tag>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name='status' label='Status'>
          <Select>
            {issueStatus.map((status) => (
              <Select.Option key={status.value} value={status.value}>
                <Tag className={cn('text-white font-semibold', status.color)}>{status.label}</Tag>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name='priority' label='Priority'>
          <Select>
            {PRIORITIES.map((type) => (
              <Select.Option key={type.value} value={type.value}>
                <div className='flex items-center gap-2'>
                  <IconFlagFilled className={cn('size-4', type.color)} />
                  {type.label}
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name='startTime' label='Start Time'>
          <DatePicker
            className='w-full'
            format='YYYY-MM-DD'
            // 确保值是 dayjs 对象或 null
            onChange={(date) => {
              form.setFieldsValue({
                startTime: date ? date : null,
              })
            }}
          />
        </Form.Item>

        <Form.Item name='deadline' label='Deadline'>
          <DatePicker
            className='w-full'
            format='YYYY-MM-DD'
            // 确保值是 dayjs 对象或 null
            onChange={(date) => {
              form.setFieldsValue({
                deadline: date ? date : null,
              })
            }}
          />
        </Form.Item>

        <Form.Item name='teamId' label='Team'>
          <Select>
            {teams.map((team) => (
              <Select.Option key={team.id} value={team.id}>
                <div className='flex items-center gap-2'>
                  <IconCube className='size-4' />
                  {team.name}
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <div className='flex justify-end gap-2'>
            <Button type='default' onClick={() => props.onOpenChange?.(false)}>
              Cancel
            </Button>
            <Button type='primary' htmlType='submit' loading={isUpdatePending}>
              OK
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
