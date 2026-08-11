import { Controller } from '@hotwired/stimulus'
import { importScript, dataset } from '@newlogic-digital/utils-js'

export class ReCaptcha extends Controller {
  static values = {
    api: String,
    action: String,
    url: {
      default: 'https://www.google.com/recaptcha/enterprise.js?render={apikey}',
    },
  }

  connect() {
    importScript(this.urlValue.replace('{apikey}', this.apiValue))
  }

  execute(event) {
    if (event?.detail?.recaptchaExecuted) return

    window.grecaptcha.enterprise.ready(async () => {
      this.element.gtoken.value = await window.grecaptcha.enterprise.execute(this.apiValue, { action: this.actionValue ?? 'form' })
      this.element.dispatchEvent(new CustomEvent('submit', { cancelable: true, detail: { recaptchaExecuted: true } }))
    })
  }
}

export class ReCaptchaLazy extends Controller {
  static values = {
    recaptchaClass: String,
    recaptchaLazyClass: String,
  }

  get recaptchaClass() {
    return this.recaptchaClassValue || this.identifier.replace(/-lazy$/, '')
  }

  get recaptchaLazyClass() {
    return this.recaptchaLazyClassValue || this.identifier
  }

  connect() {
    if (this.element.dataset.controller.split(' ').indexOf(this.recaptchaClass) > -1) {
      return
    }
    this.function = this.loadRecaptcha.bind(this)

    this.element.addEventListener('focusin', this.function, { once: true })

    this._observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.loadRecaptcha()
        }
      })
    }, {
      root: null,
      rootMargin: `${window.innerHeight}px`,
      threshold: 0,
    })

    this._observer.observe(this.element)
  }

  disconnect() {
    if (typeof this._observer !== 'undefined') {
      this._observer.disconnect()
    }
  }

  loadRecaptcha() {
    if (typeof this._observer !== 'undefined') {
      this._observer.disconnect()
    }

    this.element.removeEventListener('focusin', this.function)
    dataset(this.element, 'controller').add(this.recaptchaClass)
    dataset(this.element, 'controller').remove(this.recaptchaLazyClass)
  }
}
