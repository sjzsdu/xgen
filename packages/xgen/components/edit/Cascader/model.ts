import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { Remote } from '@/models'

import type { CascaderProps } from 'antd'
import * as chinaData from 'china-area-data'

function areaData() {
	const options = Object.keys(chinaData['86']).map(code => ({
		value: chinaData['86'][code],
		label: chinaData['86'][code],
		children: !chinaData[code] ? [] : Object.keys(chinaData[code]).map(cityCode => ({
		  value: chinaData[code][cityCode],
		  label: chinaData[code][cityCode],
		  children: !chinaData[cityCode] ? [] : Object.keys(chinaData[cityCode]).map(areaCode => ({
			value: chinaData[cityCode][areaCode],
			label: chinaData[cityCode][areaCode]
		  }))
		}))
	  }))
	return options
}

@injectable()
export default class Index {
	get options(): CascaderProps<any>['options'] {
		return this.remote.options && this.remote.options.length ? this.remote.options : areaData()
	}

	get target_props() {
		const target: CascaderProps<any> = {}

		if (this.remote.raw_props.showSearch) {
			target['showSearch'] = {
				filter: (input, path) =>
					path.some(
						(option) => String(option?.label).toLowerCase().indexOf(input.toLowerCase()) >= 0
					)
			}
		}

		return target
	}

	constructor(public remote: Remote) {
		makeAutoObservable(this, {}, { autoBind: true })
	}
}
