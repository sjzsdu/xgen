import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { Remote } from '@/models'

import type { CheckboxOptionType } from 'antd'

export interface ICheckboxOption extends CheckboxOptionType {
	selected?: boolean;
	value: string | number;
}

@injectable()
export default class Index {
	get options(): Array<ICheckboxOption> {
		return this.remote.options
	}

	constructor(public remote: Remote) {
		makeAutoObservable(this, {}, { autoBind: true })
	}
}
