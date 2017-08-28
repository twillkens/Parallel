import { ipcRenderer } from 'electron'
import * as yo from 'yo-yo'
import * as pages from '../../../pages'
// Render the list of scripts in the dropdown
export class Post {
  constructor (post) {
    this.showIcons = false
    this.post = post
    this.userAppURL = 'dat://a5d20d746829e528e0fc1cf4fd567e245e5213b8fb5bc195f51d2369251cd2c2'
  }

  onMouseOverToggle () {
    this.showIcons = !this.showIcons
    this.updateActives()
  }

  updateActives () {
    // Array.from(document.querySelectorAll('.post')).forEach(el => yo.update(el, this.render()))
    // yo.update(document.getElementById(this.post._url), this.render())
    // console.log('document in post', document)
    Array.from(document.querySelectorAll('.' + this.parseDatPath(this.post._url))).forEach(el => yo.update(el, this.render()))
    console.log('this in post updateActives', this)
  }

  onOpenPage (opts) {
    let path
    switch (opts) {
      case 'user':
        path = this.getViewProfileURL()
        break
      case 'post':
        path = this.getViewBroadcastURL()
        break
      case 'gizmo':
        path = this.getViewGizmoURL()
        break
    }
    const url = this.userAppURL + path
    pages.setActive(pages.create(url))
    this.showIcons = false
    this.updateActives()
  }

  getViewGizmoURL () {
    return '/#gizmo/' + this.post.gizmo._url.slice('dat://'.length)
  }

  getViewBroadcastURL () {
    return '/#broadcast/' + this.post._url.slice('dat://'.length)
  }

  getViewProfileURL () {
    return '/#profile/' + this.post._origin.slice('dat://'.length)
  }

  injectPost (post) {
    console.log('post in button', post)
    ipcRenderer.send('inject-post', post)
  }

  parseDatPath () {
    console.log('this in post parse', this)
    let dat = this.post._url.replace(/\//g, '')
    dat = dat.replace(/\./g, '')
    dat = dat.replace(/:/g, '')
    console.log('dat in post after parse', dat)
    return dat
  }

  render () {
    var icons = ''
    if (this.showIcons) {
      icons = yo`
        <div style="display: inline-block">
          <i class="fa fa-play-circle-o fa-lg" onclick=${() => this.injectPost(this.post)}></i>
          <i class="fa fa-user-circle-o fa-lg" onclick=${() => this.onOpenPage('user')}></i>
          <i class="fa fa-info-circle fa-lg" onclick=${() => this.onOpenPage('post')}></i>
          <i class="fa fa-cog fa-lg" onclick=${() => this.onOpenPage('gizmo')}></i>
        </div>
      `
    }
    return yo`
      <li class="list-item sidebarscripts ${this.parseDatPath()} post" onmouseenter=${() => this.onMouseOverToggle()} onmouseleave=${() => this.onMouseOverToggle()}>
        <div class="list-item">
          <div style="display: inline-block" title=${this.post.author.name}>
            <span><b>${this.post.author.name}</b></span>
          </div>
          <br>
          <div style="display: inline-block">
            <span>${this.post.postText}</span>
          </div>
          <br>
          <div style="display: inline-block">
            <span>Gizmo: ${this.post.gizmo.gizmoName}</span>
          </div>
          <br>
          ${icons}
        </div>
      </li>
    `
  }
}
