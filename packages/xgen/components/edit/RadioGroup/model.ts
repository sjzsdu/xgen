import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { Remote } from '@/models'

import type { RadioGroupProps } from 'antd'
import { ICheckboxOption } from '../CheckboxGroup/model';


@injectable()
export default class Index {
	get options(): ICheckboxOption[] {
		return this.remote.options
	}

	constructor(public remote: Remote) {
		makeAutoObservable(this, {}, { autoBind: true })
	}
}
