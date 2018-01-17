/**
 * 埋点
 * @param {String} pageName
 *
 * 例子：
 *   import monitorFactory from '../tools/monitor'
 *   const pageMonitor = monitorFactory('registration_page_firs_step')
 *   pageMonitor(eventId, {})
 */
export default function monitorFactory (pageName) {
  return function (eventId, params = {}) {
    Object.assign(params, {
      page_name: pageName
    })
    console.log(pageName, eventId, params)
    try {
      weex.requireModule('LogModule') && weex.requireModule('LogModule').clickEvent(eventId, params)
    } catch (err) {
      console.error(err)
    }
  }
}
