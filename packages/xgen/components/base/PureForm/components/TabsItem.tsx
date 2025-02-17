import { Col, Tabs } from 'antd'

import RowItem from './RowItem'

import type { IPropsTabsItem, IPropsRowItem } from '../types'
import Text from './Text'
import { hasRule } from '@/actions'

const Index = (props: IPropsTabsItem) => {
	const { namespace, primary, type, item } = props

	const props_row_item: Omit<IPropsRowItem, 'columns'> = {
		namespace,
		primary,
		type
	}

	return (
		<Col span={item.width}>
			<Tabs
				className='w_100'
				animated
				items={item.tabs
					.filter((tab) => hasRule({ rule_id: tab.rule }))
					.map((it, idx) => ({
						label: <Text {...it} text={it.title || ''} />,
						key: it.title! + idx,
						children: <RowItem {...props_row_item} columns={it.columns}></RowItem>
					}))}
			></Tabs>
		</Col>
	)
}

export default window.$app.memo(Index)
