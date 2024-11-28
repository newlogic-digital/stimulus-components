import { Controller } from '@hotwired/stimulus'
import { dataset } from '@newlogic-digital/utils-js'

export class Reveal extends Controller {
    static targets = ['item']

    intersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.intersectionRatio > 0.1 && !entry.target.hasAttribute('data-in')) {
                    entry.target.setAttribute('data-in', '')

                    if (entry.target.dataset.lazyController) {
                        dataset(entry.target, 'controller').add(entry.target.dataset.lazyController)
                    }
                }
            })
        }, {
            threshold: 0.1
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
