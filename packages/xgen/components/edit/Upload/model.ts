import { makeAutoObservable } from 'mobx'
import { IRequest } from './request/types'
import { injectable } from 'tsyringe'

import { Remote } from '@/services'
import { CosParam } from './types'
import { local } from '@/../storex/dist'
import COS, { COSOptions, ProgressInfo, UploadFileItemParams, UploadFileItemResult } from 'cos-js-sdk-v5'
import { objectKey } from '@/utils'
import { UploadRequestError, UploadRequestOption } from 'rc-upload/lib/interface'

export interface CosCredential {
	TmpSecretId: string;
	TmpSecretKey: string;
	Token: string;
}

export interface CosToken {
	Credentials: CosCredential;
	ExpiredTime: number;
	Expiration: string;
	StartTime: number;
	[key: string]: any
}

@injectable()
export default class UploadModel {
	cos?: CosParam;
	cosToken?: CosToken;
	constructor(public service: Remote) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async init() {
		const { tokenUrl } = this.cos || {};
		if (!tokenUrl) return

		if (local.cosToken) {
			return (this.cosToken = local.cosToken)
		}

		const { res, err } = await this.service.get<null, any>(tokenUrl)

		if (err) return
		local.cosToken = res;
		local.setExpires('cosToken', (res.ExpiredTime - 10) * 1000);
		this.cosToken = res;
	}

	get uploadUrl() {
		const { uploadUrl } = this.cos || {};
		return `${uploadUrl}`
	}

	get COSOptions(): COSOptions {
		const { Credentials } = this.cosToken || {};
		return {
			SecretId: Credentials?.TmpSecretId,
			SecretKey: Credentials?.TmpSecretKey,
			SecurityToken: Credentials?.Token,
		}
	}

	get cosClient() {
		return new COS(this.COSOptions); 
	}

	putObject(file: UploadRequestOption) {
		const fileObj = file.file as File;
		const filename = (fileObj as File).name
		const key = objectKey(filename, this.cos?.keyFormat || filename)
		this.cosClient.uploadFile({
			Bucket: this.cos?.bucket || '',
			Region: this.cos?.region || '',
			Key: key,
			Body: fileObj as File,
			onProgress: (progressData: ProgressInfo) => {
				if (file.onProgress) {
					file.onProgress({ percent: progressData.percent * 100});
				}
			},
			onFileFinish: (err: Error, data: UploadFileItemResult, options: UploadFileItemParams) => {
				if (err && file.onError) {
					file.onError(err as UploadRequestError)
				}
				if (file.onSuccess) {
					file.onSuccess('http://' + data.Location)
				}
			}
		})
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
