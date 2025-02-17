import { Switch } from 'antd'

import { Item } from '@/components'
import type { SwitchProps } from 'antd'
import type { Component } from '@/types'
import { useEffect, useState } from 'react'

interface SwitchProp {
	checkedValue?: boolean | string
	unCheckedValue?: boolean | string
	value: SwitchProps['checked']
	onChange: (v: SwitchProps['checked']) => void
	__bind: string;
	[key: string]: any
}

interface IProps extends SwitchProps, Component.PropsEditComponent, SwitchProp {
	onChange: (v: SwitchProps['checked']) => void
}

const Custom = window.$app.memo((props: SwitchProps & SwitchProp) => {
	const { checkedValue, unCheckedValue, onChange,  ...rest_props } = props
	const [value, setValue] = useState<IProps['value']>()

	useEffect(() => {
		if (!props.__bind) {
			return;
		}
		setValue(props[props.__bind])
	}, [ props])

	const onSwitchChange: SwitchProps['onChange'] = (v) => {
		if (!onChange) return

		// @ts-ignore
		onChange(v ? checkedValue : unCheckedValue)
		
		setValue(v)
	}

	return <Switch checked={value == checkedValue} onChange={onSwitchChange}  {...rest_props}></Switch>
})

const Index = (props: IProps) => {
	const { __bind, __name, itemProps, ...rest_props } = props

	return (
		<Item {...itemProps} {...{ __bind, __name }} valuePropName={ __bind }>
			<Custom {...rest_props} __bind={__bind}></Custom>
		</Item>
	)
}

export default window.$app.memo(Index)
