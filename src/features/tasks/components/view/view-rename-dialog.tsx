import { Form, Input, Modal } from 'antd'

type Props = {
  open: boolean
  id: stirng,
  name: string,
  onOpenChange: (open: boolean) => void
}

export const ViewRenameDialog = ({open, id, name, onOpenChange}: Props) => {
  const handleCancel = () => {
    form.resetFields()
    onOpenChange(false)
  }

  const handleOk = () => {
    form.resetFields()
    console.log(form.getFieldsValue())
    onOpenChange(false)
  }

  const [form] = Form.useForm()

  return (
    <Modal title='Rename view' open={open} onOk={handleOk} onCancel={handleCancel}>
      <Form form={form} layout='vertical' initialValues={{
        id: id,
        name: name
      }}>
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
