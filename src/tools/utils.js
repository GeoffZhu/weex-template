export function initIconfont () {
  let domModule = weex.requireModule('dom')
  domModule.addRule('fontFace', {
    'fontFamily': 'iconfont',
    'src': "url('http://at.alicdn.com/t/font_404010_jgmnakd1zizr529.ttf')"
  })
}

export function setBundleUrl (url, jsFile) {
  const bundleUrl = url
  let host = ''
  let path = ''
  let nativeBase
  const isAndroidAssets = bundleUrl.indexOf('your_current_IP') >= 0 || bundleUrl.indexOf('file://assets/') >= 0
  const isiOSAssets = bundleUrl.indexOf('file:///') >= 0 && bundleUrl.indexOf('WeexDemo.app') > 0
  if (isAndroidAssets) {
    nativeBase = 'file://assets/dist'
  } else if (isiOSAssets) {
    // file:///var/mobile/Containers/Bundle/Application/{id}/WeexDemo.app/
    // file:///Users/{user}/Library/Developer/CoreSimulator/Devices/{id}/data/Containers/Bundle/Application/{id}/WeexDemo.app/
    nativeBase = bundleUrl.substring(0, bundleUrl.lastIndexOf('/') + 1)
  } else {
    const matches = /\/\/([^/]+?)\//.exec(bundleUrl)
    const matchFirstPath = /\/\/[^/]+\/([^\s]+)\//.exec(bundleUrl)
    if (matches && matches.length >= 2) {
      host = matches[1]
    }
    if (matchFirstPath && matchFirstPath.length >= 2) {
      path = matchFirstPath[1]
    }
    nativeBase = 'http://' + host + '/'
  }

  const h5Base = './web/index.html?page='
  const isWeb = weex.config.env.platform.toLowerCase() === 'web'
  // in Native
  let base = nativeBase
  if (isWeb) {
    base = h5Base + '/dist/'
  } else {
    base = nativeBase + (path ? path + '/' : '')
  }
  return base + jsFile
}

export function getUrlSearch (url, name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = url.slice(url.indexOf('?') + 1).match(reg)
  if (r != null) {
    try {
      return decodeURIComponent(r[2])
    } catch (_e) {
      return null
    }
  }
  return null
}

export function isEmpty (obj) {
  if (obj == null || obj == '' || obj == 'undefined' || obj == 'null') {
    return true
  }
  if (obj.length > 0) return false
  if (obj.length === 0) return true
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false
  }
  return true
}

export function whichPlatform () {
  return weex.config.env.platform.toLowerCase()
}
