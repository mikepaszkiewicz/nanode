import axios from 'axios'
import * as moment from 'moment'

const BASE_URL = 'https://api.tryhabitat.com'

export default async function get() {
  try {
    const res = await axios.get(BASE_URL)
    if (res.status == 200) {
      throw new Error('api.tryhabitat.com is down')
    }

    const job = await axios.get(BASE_URL + '/jobs/status')

    if (job.data.lastCompletedDate) {
      console.log(moment(job.data.lastCompletedDate))
      throw new Error('API worker is down')
    }
  } catch (err) {
    console.log(err.message)
  }
}
