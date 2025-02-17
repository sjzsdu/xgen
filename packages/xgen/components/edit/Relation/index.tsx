import { Button, Select, Space, Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { Item } from '@/components'
import { getLocale } from '@umijs/max'
import Model from './model'

import type { IProps, ICustom } from './types'
import type { SelectProps } from 'antd'
import styles from './index.less'
import clsx from 'clsx'
import { NodeIndexOutlined, PlusOutlined } from '@ant-design/icons'
import { actionAllowed, useAction } from '@/actions'
import { GlobalModel } from '@/context/app'
import { toJS } from 'mobx'
import { If, When } from 'react-if'
import { useForm } from '@/components/base/PureForm/form_context'
import { useMemoizedFn } from 'ahooks'


const Custom = window.$app.memo((props: ICustom) => {
	const { __name, value: __value, onChange, x, disabled, onAdd, onSelect, accessSelect, accessAdd, selectMode = 'single', noAdd, ...rest_props } = props
    const form = useForm()
    const [g] = useState(() => container.resolve(GlobalModel))

    const selectAllowed= actionAllowed(accessSelect, toJS(g.user))
    const addAllowed = actionAllowed(accessAdd, toJS(g.user))

	const [value, setValue] = useState<SelectProps['value']>()
	const is_cn = getLocale() === 'zh-CN'

    const onChangeMemo: SelectProps['onChange'] = useMemoizedFn((v: string) => {
		if (!onChange) return
		// @ts-ignore
		props.onChange(v)

		setValue(v)
	})

    useLayoutEffect(() => {
        x.registerCallback((selects) => {
            const isMulti = selectMode === 'multiple'
            const options = x.selectOptions || [];
            console.log('qujdfff', selects, options);
            let val: any
            const keys = Object.keys(form?.getFieldsValue() || {});
            (toJS(selects) || []).forEach((item: Record<string, any>) => {
                if (isMulti) {
                    val = [...(val || []), item.id];
                } else {
                    val = item.id;
                    for(let o in item) {
                        // 如果存在父类的的关联关系，也一并填充
                        if (o.includes('_id') && keys.includes(o)) {
                            form.setFieldValue(o, item[o]);
                        }
                         // 如果存在子类的的关联关系，选择第一项进行填充
                        if (Array.isArray(item[o]) && item[o].length && typeof item[o][0] === 'object') {
                            const key = o.substring(0, o.length - 1) + '_id';
                            if (keys.includes(key)) {
                                form.setFieldValue(key, item[o][0].id);
                            }
                        }
                    }
                }
            })
            onChangeMemo(val, [])
        })  
    }, [selectMode])
    

    useEffect(() => {
		if (!__value) {
			return;
		} else {
            x.getOptions(__value)
            setValue(__value)
        }
	}, [props.selectMode, __value])

    return (
        <div className={clsx([styles._local, props.__type === 'edit' && styles.inedit, noAdd && styles.noadd])}>
            <Space>
                <Select
                    className={clsx([styles._local, styles.select, props.selectMode === 'multiple' && styles.multiple])}
                    popupClassName={styles._dropdown}
                    placeholder={`${is_cn ? '请选择' : 'Please select '}${__name}`}
                    getPopupContainer={(node) => node.parentNode}
                    value={value}
                    onChange={onChangeMemo}
                    disabled={disabled}
                    {...rest_props}
                ></Select>
                <Tooltip title="选择">
                    <Button type="primary" disabled={!selectAllowed || disabled} icon={<NodeIndexOutlined onClick={onSelect}/>} />
                </Tooltip>
                <When condition={!noAdd}>
                    <Tooltip title="新增">
                        <Button type="primary" disabled={!addAllowed  || disabled} icon={<PlusOutlined onClick={onAdd}/>} />
                    </Tooltip>
				</When>

            </Space>
        </div>
    )
})

const Index = (props: IProps) => {
	const { __bind, __name, __namespace, model, selectMode, itemProps, xProps, ...rest_props } = props
    const [x] = useState(() => container.resolve(Model))

    useLayoutEffect(() => {
        console.log('quququq', props)
		x.props = props
        x.init()
        return () => {
			x.off()
		}
	}, [props])

    const onAction = useAction();

    const onSelect = useMemoizedFn(() => {
        onAction({
            namespace: __namespace + `/Table-Modal-${model}`,
            primary: '',
            data_item: null,
            it: {
                title: '',
                icon: 'icon-external-link',
                props: {},
                action: [
                    { 
                        name: 'select',
                        type: 'Common.openModal', 
                        payload: { Table: { model, type: 'view', selectMode} }
                    }
                ]
            }
        })
    })

    const onAdd = useMemoizedFn(() => {
        onAction({
            namespace:  __namespace + `/Table-Modal-${model}`,
            primary: '',
            data_item: null,
            it: {
                title: '',
                icon: 'icon-external-link',
                props: {},
                action: [
                    { name: 'add', type: 'Common.openModal', payload: { Form: {model, type: 'edit', data: {}, initValue: {}} }}
                ]
            }
        })
    })

	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<Custom
				{...rest_props}
                x={x}
                onSelect={onSelect}
                onAdd={onAdd}
				__name={__name}
                options={x.selectOptions}
			></Custom>
		</Item>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
