import { Form, Input, Modal } from 'antd'
import { useCreateView, useRenameView } from '@/features/tasks/services/view-services.tsx'

type Props = {
  open: boolean
  id?: number
  name: string
  type?: string
  onOpenChange: (open: boolean) => void
}

export const ViewDialog = ({ open, id, name, type, onOpenChange }: Props) => {
  const isCreate = !id
  const title = isCreate ? 'Create view' : 'Rename view'

  const handleCancel = () => {
    form.resetFields()
    onOpenChange(false)
  }

  const { mutate: createView, isPending: isCreating } = useCreateView()
  const { mutate: renameView, isPending: isRenaming } = useRenameView()

  const handleOk = () => {
    if (isCreate) {
      createView(form.getFieldsValue())
    } else {
      renameView(form.getFieldsValue())
    }

    onOpenChange(false)
    form.resetFields()
  }

  const [form] = Form.useForm()

  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isCreating || isRenaming }
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          id: id,
          name: name,
          type: type,
        }}
      >
        <Form.Item label='Id' name='id' hidden={true}>
          <Input />
        </Form.Item>
        <Form.Item label='Name' name='name'>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
