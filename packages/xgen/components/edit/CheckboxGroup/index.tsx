import { Checkbox } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { Item } from '@/components'

import styles from './index.less'
import Model, { ICheckboxOption } from './model'

import type { Component, Remote } from '@/types'
import { CheckboxGroupProps } from 'antd/lib/checkbox'

const { Group } = Checkbox

type IProps = typeof Group & Component.PropsEditComponent & {
	xProps?: Remote.XProps
}

export interface ICustom extends CheckboxGroupProps {
	options: Array<ICheckboxOption>
}

const Custom = window.$app.memo((props: ICustom) => {
	const { value: __value, ...rest_props } = props
	const [value, setValue] = useState<CheckboxGroupProps['value']>()

	const onChange: CheckboxGroupProps['onChange'] = (v) => {
		if (!props.onChange) return

		// @ts-ignore
		props.onChange(v)

		setValue(v)
	}

	useEffect(() => {
		if (!__value) {
			const itemValue = 
				rest_props.options?.filter(item => {
					if (typeof item === 'string' || typeof item === 'number') {
						return false
					} else {
						return item.selected
					}
				}).map(item => item.value)
			if (itemValue && itemValue.length) {
				onChange(itemValue)
			}
			return;
		}
		setValue(__value)
	}, [__value, rest_props.options])

	return (
		<Group {...rest_props} value={value} onChange={onChange}></Group>
	)
})

const Index = (props: IProps) => {
	const { __bind, __name, itemProps, xProps, ...rest_props } = props
	const [x] = useState(() => container.resolve(Model))

	useLayoutEffect(() => {
		x.remote.raw_props = props

		x.remote.init()
	}, [props])

	return (
		<Item className={styles._local} {...itemProps} {...{ __bind, __name }}>
			<Custom {...rest_props} options={x.options}></Custom>
		</Item>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
