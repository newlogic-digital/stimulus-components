import { Controller } from '@hotwired/stimulus'
import { dataset, dispatchCustomEvent } from '@newlogic-digital/utils-js'

export class ControlSelect extends Controller {
    connect() {
        this.select = this.element.querySelector('select')
        const option = this.element.querySelectorAll('[data-option]')

        if (option[0]) {
            option.forEach((option) => {
                if (option.dataset.disabled) {
                    return
                }

                dataset(option, 'action').add('click->x-control-select#choose', 'keydown.enter->x-control-select#choose')
            })
        }
    }

    choose({ currentTarget }) {
        this.select.value = currentTarget.dataset.option
        dispatchCustomEvent(this.select)
        document.activeElement.blur()
    }
}
