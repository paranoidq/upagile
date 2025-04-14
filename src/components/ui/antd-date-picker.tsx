import { DatePicker, DatePickerProps } from 'antd'
import dayjs from 'dayjs'

type AntdDataPickerProps = DatePickerProps & {
  data: string | undefined
  onChange: (value: dayjs.Dayjs | null) => void
}

const AntdDataPicker = ({ format = 'YYYY-MM-DD', data, onChange, ...props }: AntdDataPickerProps) => {
  return (
    <DatePicker
      className='w-full py-1.5 hover:border-gray-300 shadow-sm'
      format={format}
      value={data ? dayjs(data) : null}
      onChange={(date) => {
        onChange?.(date)
      }}
      {...props}
    />
  )
}

export default AntdDataPicker
