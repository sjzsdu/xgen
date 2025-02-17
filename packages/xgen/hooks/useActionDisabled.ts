import { useMemoizedFn } from 'ahooks'

import type { Action } from '@/types'

export default () => {
	return useMemoizedFn((disabled: Action.Props['disabled']) => {
		if (!disabled) return ''
		if (Array.isArray(disabled.value)) {
			if (Array.isArray(disabled.bind)) {
				if (disabled.bind.some(item => disabled.value.includes(item))) return 'disabled'
			} else {
				if (disabled.value.includes(disabled.bind)) return 'disabled'
			}
		} else {
			if (Array.isArray(disabled.bind)) {
				if (disabled.bind.includes(disabled.value)) return 'disabled'
			} else {
				if (disabled.value === disabled.bind) return 'disabled'
			}
		}

		return ''
	})
}
