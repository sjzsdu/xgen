import { debounce } from 'lodash-es'
import { makeAutoObservable, toJS } from 'mobx'
import { injectable } from 'tsyringe'

import { Remote } from '@/services'

import type { SelectProps } from 'antd'
import { IProps } from './types'
import { Namespace } from '@/models'
import { local } from '@yaoapp/storex'

type afterSelectFunc = (data: Record<string, any>[]) => void

const callbacks: afterSelectFunc[] = []
@injectable()
export default class Index {
	props?: IProps
	namespaceKey: string = ''
	selects?: Record<string, any>[]
	options = [] as Array<any>
	callbacks: afterSelectFunc[] = []
	constructor(
		public remote: Remote,
	) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	registerCallback(func: afterSelectFunc) {
		if (this.callbacks.indexOf(func) < 0) {
			this.callbacks.push(func);
		}
	}

	triggerCallback() {
		if (!this.selects) return
		for(const callback of toJS(this.callbacks)) {
			callback(this.selects);
		}
	}

	get selectOptions() {
		return toJS(this.options)
	}

	async getOptions(value: number | number[]) {
		const {xProps} = this.props || {}
		if (!xProps || !xProps.remote?.api) {
			return []
		}
		const params = { ids: value}
		const res = await this.remote.get<any, any>(xProps.remote?.api, params)
		const data = res?.res || []
		this.updateOptions(data)
		return data
	}

	updateOptions(data: any[]) {
		const newValues = data.map(item => item.value);
		this.options = this.options.filter(item => !newValues.includes(item.id))
		this.options = [...this.options, ...data]
		local[this.props!.model] = this.options.slice(0, 50)
	}

	init() {
		this.namespaceKey = `${this.props?.__namespace}/Table-Modal-${this.props?.model}/select`;
		this.options = local[this.props!.model] ?? [];
		this.on()
	}

	select(data: any[]) {
		this.selects = [...data]
		this.updateOptions(data)
		this.triggerCallback();
	}


	on() {
		window.$app.Event.on(this.namespaceKey, this.select)
	}

	off() {
		this.callbacks = [];
		window.$app.Event.off(this.namespaceKey, this.select)
	}
}
