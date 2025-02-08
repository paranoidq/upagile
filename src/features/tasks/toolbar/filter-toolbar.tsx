import { fieldOptions, operatorOptions } from './types'

export function FilterToolbar<TData>({ ... }) {
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

    <FormField
      control={form.control}
      name={`operator-${index}`}
      render={({ field }) => (
        <FormItem className='flex-1'>
          <Select value={field.value || ''} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder='选择条件' />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {operatorOptions.map((option) => (
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