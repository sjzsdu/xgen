import { find } from 'lodash-es'
import { makeAutoObservable, toJS } from 'mobx'
import { injectable } from 'tsyringe'

import { Remote } from '@/models'

import type { IProps } from './index'

@injectable()
export default class Index {
	props = {} as IProps

	get item() {
		return this.find()
	}

	constructor(public remote: Remote) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	find(v?: any) {
		const options = toJS(this.props.options || this.remote.options);
		const vals = (v ?? this.props.__value);
		const i = find(options, (it) => {
			return Array.isArray(vals) ? vals.includes(it.value) : vals === it.value;
		})
		return i || v;
	}
}
