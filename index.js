const config = require('./config.js')
config.spawnIndex = 0;

const login = require('./modules/login')
const { getChat, chatHistory, searchUsers, getUsers, getChannel, resolveUser, addUsers } = require('./modules/chat-history')

const run = async() => {
  const first_name = await login()
  console.log(first_name);
  const chat = await getChat()
  const history = await chatHistory(chat)
  console.log(history);

  const users = await getUsers(chat);
  console.log(users)
  const user = await resolveUser('bitfairhq');

  const channel = await getChannel(user.chats[0].id, user.chats[0].access_hash);
  console.log(channel.users.length)

  const chat = await resolveUser('testnawazkhali');
  const user = await resolveUser('chloe16');
  console.log(chat)
  let inputUser = {
    _: 'inputUser',
    user_id: user.users[0].id,
    access_hash: user.users[0].access_hash
  };
  let inputPeer = {
     _  : 'inputPeerChannel',
    channel_id : chat.chats[0].id,
    access_hash: chat.chats[0].hash
  };
  console.log(chat.chats[0].id)
  var obj = {
    chat_id: chat.chats[0].id,
    user_id: inputUser,
  }
  const add = await addUsers(obj);
  console.log(add)
  let inputUser = {
    _: 'inputUser',
    user_id: user.users[0].id,
    access_hash: user.users[0].access_hash
  };
  let inputChannel = {
    _: 'inputChannel',
    channel_id: chat.chats[0].id,
    access_hash: chat.chats[0].access_hash
  };
  const b = await addUsers(inputChannel,[inputUser]);

}

run().catch(function(e) {
  console.log(e)
  console.log('@@@@@@@ run error @@@@@@@')
})

process.on('uncaughtException', (err) => {
  console.log('whoops! there was an error');
});
