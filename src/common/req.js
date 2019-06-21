import axios from 'axios'
import router from '../router'

const doRequest = axios.create({
  timeout: 5000
})

doRequest.interceptors.request.use(config => {
  config.method === 'post' ? config.data = {...config.data} : config.params = {...config.params}
  config.headers['Authorization'] = localStorage.getItem('TOKEN')
  config.headers['Content-Type'] = 'application/json'
  return config
}, error => {
  Promise.reject(error)
})

doRequest.interceptors.response.use(
  response => {
    let result = parseInt(response.data.status, 0)
    if (result === 100001) {
      localStorage.removeItem('TOKEN')
      localStorage.removeItem('LOGINED_USER')
      router.push('/login')
    }

    if (result === 200) {
      return response.data
    } else {
      alert(response.data.msg)
      return Promise.reject(response)
    }
  },
  error => {
    console.log(JSON.stringify(error))
    return Promise.reject(error)
  }
)

export default doRequest
