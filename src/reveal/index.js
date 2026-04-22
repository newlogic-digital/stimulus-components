import { Controller } from '@hotwired/stimulus'
import { dataset } from '@newlogic-digital/utils-js'

export class Reveal extends Controller {
  static targets = ['item']

  static values = {
    threshold: {
      type: Number,
      default: 0.1,
    },
    intersectionRatio: {
      type: Number,
      default: 0.1,
    },
    clear: {
      type: Boolean,
      default: false,
    },
  }

  intersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > this.intersectionRatio && !entry.target.hasAttribute('data-in')) {
          entry.target.setAttribute('data-in', '')

          if (entry.target.dataset.lazyController) {
            dataset(entry.target, 'controller').add(entry.target.dataset.lazyController)
          }
        }
        else if (this.clearValue) {
          entry.target.removeAttribute('data-in')
        }
      })
    }, {
      threshold: this.thresholdValue,
    })
  }

  itemTargetConnected(element) {
    if (!this.observer) this.intersectionObserver()

    this.observer?.observe(element)
  }

  itemTargetDisconnected(element) {
    this.observer?.unobserve(element)
  }
}
