
import { Ref, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import type { Common } from '@/types'
import { local } from '@/../storex/dist';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { useMemoizedFn } from 'ahooks';
import { CheckOptionItem } from '..';
import { Button, Checkbox } from 'antd';
import { ReactSortable } from 'react-sortablejs';
import { DotsSixVertical } from 'phosphor-react';

export interface ColumnCheckbox {
    options: CheckOptionItem[]
    setOptions: (opts: CheckOptionItem[]) => void
    localKey: string
}

const Index = forwardRef((props: ColumnCheckbox, ref: Ref<any>) => {
	const { options, setOptions, localKey } = props
    const [value, setValue] = useState<CheckboxValueType[]>([])
    const sortKey = localKey + ':sort'

    const saveToLocal = () => {
      local[localKey] = value
      local[sortKey] = options.map(item => item.value)
    }
    useImperativeHandle(ref, () => ({
      saveToLocal: saveToLocal,
    }))


    useEffect(() => {
        let cachedColumns = options.map(item => item.value)
        if (local[localKey] && local[localKey].length) {
          cachedColumns = local[localKey]
        }
        setValue(cachedColumns);
    }, [localKey])

    const onChange = useMemoizedFn((opts: CheckboxValueType[]) => {
        if (opts && opts.length) {
            setValue(opts)
        }
    })

    const onSort = useMemoizedFn((newState: CheckOptionItem[]) => {
        setOptions(newState)
        if (value && value.length) {
          const vals = newState.filter(item => value.includes(item.value)).map(item => item.value)
          setValue(vals)
        }
    })

    return (<Checkbox.Group 
      value={value}
      onChange={onChange}>
        <ReactSortable list={options} handle='.handle' animation={150} setList={(v) => onSort(v)}>
          {options.map((item) => (
            <div className='w_100 flex align_center space_between' key={item.id}>
              <Checkbox className="flex" value={item.value} disabled={item.disabled}>{item.label}</Checkbox>
              <Button className='handle btn_action flex justify_center align_center clickable'>
                <DotsSixVertical size={24} weight='bold'></DotsSixVertical>
              </Button>
            </div>
          ))}
        </ReactSortable>
    </Checkbox.Group>)
})

export default window.$app.memo(Index)