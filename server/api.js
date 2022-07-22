/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
// SpreadsheetApp.getUi()
// DriveApp.getRootFolder()
// UrlFetchApp.fetch()
// DocumentApp.getui()

const doGet = () => HtmlService.createTemplateFromFile('index').evaluate()

const WhiteListedActions = (() => {
  const keyStore = keystore.newKeyStore()

  // whitelist
  keyStore.setStore('requestHandler', (...args) => requestHandler(...args))

  return keyStore
})()

const runWhitelist = (name, ...args) => {
  // get what to run from the store
  const action = WhiteListedActions.getStore(name)
  if (!action)
    throw new Error(`${name} is not in the list of actions that can be run from the client`)

  return action (...args)
}
