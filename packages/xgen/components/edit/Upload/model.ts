import { makeAutoObservable } from 'mobx'
import { IRequest } from './request/types'

export default class UploadModel {
	constructor() {
		makeAutoObservable(this)
	}

	public async handleUpload(request: IRequest, options: any) {
		try {
			// 检查 request 和 Upload 方法是否存在
			if (!request?.Upload) {
				throw new Error('Upload method is not defined on request object')
			}
			const response = await request.Upload(options)
			return response
		} catch (error) {
			console.error('[Upload] Error:', error)
			throw error
		}
	}
}