import { handleActions } from '@/actions/utils'
import Flow from '@yaoapp/actionflow'

import type { Component, Action } from '@/types'
import { Modal } from 'antd'

export interface OnAction {
	namespace: Component.Props['__namespace']
	primary: Component.Props['__primary']
	data_item: any
	it: Action.Props
	extra?: any
}

const onAction = ({ namespace, primary, data_item, it, extra }: OnAction) => {
	const { confirm } = it
	console.log('onAction', namespace, primary, data_item, it, extra)
	if (confirm) {
		Modal.confirm({
			title: confirm.title || '提示',
			content: confirm.desc || '确定要执行此操作吗？',
			onOk: (close) => {
				const actions = handleActions({ namespace, primary, data_item, it, extra })

				new Flow().init(namespace, actions)
				close()
			}
		})
	} else {
		const actions = handleActions({ namespace, primary, data_item, it, extra })
		console.log('hukl', actions, namespace, primary, data_item, it, extra)
		new Flow().init(namespace, actions)
	}
}

export default () => onAction
