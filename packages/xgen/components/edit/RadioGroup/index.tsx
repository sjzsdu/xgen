import { Radio } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { Item } from '@/components'

import styles from './index.less'
import Model from './model'

import type { Component } from '@/types'
import type { RadioGroupProps } from 'antd'
import { ICheckboxOption } from '../CheckboxGroup/model'
import { useForm } from '@/components/base/PureForm/form_context'

const { Group } = Radio

interface IProps extends RadioGroupProps, Component.PropsEditComponent {

}

interface ICustom extends RadioGroupProps {
	options: Array<ICheckboxOption>
	__bind: string
}

const Custom = window.$app.memo((props: ICustom) => {
	const { value: __value, __bind, ...rest_props } = props
	const [value, setValue] = useState<RadioGroupProps['value']>()

	const form = useForm()
	const onChange: RadioGroupProps['onChange'] = (v) => {
		if (!props.onChange) return

		// @ts-ignore
		props.onChange(v)

		setValue(v.target.value)
	}

	useEffect(() => {
		if (!__value) {
			const itemValue = 
				rest_props.options?.find(item => item.selected)?.value
			if (itemValue) {
				setValue(itemValue)
				form.setFieldsValue({ [__bind]: itemValue})
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
	const { __bind, __name, itemProps, ...rest_props } = props
	const [x] = useState(() => container.resolve(Model))

	useLayoutEffect(() => {
		x.remote.raw_props = props

		x.remote.init()
	}, [props])

	return (
		<Item className={styles._local} {...itemProps} {...{ __bind, __name }}>
			<Custom {...rest_props} options={x.options} __bind={__bind}></Custom>
		</Item>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
