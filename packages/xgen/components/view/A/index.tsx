import { Tooltip } from 'antd'

import styles from './index.less'

import type { Component } from '@/types'

interface IProps extends Component.PropsViewComponent {
	href: string
}

const Index = (props: IProps) => {
	const { __value, href } = props
	if (!__value) {
		return <span>-</span>
	}
	let val = __value
	if (['mailto', 'http'].includes(href)) {
		if (val.indexOf('@') > 0) {
			if (val.indexOf('mailto') < 0) {
				val = 'mailto:' + val
			}
		} else {
			if (val.indexOf('http') < 0) {
				val = 'http://' + val
			}
		}
	}
	return (
		<Tooltip title={`访问 ${val}`}>
			<a className={styles._local} target='_blank' href={val}>
				{__value}
			</a>
		</Tooltip>
	)
}

export default window.$app.memo(Index)
