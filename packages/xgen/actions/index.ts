import { Action, App } from '@/types'
import useAction from './useAction'
import { useState } from 'react'
import { container } from 'tsyringe'
import { GlobalModel } from '@/context/app'
import { toJS } from 'mobx'

export { useAction }

export function actionsInMenu<T extends { props: any }>(actions: Array<T>, user: App.User) {
	return actions.filter((action) => {
		if (!action.props || user.type === 'admin') {
			return true
		}
		const keys = ['role_id', 'department_id', 'rule_id'].filter((key) => !!action.props[key])
		if (!keys.length) {
			return true
		}
		return keys.every((key) => {
			if (!!user[key + 's']) {
				if (Array.isArray(action.props[key])) {
					return action.props[key].some((someKey: number) => user[key + 's'].includes(someKey))
				} else {
					return user[key + 's'].includes(action.props[key])
				}
			} else {
				return true
			}
		})
	})
}

export function actionAllowed(accessData?: Action.AccessData, user?: App.User) {
	if (!accessData || !user || user.type === 'admin') {
		return true
	}
	const keys = ['role_id', 'department_id', 'rule_id'].filter((key) => !!accessData[key])
	if (!keys.length) {
		return true
	}
	return keys.every((key) => {
		if (!!user[key + 's']) {
			if (Array.isArray(accessData[key])) {
				return accessData[key].some((someKey: number) => user[key + 's'].includes(someKey))
			} else {
				return user[key + 's'].includes(accessData[key])
			}
		} else {
			return true
		}
	})
}

export function hasRule(accessData?: Action.AccessData) {
	console.log('hualalla', accessData)
	const [g] = useState(() => container.resolve(GlobalModel))

	if (!accessData) {
		return true
	}
	return actionAllowed(accessData, toJS(g.user))
}
