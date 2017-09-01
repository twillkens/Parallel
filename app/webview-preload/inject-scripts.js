/* globals DatArchive localStorage */

import { ipcRenderer } from 'electron'
import ParallelAPI from 'parallel-scratch-api'

export function setup () {
  window.savePost = savePost

  ipcRenderer.on('inject-gizmo', (event, gizmo) => {
    console.log('gizmo in inject-gizmo', gizmo)
    localStorage.setItem('activeGizmoURL', gizmo._url)
    gizmo.fullDependencies.forEach((d, idx) => {
      inject(d.gizmoJS, d._url)
    })
    inject(gizmo.gizmoJS, gizmo._url)
  })

  ipcRenderer.on('inject-post', (event, post) => {
    console.log('post in inject-post', post)
    togglePost(post)
  })
}

function inject (js, gizmoURL) {
  // defines body and head of underlying webview DOM

  const body = document.body || document.getElementsByTagName('body')[0]
  const head = document.head || document.getElementsByTagName('head')[0]

  // HACK defines SECURITY_POLICY constant to inject into the page. (surely
  // there's a better way...)

  // const SECURITY_POLICY = `<meta http-equiv="Content-Security-Policy" content="script-src 'self';">`
  // <meta http-equiv="Content-Security-Policy" content="connect-src 'self' file: data: blob: filesystem:; default-src *; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'"/>
  const SECURITY_POLICY = `<meta http-equiv="Content-Security-Policy" content="default-src *;
   img-src * 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' *;
   style-src  'self' 'unsafe-inline' *">`
  head.prepend(SECURITY_POLICY)

  // appends javascript to the <body>

  if (js && gizmoURL) {
    const scriptElement = document.createElement('script')
    scriptElement.setAttribute('id', gizmoURL)
    scriptElement.appendChild(document.createTextNode(js))
    console.log('script element on insert', scriptElement)
    body.appendChild(scriptElement)
  }
}

// important! savePostscript is attached to the window and must be defined in
// the prescript. the function gets credentials from localStorage, removes
// the injected script from the dom, then writes the postscript to the user's
// injestdb

async function savePost (postJS) {
  const gizmoURL = localStorage.getItem('activeGizmoURL')
  localStorage.removeItem('activeGizmoURL')
  const postHTTP = window.location.href
  const postText = window.prompt('Enter a description of your post.')
  if (postJS && gizmoURL && postHTTP) {
    const post = {
      postJS,
      postHTTP,
      postText,
      gizmoURL
    }
    const userProfileURL = 'dat://e482befbba87b0bd542a1ad20d736105d5f6e6b1212d3b0a70e676062bb17549'
    const userDB = await ParallelAPI.open(new DatArchive(userProfileURL))
    await userDB.post(userProfileURL, post)
  }
  ipcRenderer.sendToHost('reload-posts', window.location.href)
}

function togglePost (post) {
  post.postDependencies.forEach((d, idx) => {
    inject(d.gizmoJS, d._url)
  })
  inject(post.postJS, post.gizmoURL)
  // var element = document.getElementById(widget.subscriptURL)
  // if (typeof (element) !== 'undefined' && element !== null) {
  //   removeScript(widget.subscriptURL)
  // } else {
  //   inject(widget.postscriptJS, null, widget.subscriptURL)
  // }
}

// function removeScript (id) {
//   const scriptElement = document.getElementById(id)
//   scriptElement.parentNode.removeChild(scriptElement)
// }

// end
