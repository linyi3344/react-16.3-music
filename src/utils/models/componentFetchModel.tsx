import { configure, observable, action, runInAction, computed, autorun } from 'mobx'
import { IRecommendListPayload } from '../../pages/Explore/RecommendList/view'
import { IBannerPayload } from '../../pages/Explore/Banner/view'

configure({ enforceActions: true })

type IOption = {
  URL: string
}

class Store {
  @observable URL: string = ''
  @observable payload: IRecommendListPayload | IBannerPayload | null = null
  @observable state: string = 'pending' // "pending" / "done" / "error"

  constructor(option: IOption) {
    this.URL = option.URL
  }

  fetchURL = () => {
    return fetch(this.URL, {})
  }

  @action
  fetchData() {
    this.state = 'pending'
    this.fetchURL().then(
      response => {
        if (!(response.status === 200 || response.status === 304)) {
          throw new Error('Fail to get response with status:' + response.status)
        }
        response
          .json()
          .then(payload => {
            runInAction(() => {
              this.state = 'done'
              this.payload = payload
            })
          })
          .catch(error => {
            throw new Error('Invalid json response: ' + error)
          })
      },
      error => {
        runInAction(() => {
          this.state = 'error'
        })
      }
    )
  }
}

export default Store
