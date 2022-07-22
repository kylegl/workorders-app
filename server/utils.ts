/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
const capFirst = (string: string | undefined) => {
  if (!string) return
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

const parseStringToDelta = (string?: string) => {
  if (!string) return ''
  return JSON.stringify({ ops: [{ insert: `${string}\n` }] })
}

const parseDateStringToUnix = (date?: Date) => {
  if (!date) return
  // get unix from date object
  const dateObj = new Date(date)
  return dateObj.getTime()
}

const normalize = (data: unknown) => {
  if (typeof data !== 'string') return
  return data.toLowerCase().trim().replace(/\s\s+/g, ' ')
}

const titleCase = (string?: string) => {
  if (!string) return

  const arr = string.split(' ')
  const formatted = arr.map(word => capFirst(word))
  return formatted.join(' ')
}

const isEmptyObject = ({ obj }) => JSON.stringify(obj) === '{}'

const isObject = (value: any) => typeof value === 'object'

const isStringObject = (value: string) => /^[{\[].*[}\]]$/g.test(value)

const stringify = (value: any) => JSON.stringify(value)

const wait = (condtion: boolean): void => {
  // eslint-disable-next-line no-unmodified-loop-condition
  while (condtion)
    Utilities.sleep(500)
}

const unlockAll = () => {
  const props = getScriptProps()
  const unlockedProps = { ...props }

  Object.keys(props).forEach((key) => {
    const isLock = key.endsWith('_locked')

    if (isLock)
      unlockedProps[key] = false
  })

  setScriptProps(unlockedProps)
}

const getUuid = () => Utilities.getUuid()

const setTableVersion = ({ table }) => {
  const uuid: UuidType = getUuid()
  setScriptProp({ key: table, value: uuid })

  return uuid
}

// ex. {props: {someKey: value, someOtherKey: value}}
const setCacheProps = ({ props }) => {
  for (const prop in props) {
    if (isObject(props[prop])) props[prop] = stringify(props[prop])
    Cache().put(prop, props[prop])
  }
}

const setScriptProp = ({ key, value }) => {
  if (typeof value === 'object') value = JSON.stringify(value)
  scriptPropService()
    .setProperty(key, value)
}

const setScriptProps = (props: any) => scriptPropService().setProperties(props)

const packer = ({ table }) => {
  const sheetInterface = getSheetInterface({ sheetName: table })
  return getPack({ sheetInterface })
}

// GETTER
const getSS = ({ id }: { id?: string } = {}) => id
  ? SpreadsheetApp.openById(id)
  : SpreadsheetApp.openById('1J5E6F62xI6_eE_DNbkqn_I5yJHXnGpXsfg5kjOvgyV8')

const getSheet = ({ id, sheetName }: SheetInterfaceParams) => getSS({ id }).getSheetByName(sheetName)

const getSheetInterface = ({ id, sheetName }: SheetInterfaceParams) => {
  return new cUseful.Fiddler(getSheet({ id, sheetName }))
}

const getPack = ({ sheetInterface }) => {
  const sheet = sheetInterface.getSheet()
  const sheetName = sheet.getName()

  return {
    version: getScriptProp({ prop: sheetName }),
    table: sheetName,
    data: sheetInterface.getData(),
  }
}

const scriptPropService = () => PropertiesService
  .getScriptProperties()

const getScriptProps = () => scriptPropService()
  .getProperties()

const getScriptProp = ({ prop }) => scriptPropService().getProperty(prop)

const Cache = () => CacheService.getScriptCache()

const getCacheProp = ({ prop }) => {
  try {
    const res = Cache().get(prop)

    return isStringObject(res) ? JSON.parse(res) : res
  }
  catch (err) {
    return res
  }
}
