import { useEffect } from 'react'
import { Button, Form, Input, Space } from 'antd'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUpdateTeam } from '../_lib/services'
import { TeamType } from '../types'

export type WorkspaceEditFormProps = {
  selectedWorkspace: TeamType | undefined
}

const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
}

export function WorkspaceEditForm({ selectedWorkspace }: WorkspaceEditFormProps) {
  const [form] = Form.useForm<TeamType>()
  const { mutateAsync: updateTeam, isPending: isUpdatePending } = useUpdateTeam()

  const onSubmit = (values: TeamType) => {
    toast.promise(updateTeam(values), {
      loading: 'Updating workspace...',
      success: () => {
        return 'Workspace updated'
      },
      error: (e) => ({
        message: e.msg,
        description: e.reason,
      }),
    })
  }

  const onReset = () => {
    form.resetFields()
  }

  useEffect(() => {
    if (selectedWorkspace) {
      form.setFieldsValue(selectedWorkspace)
    }
  }, [selectedWorkspace])

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col gap-2'>
          <CardTitle>General</CardTitle>
          <CardDescription>Manage the basic information of the workspace</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Form
          form={form}
          {...formItemLayout}
          layout='vertical'
          initialValues={selectedWorkspace}
          onFinish={onSubmit}
          autoComplete='off'
        >
          <Form.Item name='id' label='ID' hidden>
            <Input />
          </Form.Item>

          <Form.Item name='name' label='Workspace Name'>
            <Input />
          </Form.Item>

          <Form.Item name='description' label='Workspace Description'>
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type='primary' htmlType='submit' loading={isUpdatePending}>
                Submit
              </Button>
              <Button type='default' htmlType='reset' onClick={onReset}>
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </CardContent>
    </Card>
  )
}
