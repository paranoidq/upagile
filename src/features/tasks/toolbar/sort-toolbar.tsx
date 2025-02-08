import { fieldOptions } from './types'

export function SortToolbar<TData>({ ... }) {
  // ... 其他代码保持不变

  return (
    // ... 其他 JSX 保持不变
    <FormField
      control={form.control}
      name={`field-${index}`}
      render={({ field }) => (
        <FormItem className='flex-1'>
          <Select value={field.value || ''} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder='选择字段' />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {fieldOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
    // ... 其他代码保持不变
  )
}