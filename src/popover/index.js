import { Popover as PopoverController } from 'winduum-stimulus/components/popover/index.js'
import { animationsFinished } from 'winduum/src/common.js'

export class Popover extends PopoverController {
    static targets = ['content', 'autocomplete']

    minAutocompleteLength = 2

    async autocomplete({ currentTarget }) {
        if (currentTarget.value.length < this.minAutocompleteLength) {
            currentTarget.ariaExpanded = 'false'
            await animationsFinished(this.contentTarget)
            this.contentTarget.replaceChildren()
        } else {
            currentTarget.ariaExpanded = 'true'
        }
    }

    selectDescendant({ currentTarget }) {
        this.autocompleteTarget.setAttribute('aria-activedescendant', currentTarget.id)
        this.autocompleteTarget.value = currentTarget.textContent.trim()
        currentTarget.blur()
    }
}
