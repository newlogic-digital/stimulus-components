import { Controller } from '@hotwired/stimulus'
import { setCookieConsent, initCookieConsent } from '@newlogic-digital/cookieconsent-js'

export class CookieConsentCommon extends Controller {
    cookieConsentItemKey = 'cookieconsent-js'
    cookieConsentExpireItemKey = 'cookieconsent-js-expire'

    getCookieConsentItem() {
        return localStorage.getItem(this.cookieConsentItemKey)
    }

    getCookieConsentExpireItem() {
        return localStorage.getItem(this.cookieConsentExpireItemKey)
    }
}

export class CookieConsentDialog extends CookieConsentCommon {
    async connect() {
        initCookieConsent(this.getCookieConsentItem() ?? [])

        if (document.querySelector('.x-cookieconsent-form')) {
            return
        }

        if (!this.getCookieConsentItem() || parseInt(this.getCookieConsentExpireItem()) < Date.now()) {
            setTimeout(async () => {
                const { showDialog } = await import('winduum/src/components/dialog/index.js')

                await showDialog(this.element, { closable: false })
            }, 1500)
        } else {
            this.element.remove()
        }
    }

    async approve() {
        await this.hide(['performance', 'marketing'])
    }

    async decline() {
        await this.hide([])
    }

    async hide(type) {
        const { closeDialog } = await import('winduum/src/components/dialog/index.js')

        await setCookieConsent(type)
        initCookieConsent(type)
        await closeDialog(this.element, { remove: true })
    }
}

export class CookieConsentForm extends CookieConsentCommon {
    connect() {
        document.querySelector('.x-cookieconsent-dialog')?.close()

        this.element.querySelectorAll('input:not([disabled])').forEach((input) => {
            input.checked = false
        })

        JSON.parse(this.getCookieConsentItem())?.forEach((type) => {
            if (this.element.querySelector(`input[value="${type}"]`) !== null) {
                this.element.querySelector(`input[value="${type}"]`).checked = true
            }
        })
    }

    async update() {
        const type = []

        this.element.querySelectorAll('input:not([disabled])').forEach((input) => {
            input.checked && type.push(input.value)
        })

        await setCookieConsent(type)
        location.reload()
    }

    disconnect() {
        if ((!this.getCookieConsentItem() || parseInt(this.getCookieConsentExpireItem()) < Date.now())) {
            document.querySelector('.x-cookieconsent-dialog')?.showModal()
        }
    }
}
