interface SheetInterfaceParams {
  id?: string
  sheetName: string
}

/* eslint-disable @typescript-eslint/no-unused-vars */
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

const getUuid = () => Utilities.getUuid()

// SETTER
const setScriptProp = ({ key, value }) => {
  if (typeof value === 'object') value = JSON.stringify(value)
  scriptPropService()
    .setProperty(key, value)
}

type UuidType = string

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

const setScriptProps = props => scriptPropService().setProperties(props)

// HELPER
const isEmptyObject = ({ obj }) => JSON.stringify(obj) === '{}'

const isObject = value => typeof value === 'object'

const isStringObject = value => /^[{\[].*[}\]]$/g.test(value)

const stringify = value => JSON.stringify(value)

const wait = (condtion: boolean): void => {
  // eslint-disable-next-line no-unmodified-loop-condition
  while (condtion)
    Utilities.sleep(500)
}

function createWorkOrder() {
  const doc = DocumentApp.openById('1MemUzVeGn-EIweHVhiS27sH2ixQPvkZAVV284DBQHkA')
  const body = doc.getBody()
  const tables = body.getTables()

  // make copy of template & place in job folder

  // identify tables

  // insert data into tables

  doc.saveAndClose()
}

const getNumColumns = ({ table }) => table.getRow(0).getNumCells()

const addDataToDocsTable = ({ list, table }) => {
  const numColumns = getNumColumns({ table })

  // TODO need to add logic for entering data, some entries will be blank etc
  list.forEach((entry, index) => {
    row = table.appendTableRow()
    entry.forEach(value => row.appendTableCell(value))
  })
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
