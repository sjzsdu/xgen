import { useMemoizedFn } from 'ahooks'
import { Table } from 'antd'
import { useLayoutEffect, useMemo } from 'react'

import { getLocale } from '@umijs/max'

import { useColumns } from './hooks'
import { Message } from './locales'

import type { TablePaginationConfig } from 'antd'
import type { IPropsPureTable } from './types'
import type { TableRowSelection } from 'antd/es/table/interface'
import { RowSelectionType } from 'antd/lib/table/interface'

const SelectMap: Record<string, RowSelectionType> = {
	single: 'radio',
	multiple: 'checkbox'
}

const Index = (props: IPropsPureTable) => {
	const {
		parent,
		namespace,
		primary,
		list,
		columns,
		pagination,
		props: table_props,
		operation,
		batch,
		setSelects,
		hidePagination,
		type,
		selectMode,
		setBatchSelected
	} = props
	const locale = getLocale()
	const in_form = parent === 'Form'
	const { customStyle, ...rest_table_props } = table_props || {}
	const row_selection: TableRowSelection<any> = {
		type: 'checkbox',
		onChange: useMemoizedFn((v) => setBatchSelected(v as Array<number>))
	}
	let rowSelection = batch.active ? row_selection : undefined
	let list_columns = useColumns(namespace, primary, columns, table_props?.scroll, operation)

	if (type === 'modal') {
		list_columns = list_columns.filter((column) => column.key !== '__operation').slice(0, 4)
		rowSelection = {
			type: SelectMap[selectMode as string] || 'radio',
			onChange: useMemoizedFn((v) => {
				setSelects(v.map((id: number) => list.find((item) => item.id === id)))
			})
		}
	}

	useLayoutEffect(() => {
		window.$app.Event.emit('app/getContext', { namespace, primary, data_item: {} })
	}, [namespace, primary])

	const table_pagination: TablePaginationConfig = {
		current: Number(pagination.page) || 1,
		pageSize: Number(pagination.pagesize) || 10,
		total: pagination.total,
		showSizeChanger: true,
		showTotal: useMemoizedFn(
			(total: number) =>
				Message(locale).pagination.total.before + total + Message(locale).pagination.total.after
		)
	}

	const getRowKey = useMemoizedFn((item) => item[primary] || item[Object.keys(item)[0]])

	const onChange = useMemoizedFn(({ current: page, pageSize: pagesize }) => {
		window.$app.Event.emit(`${namespace}/search`, { page, pagesize })
	})

	const sticky = useMemo(() => {
		if (in_form || hidePagination || parent === 'Dashboard') return false

		return { offsetHeader: customStyle === 'compact' ? 60 : 52 }
	}, [in_form, hidePagination, parent, customStyle])

	return (
		<Table
			dataSource={list}
			columns={list_columns}
			sticky={sticky}
			pagination={hidePagination || table_props?.hidePagination === true ? false : table_pagination}
			rowSelection={batch.active ? row_selection : undefined}
			rowKey={getRowKey}
			onChange={onChange}
			//@ts-ignore
			components={{ body: { cell: ({ onMouseEnter, onMouseLeave, ...rest }) => <td {...rest} /> } }}
			{...rest_table_props}
		/>
	)
}

export default window.$app.memo(Index)
