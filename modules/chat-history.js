const { pluck } = require('ramda')
const { inputField } = require('./fixtures')

const telegram = require('./init')

const getChat = async() => {
  const dialogs = await telegram('messages.getDialogs', {
    limit: 50,
  })
  const { chats } = dialogs
  console.log(dialogs)
  console.log('++++++++++++++++++++++++++++++++++')
  const selectedChat = await selectChat(chats)
  console.log(selectedChat)
  return selectedChat
}

const chatHistory = async chat => {
  const max = 400
  const limit = 100
  let offset = 0
  let full = [],
    messages = []
  do {
    const history = await telegram('messages.getHistory', {
      peer: {
        _: 'inputPeerChannel',
        channel_id: chat.id,
        access_hash: chat.access_hash
      },
      max_id: offset,
      offset: -full.length,
      limit
    })
    messages = history.messages.filter(filterLastDay)
    full = full.concat(messages)
    messages.length > 0 && (offset = messages[0].id)
    messages.length > 0 && console.log(offset, messages[0].id)
  } while (messages.length === limit && full.length < max)
  printMessages(full)
  return full
}

const filterLastDay = ({ date }) => new Date(date * 1e3) > dayRange()

const dayRange = () => Date.now() - new Date(86400000 * 4)

const selectChat = async(chats) => {
  const chatNames = pluck('title', chats)
  console.log('Your chat list')
  console.log(chatNames)
  chatNames.map((name, id) => console.log(`${id}  ${name}`))
  console.log('Select chat by index')
  const chatIndex = await inputField('index')
  return chats[+chatIndex]
}

const filterUsersMessages = ({ _ }) => _ === 'message'

const formatMessage = ({ message, date, from_id }) => {
  const dt = new Date(date * 1e3)
  const hours = dt.getHours()
  const mins = dt.getMinutes()
  return `${hours}:${mins} [${from_id}] ${message}`
}

const printMessages = messages => {
  const filteredMsg = messages.filter(filterUsersMessages)
  const formatted = filteredMsg.map(formatMessage)
  formatted.forEach(e => console.log(e))
  return formatted
}


const searchUsers = async(username) => {
  const results = await telegram('contacts.search', {
    q: username,
    limit: 100,
  })
  return results
}

const resolveUser = async(_user) => {
  const results = await telegram('contacts.resolveUsername', {
    username: _user
  })
  return results
}

const getChannel = async(id, hash) => {
  let inputChannel = {
    _: 'inputChannel',
    channel_id: id,
    access_hash: hash
  };
  var filter = filter || { _: 'channelParticipantsRecent' },
    limit = limit || 200,
    offset = offset || 0;
  const info = await telegram('channels.getParticipants', {
    channel: inputChannel,
    filter: filter,
    offset: offset,
    limit: limit,
    hash: hash
  });
  return info;

}

const getUsers = async(chat) => {

  const inputChannel = {
    _: 'inputChannel',
    channel_id: chat.id,
    access_hash: chat.access_hash
  };

  let cycles;
  let counter = 0;
  let totalUsers = [];

  do {
    const { users, count } = await telegram('channels.getParticipants', {
      channel: inputChannel,
      filter: { _: 'channelParticipantsRecent' },
      offset: counter * 200,
      limit: 200
    })
    counter++;

    if (cycles == null) {
      console.log(`${count} users.`);
      cycles = Math.ceil(count / 200);
    }

    console.log(`Completed ${(counter/cycles*100).toFixed(2)}%`);

    totalUsers = totalUsers.concat(users);
  } while (counter < cycles);

  return totalUsers;

}

const addUsers = async(inputChannel, inputUser) => {
  // console.log(obj)
  // const results = await telegram('messages.addChatUser', obj)
  // return results


  const res = await telegram('channels.inviteToChannel', {
    channel: inputChannel,
    users: inputUser
  })
}


module.exports = {
  getChat,
  chatHistory,
  searchUsers,
  getUsers,
  getChannel,
  resolveUser,
  addUsers
}
