const { MTProto } = require('telegram-mtproto')
const { Storage } = require('mtproto-storage-fs')
const config = require('../config.js')

console.log(config.spawnIndex)

function getInstance() {
  const api = {
    layer: 57,
    initConnection: 0x69796de9,
    api_id: config.app.id
  }
  const app = {
    storage: new Storage('./storage/storage'+ config.spawnIndex +'.json')
  }
  const server = { webogram: true, dev: false }
  return telegram = MTProto({ server, api, app })
}

module.exports = getInstance()
