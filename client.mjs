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

// 创建本地listen的TCP服务器
import {createServer} from 'net'
import WebSocket, {createWebSocketStream} from 'ws';

// 注意需要暂停读取连接传输数据，等待ws连接建立
const tcpServer = createServer({pauseOnConnect: true})

tcpServer.on('connection', function (socket) {
  console.info('New connection connected')
  // 创建ws连接
  const protocol = server.wss ? 'wss' : 'ws'
  let wsStream
  // 需要定时ping，否则NAT设备会断开ws的长连接
  let pingInterval
  const ws = new WebSocket(`${protocol}://${server.host}:${server.port}${server.path}?command=${clientId}:${clientSecret}:${target.targetHost}:${target.targetPort}`)
  // 出现错误，端开所有连接
  ws.on('error', (err)=>{
    socket.end()
    wsStream.end()
    ws.close()
    clearInterval(pingInterval)
  })
  ws.on('close', ()=>{
    socket.end()
    wsStream?.end()
    clearInterval(pingInterval)
    console.info('Close connection due to ws close')
  })
  ws.on('open', ()=>{
    // 通过ws创建双工流
    wsStream = createWebSocketStream(ws)
    // 将socket的数据流导入wsStream
    socket.pipe(wsStream).pipe(socket)
    // 恢复socket的数据流
    socket.resume()
    // 定时ping
    pingInterval = setInterval(()=>{
      ws.ping()
    }, 20_000)
  })
  socket.on('error', (err)=>{
    wsStream?.end()
    socket.end()
    ws.close()
    clearInterval(pingInterval)
    console.info('Close connection due to socket error', err.message)
  })
  socket.on('end', ()=>{
    wsStream?.end()
    socket.end()
    ws.close()
    clearInterval(pingInterval)
    console.info('Close connection due to socket end')
  })
  
})

tcpServer.listen(target.listen, function () {
  console.info(`Client start, local socket listen on ${target.listen}`)
})