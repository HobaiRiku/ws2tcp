// 这个客户端用于连接server，根据配置监听一个端口，当程序访问端口时
// 通过ws库，创建ws连接到wsServer，由wsServer创建tcp连接到目标地址
// 并代理回当前访问的socket中，实现ws代理tcp的功能

// 运行需要指定参数 -c config.json
// 如 node client.mjs -c config.json

// 获取-c后面的参数
const args = process.argv.slice(2)
const configFilePath = args[1]
if (!configFilePath) {
  console.error('Need config file')
  process.exit(1)
}
// 读取配置文件
import {readFileSync} from 'fs'
let config
try {
  config = JSON.parse(readFileSync(configFilePath, 'utf-8'))
} catch (err) {
  console.error('Read config file error:', err.message)
  process.exit(1)
}
// 储存客户端鉴权信息
const clientId = config.clientId
const clientSecret = config.clientSecret
// 本客户端的目标信息（目前一个进程只支持一个target）
const target = config.target
const server = config.server
// client忽略证书错误
const sslRejectUnauthorized = config.sslRejectUnauthorized === undefined ? 
  false : config.sslRejectUnauthorized


// 创建本地listen的TCP服务器
import {createServer} from 'net'
import WebSocket, {createWebSocketStream} from 'ws'
import {aesEncrypt} from './utils/aes.mjs'

const tcpServer = createServer()

tcpServer.on('connection', function (socket) {
  let wsStreamUp = false;
  const beforeWsStreamUpDataCache = []
  let ws;
  socket.on('data', function (data) {
    if (wsStreamUp) {
      return;
    }
    beforeWsStreamUpDataCache.push(data)
  })
  const socketInfo = {
    ip: socket.remoteAddress,
  }
  console.info(`New connection connected`, socketInfo)
  // 创建ws连接
  const protocol = server.wss ? 'wss' : 'ws'
  let wsStream
  // 需要定时ping，否则NAT设备会断开ws的长连接
  let pingInterval
  // 添加一个随机字符串作为clientConnectionId，这个将会在server端进行保存，断开时清除
  // 确保clientConnectionId的唯一性阻止重放攻击
  const clientConnectionId = Math.random().toString(36).slice(2)
  const auth = `${clientId}:${clientSecret}:${target.targetHost}:${target.targetPort}:${clientConnectionId}`
  let command = ''
  try {
    command = aesEncrypt(auth, server.aesKey)
    command = encodeURIComponent(command)
  } catch (err) {
    console.error('Decrypt auth error:', err.message, socketInfo)
    socket.end()
    return
  }
  const wsUrl = 
    `${protocol}://${server.host}:${server.port}${server.path}?command=${command}`
  // console.debug('connect url:', wsUrl, socketInfo)
  ws = new WebSocket(wsUrl, {
    rejectUnauthorized: sslRejectUnauthorized
  })
  // 出现错误，端开所有连接
  ws.on('error', err => {
    socket.end()
    wsStream?.end()
    ws.close()
    clearInterval(pingInterval)
    console.info('ws error: ',err.message, socketInfo)
  })
  ws.on('close', () => {
    socket.end()
    wsStream?.end()
    clearInterval(pingInterval)
    console.info('Close connection due to ws close', socketInfo)
  })
  ws.on('open', () => {
    // 定时ping
    pingInterval = setInterval(() => {
      ws.ping()
    }, 20_000)
  })
  // 监听消息是否收到streamUp，收到后开始转发数据
  ws.on('message', message => {
    if (message.toString() === 'streamUp') {
      console.info('ws streamUp message found, start pipe', socketInfo)
      wsStream = createWebSocketStream(ws)
      wsStreamUp = true
      wsStream.pipe(socket)
      // 发送之前缓存的数据
      while (beforeWsStreamUpDataCache.length) {
        ws.send(beforeWsStreamUpDataCache.shift())
      }
      socket.pipe(wsStream)
    }
  })
  socket.on('error', err => {
    wsStream?.end()
    socket.end()
    ws.close()
    clearInterval(pingInterval)
    console.info('Close connection due to socket error', err.message, socketInfo)
  })
  socket.on('end', () => {
    wsStream?.end()
    socket.end()
    ws.close()
    clearInterval(pingInterval)
    console.info('Close connection due to socket end', socketInfo)
  })
})

tcpServer.listen(target.listen, function () {
  console.info(`Client start, local socket listen on ${target.listen}`)
})
