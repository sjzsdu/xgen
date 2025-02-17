import { Button, Descriptions } from "antd"
import { observer } from "mobx-react-lite"
import { IPropsPureForm } from "../PureForm/types"
import styles from './index.less'

const Index = (props: IPropsPureForm) => {
	console.log('Detail', props)
	const {data, sections} = props
	let groups = []

	for (let section of sections) {
		if (section.columns && section.columns.length) {
			if (section.title || !section.columns[0].tabs) {
				groups.push(section)
			}
			for (let sub of section.columns) {
				if (sub?.tabs) {
					groups.push(...(sub?.tabs || []))
				}
			}

		}
	}

	console.log('groups', groups);
	return (
		<div className={styles._local}>
			{ groups.map(group => (
				<Descriptions title={group.title}>
					{ group.columns.map((column: any) => (
						<Descriptions.Item label={column.name}>{data[column.bind]}</Descriptions.Item>
					))}
				</Descriptions>
			))}
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
