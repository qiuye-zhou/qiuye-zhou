import axios from 'axios'
import https from 'https'
import { githubAPIEndPoint } from '../config/config'

const request = axios.create({
  baseURL: githubAPIEndPoint,
  timeout: 5000,
  httpsAgent: new https.Agent({
      rejectUnauthorized: false
  })
})

request.interceptors.response.use(undefined, (err: { message: any }) => {
    console.log(err.message)
    return Promise.reject(err)
})

export {
    request
}