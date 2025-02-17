import type { Action, Remote, TableType } from '@/types'
import type { SelectProps } from 'antd'
import Model from './model'

export interface IProps extends Remote.IProps, SelectProps {
	model: string
	accessSelect?: Action.AccessData
	accessAdd?: Action.AccessData
	selectMode?: TableType.SelectMode
	__namespace: string
}

export interface ICustom extends SelectProps {
	__name: string
	xProps?: Remote.XProps

	x: Model,
	accessSelect?: Action.AccessData
	accessAdd?: Action.AccessData
	selectMode?: TableType.SelectMode
	onSelect: () => void
	onAdd: () => void
	noAdd?: boolean
}