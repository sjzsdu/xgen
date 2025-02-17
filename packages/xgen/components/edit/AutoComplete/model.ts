import { debounce } from 'lodash-es'
import { makeAutoObservable, toJS } from 'mobx'
import { injectable } from 'tsyringe'

import { Remote } from '@/services'

import type { SelectProps } from 'antd'
import { IProps } from './types'

@injectable()
export default class Index {
	props?: IProps
	constructor(public remote: Remote) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	get options(): SelectProps['options'] {
		return toJS(this.remote.options)
	}

	async getOptions(value: string) {
		const { xProps } = this.props || {}
		if (!xProps || !xProps.remote?.api) {
			return []
		}
		const params = {
			page: 1,
			size: 50,
			...(xProps.remote.params || {}),
			name: value
		}
		const res = await this.remote.get<any, any>(xProps.remote?.api, params)
		const data = res?.res?.data || []
		return data
	}

	get target_props() {
		return {}
	}
}
