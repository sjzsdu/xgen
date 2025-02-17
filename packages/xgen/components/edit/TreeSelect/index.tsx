
import { TreeSelect, TreeSelectProps } from 'antd'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'
import { Item } from '@/components'
import { getLocale } from '@umijs/max'
import styles from './index.less'
import Model from './model'
import type { IProps } from './types'

const Index = (props: IProps) => {
	const { __bind, __name, value: __value, itemProps, xProps, ...rest_props } = props
	const is_cn = getLocale() === 'zh-CN';
	const [value, setValue] = useState<TreeSelectProps['value']>()
	const [x] = useState(() => container.resolve(Model))

	useEffect(() => {
		if (!__value) return

		setValue(__value)
	}, [props.multiple, __value])

	const onChange: TreeSelectProps['onChange'] = (v) => {
		if (!props.onChange) return

		// @ts-ignore
		props.onChange(v)

		setValue(v)
	}

	useLayoutEffect(() => {
		x.remote.raw_props = props

		x.remote.init()
	}, [props])

	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<TreeSelect
				showSearch
				className={clsx([styles._local, props.multiple && styles.multiple])}
				popupClassName={styles._dropdown}
				placeholder={`${is_cn ? '请选择' : 'Please select '}${__name}`}
				style={{ width: '100%' }}
				getPopupContainer={(node) => node.parentNode}
				value={value}
				dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
				onChange={onChange}
				treeData={x.options}
				{...rest_props}
			/>
		</Item>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
