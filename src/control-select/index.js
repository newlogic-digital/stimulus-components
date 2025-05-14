import { Controller } from '@hotwired/stimulus'
import { dataset, dispatchCustomEvent } from '@newlogic-digital/utils-js'

export class ControlSelect extends Controller {
    connect() {
        this.select = this.element.querySelector('select')
        this.options = this.element.querySelectorAll('[data-option]')

        dataset(this.select, 'action').add('change->x-control-select#active')

        this.options.forEach((option) => {
            if (option.dataset.disabled) return

            dataset(option, 'action').add('click->x-control-select#choose')
        })
    }

    choose({ currentTarget }) {
        this.select.value = currentTarget.dataset.option
        dispatchCustomEvent(this.select)
        document.activeElement.blur()
    }

    active() {
        this.options.forEach(option => option.removeAttribute('data-active'))
        this.element.querySelector(`[data-option="${this.select.value}"]`).setAttribute('data-active', '')
    }
}
