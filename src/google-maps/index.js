import { Controller } from '@hotwired/stimulus'
import { getId } from '@newlogic-digital/utils-js'

export class GoogleMaps extends Controller {
  static targets = ['map']

  static values = {
    options: Object,
    key: String,
  }

  markerContent = `<svg class="size-16 text-accent"><use href="#heroicons-solid/map-pin"></use></svg>`

  async connect() {
    const { setOptions, importLibrary } = await import('@googlemaps/js-api-loader')

    setOptions({
      key: this.keyValue,
    })

    const { Map } = await importLibrary('maps')

    this.map = new Map(this.mapTarget, {
      zoom: 13,
      mapId: getId(),
      mapTypeControl: false,
      streetViewControl: false,
      ...this.optionsValue,
    })

    this.dispatch('connect')
  }

  async renderMarker() {
    if (this.optionsValue.center?.lat == null || this.optionsValue.center?.lng == null) {
      return
    }

    const { importLibrary } = await import('@googlemaps/js-api-loader')
    const { AdvancedMarkerElement } = await importLibrary('marker')
    const content = new DOMParser().parseFromString(this.markerContent, 'text/html').body.firstChild

    this.marker = new AdvancedMarkerElement({
      map: this.map,
      position: this.optionsValue.center,
      content,
    })
  }
}
