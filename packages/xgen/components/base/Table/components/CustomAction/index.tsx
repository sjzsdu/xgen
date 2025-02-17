import { Fragment } from 'react'

import { X } from '@/components'

import type { IPropsCustomAction } from '../../types'
import { Space } from 'antd'

const Index = (props: IPropsCustomAction) => {
	const { setting, namespace, batch_columns, batch, search, setBatchActive, table_columns, filter_columns } = props
	
	const props_table_columns = {
		title: '表格显示列设置',
		columns: table_columns,
		localKey: 'custom_table_columns:' + namespace,
		ckey: 'custom_table_columns',
		namespace
	}

	const props_filter_columns = {
		title: '筛选列设置',
		columns: filter_columns,
		localKey: 'custom_filter_columns:' + namespace,
		ckey: 'custom_filter_columns',
		namespace
	}

	return (
		<Fragment>
			{/* <Space size="small"> */}
				{setting.header.preset?.filter && (
					<X
						type='optional'
						name='Table/Column'
						props={{
							...setting.header.preset.filter,
							...props_filter_columns
						}}
					></X>
				)}
				{setting.header.preset?.column && (
					<X
						type='optional'
						name='Table/Column'
						props={{
							...setting.header.preset.column,
							...props_table_columns
						}}
					></X>
				)}
				{setting.header.preset?.import && (
					<X
						type='optional'
						name='Table/Import'
						props={{
							...setting.header.preset.import,
							search
						}}
					></X>
				)}
				{setting.header.preset?.batch && (
					<X
						type='optional'
						name='Table/Batch'
						props={{
							namespace,
							columns: batch_columns,
							deletable: setting.header.preset?.batch.deletable,
							batch,
							setBatchActive
						}}
					></X>
				)}
			{/* </Space> */}
		</Fragment>
	)
}

export default window.$app.memo(Index)
