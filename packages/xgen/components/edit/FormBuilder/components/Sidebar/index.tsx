import { Icon } from '@/widgets'
import { Type } from '../../types'
import { useEffect, useState } from 'react'

interface IProps {
	types?: Type[]
	height?: number
	fixed: boolean
	offsetTop: number
}

const Index = (props: IProps) => {
	return (
		<div className='sidebar' style={{}}>
			<div
				className='content'
				style={{
					maxHeight: props.height,
					minHeight: props.height,
					zIndex: 1000,
					position: props.fixed ? 'fixed' : 'relative',
					top: props.fixed ? `${props.offsetTop}px` : 'auto',
					width: 172
				}}
			>
				{props.types?.map((type, index) => (
					<div
						key={`${type.name}|${index}`}
						className='item'
						draggable={true}
						unselectable='on'
						onDragStart={(e) =>
							e.dataTransfer.setData('text/plain', JSON.stringify({ type: type.name }))
						}
					>
						<Icon
							size={14}
							name={type.icon ? type.icon : 'material-format_align_left'}
							className='mr_6'
						/>
						{type.label ? type.label : type.name}
					</div>
				))}
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
