import { Controller } from '@hotwired/stimulus'
import { importScript } from "@newlogic-digital/utils-js";

export class ReCaptcha extends Controller {
    static values = {
        api: String,
        action: String,
        url: {
            default: 'https://www.google.com/recaptcha/enterprise.js?render={apikey}'
        }
    }

    connect() {
        importScript(this.urlValue.replace('{apikey}', this.apiValue))
    }

    execute(event) {
        if (event?.detail?.recaptchaExecuted) return

        window.grecaptcha.enterprise.ready(() => {
            window.grecaptcha.enterprise.execute(this.apiValue, { action: this.actionValue ?? 'form' }).then((token) => {
                this.element.gtoken.value = token
                this.element.dispatchEvent(new CustomEvent('submit', { cancelable: true, detail: { recaptchaExecuted: true } }))
            })
        })
    }
}
