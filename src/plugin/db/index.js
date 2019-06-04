import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'

const adapter = new LocalStorage(`basketball-admin`)
const db = low(adapter)

db
  .defaults({
    token: '',
  })
  .write()

export default db
