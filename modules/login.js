const telegram = require('./init')
const { inputField } = require('./fixtures')
const config = require('../config.js')

const login = async () => {
  try {
    const phone = config.phones[config.spawnIndex]
    const { phone_code_hash } = await telegram('auth.sendCode', {
            phone_number  : phone,
            current_number: false,
            api_id        : config.app.id,
            api_hash      : config.app.hash
    })
    const code = await inputField('code')
    console.log(code);
    const res = await telegram('auth.signIn', {
      phone_number: phone,
      phone_code_hash,
      phone_code  : code
    })
    const { user } = res
    const {
      first_name = '',
      username = ''
    } = user
    console.log('signIn', first_name, username, user.phone)
    return first_name
  } catch (error) {
    console.error(error)
  }
}

module.exports = login