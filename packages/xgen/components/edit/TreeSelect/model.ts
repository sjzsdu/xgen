import { debounce } from 'lodash-es'
import { makeAutoObservable, toJS } from 'mobx'
import { injectable } from 'tsyringe'

import { Remote } from '@/models'

import type { TreeSelectProps } from 'antd'

@injectable()
export default class Index {
	get options(): TreeSelectProps['treeData'] {
		return toJS(this.remote.options)
	}

	get target_props() {
		const target: TreeSelectProps = {}

		if (this.remote.raw_props.xProps?.search) {
			target['showSearch'] = true
			target['notFoundContent'] = null
			target['onSearch'] = debounce(this.remote.searchOptions, 800, { leading: false })
		}

		return target
	}

	constructor(public remote: Remote) {
		makeAutoObservable(this, {}, { autoBind: true })
	}
}
