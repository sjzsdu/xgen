import { useMemoizedFn } from 'ahooks'
import clsx from 'clsx'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { Filter, Page, PureTable } from '@/components'

import { CustomAction } from './components'
import styles from './index.less'
import Model from './model'

import type { Component, TableType } from '@/types'

import type { IPropsFilter } from '@/components/base/Filter/types'
import type { IPropsPureTable } from '@/components/base/PureTable/types'
import type { Global } from '@/types'
import type { IPropsCustomAction } from './types'
import { GlobalModel } from '@/context/app'
import { actionsInMenu } from '@/actions'
import { sortedColumn } from '@/utils'
import { local } from '@/../storex/dist'
import ModalFilter from '../ModalFilter'

export interface IProps extends Component.StackComponent {
	query?: Global.StringObject
	data?: Array<any>
	namespace?: string
	hidePagination?: IPropsPureTable['hidePagination']
	onChangeEventName?: string
	selectMode: TableType.SelectMode
	onBack?: () => void
}

const Index = (props: IProps) => {
	const {
		parent,
		model,
		search_params,
		selectMode,
		query,
		data,
		namespace,
		hidePagination,
		onChangeEventName,
		onBack
	} = props
	console.log('table props', props)
	const [x] = useState(() => container.resolve(Model))
	const [g] = useState(() => container.resolve(GlobalModel))
	const [selects, setSelects] = useState([])

	useLayoutEffect(() => {
		x.init(parent, model, query, data, namespace, search_params!, onChangeEventName)

		return () => {
			x.off()
		}
	}, [parent, model, query, data, namespace, search_params])

	const setBatchSelected = useMemoizedFn((v: Array<number>) => (x.batch.selected = v))
	const onFinish = useMemoizedFn((v: any) => {
		x.resetSearchParams()
		for (let o in v) {
			if (Array.isArray(v[o])) {
				v[o] = v[o].join(',')
			}
		}
		window.$app.Event.emit(`${x.namespace.value}/search`, v)
	})
	const resetSearchParams = useMemoizedFn(x.resetSearchParams)
	const search = useMemoizedFn(x.search)
	const setBatchActive = useMemoizedFn((v: boolean) => {
		x.batch.active = v
		x.batch.selected = []
	})

	if (!x.setting.table) return null
	const operation = toJS(x.setting.table.operation)
	operation.actions = actionsInMenu(operation.actions, toJS(g.user))

	const localKey = 'custom_table_columns:' + x.namespace.value
	const props_table: IPropsPureTable = {
		setSelects,
		parent,
		namespace: x.namespace.value,
		primary: x.setting.primary,
		list: toJS(x.list),
		columns: sortedColumn(toJS(x.table_columns), local[localKey]),
		pagination: toJS(x.pagination),
		props: toJS(x.setting.table.props),
		operation,
		batch: toJS(x.batch),
		hidePagination,
		selectMode,
		setBatchSelected
	}

	const localFilterKey = 'custom_filter_columns:' + x.namespace.value
	const filter = toJS(x.setting.filter)
	filter.actions = filter?.actions?.length ? actionsInMenu(filter.actions, toJS(g.user)) : []
	const props_filter: IPropsFilter = {
		parent,
		model: x.model,
		namespace: x.namespace.value,
		columns: sortedColumn(toJS(x.filter_columns), local[localFilterKey]),
		actions: filter.actions,
		onFinish,
		resetSearchParams
	}

	const custom_style = x.setting.table?.props?.customStyle
	const compact_style = custom_style === 'compact' && styles.compact
	const with_total_row = x.setting.table?.props?.withTotalRow && styles.withTotalRow

	if (parent === 'Page') {
		// TODO: Batch Actions
		// Batch Actions will be re-implemented in the future
		// const props_custom_action: IPropsCustomAction = {
		// 	setting: toJS(x.setting),
		// 	namespace: x.namespace.value,
		// 	batch_columns: toJS(x.batch_columns),
		// 	batch: toJS(x.batch),
		// 	search,
		// 	setBatchActive
		// }

		return (
			<Page
				title={x.setting.name}
				className={clsx([styles._local, compact_style, with_total_row, 'w_100'])}
				// customAction={<CustomAction {...props_custom_action}></CustomAction>}
				full={x.setting?.config?.full}
			>
				<Filter {...props_filter}></Filter>
				<PureTable {...props_table}></PureTable>
			</Page>
		)
	}

	if (parent === 'Dashboard') {
		return (
			<div className={clsx([styles._local, compact_style, with_total_row, 'w_100 flex flex_column'])}>
				<Filter {...props_filter}></Filter>
				<PureTable {...props_table}></PureTable>
			</div>
		)
	}

	if (parent === 'Modal') {
		const afterSelect = (bool: boolean) => {
			if (onBack) {
				onBack()
			}
			if (bool) {
				window.$app.Event.emit(x.namespace.value + '/select', selects)
			}
		}
		return (
			<div
				className={clsx([
					styles._local,
					styles._modal,
					compact_style,
					with_total_row,
					'w_100 flex flex_column'
				])}
			>
				<ModalFilter {...props_filter} afterSelect={afterSelect}></ModalFilter>
				<PureTable {...props_table} type='modal' selectMode={selectMode}></PureTable>
			</div>
		)
	}

	return (
		<div
			className={clsx([
				styles._local,
				compact_style,
				with_total_row,
				x.parent === 'Form' ? styles.in_form : 'w_100'
			])}
		>
			<PureTable {...props_table}></PureTable>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
