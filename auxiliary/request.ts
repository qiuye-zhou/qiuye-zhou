import axios from 'axios'
import https from 'https'
import { githubAPIEndPoint } from '../config/config'

const request = axios.create({
  baseURL: githubAPIEndPoint,
  timeout: 4000,
  httpsAgent: new https.Agent({
      rejectUnauthorized: false
  })
})

request.interceptors.response.use(undefined, (err) => {
    console.log(err.message)
    return Promise.reject(err)
})

export {
    request
}