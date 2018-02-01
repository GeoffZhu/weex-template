export function initIconfont () {
  let domModule = weex.requireModule('dom')
  domModule.addRule('fontFace', {
    'fontFamily': 'iconfont',
    'src': "url('http://at.alicdn.com/t/font_404010_jgmnakd1zizr529.ttf')"
  })
}

export function getEntryUrl (filename) {
  const bundleUrl = weex.config.bundleUrl
  // const host = /\/\/([^/]+?)\//.exec(bundleUrl)[0]

  const isAndroidAssets = bundleUrl.indexOf('your_current_IP') >= 0 || bundleUrl.indexOf('file://assets/') >= 0
  const isiOSAssets = bundleUrl.indexOf('file:///') >= 0 && bundleUrl.indexOf('.app') > 0

  const isWeb = weex.config.env.platform.toLowerCase() === 'web'
  let url = ''
  if (isWeb) {
    url = `./${filename}.html`
  } else {
    if (isiOSAssets || isAndroidAssets) {
      url = `${bundleUrl.split('bundlejs')[0]}/bundlejs/${filename}.js`
    } else {
      url = `${bundleUrl.split('native')[0]}/native/${filename}.js`
    }
  }
  return url
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
