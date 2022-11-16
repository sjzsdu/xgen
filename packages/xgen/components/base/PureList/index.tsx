import { useMemoizedFn } from 'ahooks'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { Else, If, Then } from 'react-if'
import { container } from 'tsyringe'

import { Empty, List } from './components'
import Model from './model'

import type { IProps, IPropsList } from './types'

const Index = (props: IProps) => {
	const { setting, list, showLabel, onChangeForm } = props
	const [x] = useState(() => container.resolve(Model))

	useLayoutEffect(() => x.init(list), [list])

	const onAdd = useMemoizedFn(x.onAdd)
	const onSort = useMemoizedFn(x.onSort)
	const onAction = useMemoizedFn(x.onAction)

	const props_list: IPropsList = {
		setting,
		list: toJS(x.list),
		showLabel,
		onSort,
		onAction
	}

	return (
		<div className='flex flex_column'>
			<If condition={x.list.length}>
				<Then>
					<List {...props_list}></List>
				</Then>
				<Else>
					<Empty></Empty>
				</Else>
			</If>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).get()
