import { Button, Col, Form, Row, Space, Tooltip } from 'antd'
import clsx from 'clsx'
import { toJS } from 'mobx'
import { MouseEventHandler, useLayoutEffect } from 'react'
import { When } from 'react-if'

import { X } from '@/components'
import { useMounted } from '@/hooks'
import { Icon } from '@/widgets'
import { getLocale, useSearchParams } from '@umijs/max'


import { useCalcLayout, useVisibleMore } from './hooks'
import styles from './index.less'
import locales from './locales'

import type { IPropsFilter } from './types'
import { useAction } from '@/actions'

const { useForm } = Form

const Index = (props: IPropsFilter) => {
	const { parent, model, columns, namespace, params, isChart, onFinish, resetSearchParams, afterSelect } = props
	const mounted = useMounted()
	const locale = getLocale()
	const [form] = useForm()
	const onAction = useAction()

	const is_cn = locale === 'zh-CN'
	const { getFieldsValue, resetFields, setFieldsValue, submit } = form
	const { display_more, opacity_more, visible_more, setVisibleMore } = useVisibleMore()
	const form_name = `form_filter_${model}`
	const { base, more, visible_btn_more } = useCalcLayout(columns, { mounted, form_name })

	const onCancel = (event: any) => {
		if (afterSelect) {
			afterSelect(false);
		}
	}

	const onSelect = (event: any) => {
		if (afterSelect) {
			afterSelect(true);
		}
	}

	useLayoutEffect(() => {
		resetFields()
		if (!params) { return }
		const search_params = Object.fromEntries(params)
		if (!Object.keys(search_params).length) return
		setFieldsValue(search_params)
	}, [parent, params])

	if (!columns.length) return null

	const onReset = () => {
		resetFields()
		resetSearchParams()
		onFinish(getFieldsValue())
	}

	return (
		<Form
			className={clsx(styles._local, isChart ? styles.chart : '')}
			form={form}
			name={form_name}
			onFinish={onFinish}
			onReset={onReset}
		>
			<Row gutter={16} style={{ marginBottom: 16 }}>
				{base.map((item: any, index: number) => (
					<Col span={item.width} key={index}>
						<X
							type='edit'
							name={item.edit.type}
							props={{
								...toJS(item.edit.props),
								__bind: item.bind,
								__name: item.name
							}}
						></X>
					</Col>
				))}
				<When condition={columns.length}>
					<Col>
						<Button
							className='btn_filter_action flex justify_center align_center'
							type='primary'
							htmlType='submit'
						>
							{locales[locale].search}
						</Button>
					</Col>
					<Col>
						<Button
							className='btn_filter_action flex justify_center align_center'
							htmlType='reset'
						>
							{locales[locale].reset}
						</Button>
					</Col>
				</When>
				<Col flex='auto'>
					<div className='flex justify_end'>
						{visible_btn_more && (
							<Tooltip title={is_cn ? '更多筛选项' : 'More Filters'}>
								<Button
									className='btn_more no_text w_100 flex justify_center align_center'
									icon={<Icon name='icon-filter' size={15}></Icon>}
									onClick={() => setVisibleMore(!visible_more)}
								></Button>
							</Tooltip>
						)}
						<Space>
							<Button type="primary" onClick={onSelect} >选择</Button>
							<Button onClick={onCancel} >返回</Button>
						</Space>
					</div>
				</Col>
			</Row>
			{visible_more && (
				<div
					className={clsx([
						'more_wrap w_100 border_box flex_column transition_normal relative',
						opacity_more ? 'opacity' : '',
						display_more ? 'display' : ''
					])}
				>
					<a
						className='icon_wrap flex justify_center align_center transition_normal cursor_point clickable absolute'
						onClick={() => setVisibleMore(false)}
					>
						<Icon className='icon' name='icon-x' size={16}></Icon>
					</a>
					<Row gutter={16} style={{ marginBottom: 16 }}>
						{more.map((item: any, index: number) => (
							<Col span={item.width} key={index}>
								<X
									type='edit'
									name={item.edit.type}
									props={{
										...toJS(item.edit.props),
										__bind: item.bind,
										__name: item.name
									}}
								></X>
							</Col>
						))}
					</Row>
				</div>
			)}
		</Form>
	)
}

export default window.$app.memo(Index)
