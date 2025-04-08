import { useEffect, useRef } from 'react'
import { Button, Form, Input, Modal } from 'antd'
import { toast } from 'sonner'
import { checkTeamNameExisted, useCreateTeam } from '../_lib/services'

interface FormValues {
  name: string
  description?: string
}

interface CreateTeamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateTeamDialog({ open, onOpenChange, onSuccess }: CreateTeamDialogProps) {
  const { mutateAsync: createTeam, isPending: isCreating } = useCreateTeam()
  const [form] = Form.useForm<FormValues>()
  const nameInputRef = useRef<HTMLInputElement>(null)

  /* ------------------ add team ------------------ */
  const handleAddTeam = async (values: FormValues) => {
    toast.promise(createTeam(values), {
      loading: 'Creating workspace...',
      success: () => {
        onOpenChange(false)
        form.resetFields()
        onSuccess?.()
        return 'Workspace created'
      },
      error: (e) => {
        return {
          message: e.msg,
          description: e.reason,
        }
      },
    })
  }

  const handleCancel = () => {
    form.resetFields()
    onOpenChange(false)
  }

  // 在 dialog 打开时自动聚焦到 name 输入框
  useEffect(() => {
    if (open) {
      nameInputRef.current?.focus()
    }
  }, [open])

  return (
    <Modal title='创建Workspace' open={open} centered onCancel={handleCancel} footer={null} destroyOnClose>
      <Form
        form={form}
        layout='vertical'
        onFinish={handleAddTeam}
        validateTrigger={['onChange', 'onBlur']}
        initialValues={{ name: '', description: '' }}
        className='mt-4'
      >
        <Form.Item
          name='name'
          label='Workspace名称'
          validateDebounce={200}
          rules={[
            { required: true, message: '请输入Workspace名称' },
            { min: 2, message: '团队名称至少需要2个字符' },
            { max: 50, message: '团队名称不能超过50个字符' },
            {
              validator: async (_, value) => {
                if (!value) return Promise.resolve()

                const exists = await checkTeamNameExisted(value)
                if (exists) {
                  return Promise.reject(new Error('该Workspace名称已存在'))
                }
                return Promise.resolve()
              },
            },
          ]}
        >
          <Input autoFocus placeholder='输入团队名称' autoComplete='off' />
        </Form.Item>

        <Form.Item name='description' label='Workspace描述'>
          <Input.TextArea placeholder='输入Workspace描述（可选）' autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item>

        <div className='flex justify-end gap-2 mt-4'>
          <Button onClick={handleCancel}>取消</Button>
          <Button type='primary' htmlType='submit' disabled={isCreating} loading={isCreating}>
            创建
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
