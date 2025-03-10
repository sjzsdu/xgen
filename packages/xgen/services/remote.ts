import axios from 'axios'
import { injectable } from 'tsyringe'

import { catchError } from '@/knife'

import type { Response } from '@/types'

@injectable()
export default class Index {
	@catchError()
	getOptions<Req, Res>(api: string, params: Req) {
		return axios.get<Req, Response<Res>>(api, { params })
	}

	@catchError()
	searchOptions<Req, Res>(api: string, params: Req) {
		return axios.get<Req, Response<Res>>(api, { params })
	}

	@catchError()
	get<Req, Res>(api: string, params?: Req) {
		if (params) {
			return axios.get<Req, Response<Res>>(api, { params })
		}
		return axios.get<Req, Response<Res>>(api)
	}
	
}
