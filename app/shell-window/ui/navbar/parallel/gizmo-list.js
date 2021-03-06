import * as yo from 'yo-yo'
import loadingView from './loading'
import { Gizmo } from './gizmo'

export class GizmoList {
  constructor (gizmos, keyset) {
    this.gizmos = gizmos
    this.keyset = keyset
  }

  render () {
    if (!this.gizmos) {
      return loadingView()
    }
    if (this.gizmos.length === 0) {
      return yo`
        <ul class="gizmo-list">
          <li>
            <div class="list-item sidebarscripts">
              You are not using any gizmos!
            </div>
          </li>
        </ul>
      `
    }

    return yo`
      <ul class="gizmo-list">
        ${this.gizmos.map(g => new Gizmo(g, this.keyset).render())}
      </ul>
    `
  }
}
