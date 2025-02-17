import type Model from './model'

export interface IPropsCustomAction {
	setting: Model['setting']
	namespace: string
	batch_columns: Model['batch_columns']
	table_columns?: Model['table_columns']
	filter_columns?: Model['filter_columns']
	batch: Model['batch']
	search: Model['search']
	setBatchActive: (v: boolean) => void
}
