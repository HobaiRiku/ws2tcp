// 这个server将架设一个websocket服务
// 并且通过请求连接中携带的信息，相目标创建tcp连接，实现websocket到tcp的转发
// 请求连接使用参数?command携带账号密码、以及所要发起的tcp连接的目标地址

// 获取-c后面的参数
const args = process.argv.slice(2);
const configFilePath = args[1];
if (!configFilePath) {
  console.error("Need config file");
  process.exit(1);
}
// 读取配置文件
import { readFileSync } from "fs";
let config;
try {
  config = JSON.parse(readFileSync(configFilePath, "utf-8"));
} catch (err) {
  console.error("Read config file error:", err.message);
  process.exit(1);
}

// 设置允许的客户端信息
const clientList = config.clientList;
// ws的path
const wsPath = config.wsPath;
// ws的host校验
const wsHost = config.wsHost;

const httpListenPort = config.httpListenPort;
// 监听地址，默认127.0.0.1
const httpListenAddress = config.httpListenAddress || "127.0.0.1";

const aesKey = config.aesKey;

// 是否启用端对端加密，默认启用加密
const useEncryption = Boolean(config.useEncryption === undefined ? true : config.useEncryption);

// 直接开启wss
const ssl = Boolean(config.ssl);
const sslCert = config.sslCert;
const sslKey = config.sslKey;

// 由于要手动验证和升级连接，自己创建httpserver
import { createServer } from "http";
import { createServer as createSslServer } from "https";
import { WebSocketServer, createWebSocketStream } from "ws";
import { createConnection } from "net";
import {
  aesDecrypt,
  aesEncrypt,
  createStreamUpFrame,
  DebugStream,
  DecryptStream,
  EncryptStream,
} from "./utils/aes.mjs";
import { randomBytes, createCipheriv, createDecipheriv } from "crypto";
let httpServer = createServer();

// 每次ws请求都进行保存，并且连接时判断唯一性，确保断开后清除，目的是防止重放攻击
const clientConnectionIdList = [];
if (ssl) {
  httpServer = createSslServer({
    cert: readFileSync(sslCert, { encoding: "utf-8" }),
    key: readFileSync(sslKey, { encoding: "utf-8" }),
  });
}

const wsServer = new WebSocketServer({ noServer: true });

function onSocketError(err) {
  console.error(err);
}

wsServer.on("connection", function connection(ws, request, clientConnection) {
  const { clientId, targetHost, targetPort, clientIp } = clientConnection;
  console.info("New connection connected", {
    clientId,
    clientIp,
    targetHost,
    targetPort,
  });
  // 保存clientConnectionId
  clientConnectionIdList.push(clientConnection.clientConnectionId);
  clientConnection.clientWsSocket = ws;
  clientConnection.clientWsSocket.on("error", console.error);
  // 创建ws双工流转发数据
  const wsStream = createWebSocketStream(ws);
  clientConnection.wsStream = wsStream;
  // 增加 wsStream error 事件监听，防止未捕获异常
  wsStream.on("error", (err) => {
    console.error("wsStream error:", err);
  });
  // 创建目标tcp连接
  const targetTcpSocket = createConnection({
    host: clientConnection.targetHost,
    port: clientConnection.targetPort,
  });
  clientConnection.targetTcpSocket = targetTcpSocket;
  // 创建端对端加密的key和iv
  const endToEndKey = randomBytes(32);
  // 创建streamUp桢
  const streamUpFrame = createStreamUpFrame(useEncryption, endToEndKey);
  // 设定pipe
  if (useEncryption) {
    // 使用端对端加密
    // 创建调试层
    // const debugIncoming = new DebugStream("Incoming");
    // const debugOutgoing = new DebugStream("Outgoing");
    const encryptStream = new EncryptStream(endToEndKey);
    const decryptStream = new DecryptStream(endToEndKey);
    wsStream
      .pipe(decryptStream)
      // .pipe(debugIncoming)
      .pipe(clientConnection.targetTcpSocket)
      // .pipe(debugOutgoing)
      .pipe(encryptStream)
      .pipe(wsStream);
    // 处理加密解密错误
    decryptStream.on("error", function (err) {
      console.error("Decrypt error", err);
      ws.close();
      decryptStream.end();
    });
    encryptStream.on("error", function (err) {
      console.error("Encrypt error", err);
      ws.close();
      encryptStream.end();
    });
  } else {
    // 使用明文传输
    wsStream.pipe(clientConnection.targetTcpSocket).pipe(wsStream);
  }

  targetTcpSocket.on("error", function (err) {
    // 出现错误，停止转发数据和ws连接
    targetTcpSocket.end();
    clientConnection.clientWsSocket?.close();
    clientConnection.wsStream?.end();
    console.info(`Close all connection due to TCP error: ${err.message}`, {
      clientId,
      clientIp,
      targetHost,
      targetPort,
    });
    removeClientConnectionId(clientConnection.clientConnectionId);
  });
  targetTcpSocket.on("connect", function () {
    console.info(
      `TCP connection stream created ->`,
      `${targetHost}:${targetPort}`
    );
    // 成功创建tcp连接，开始转发数据
    // 告知客户端可以开始pipe了
    if (ws.readyState === ws.OPEN) {
      ws.send(aesEncrypt(streamUpFrame, aesKey));
    } else {
      console.warn("WebSocket not open, cannot send streamUpFrame");
    }
  });
  // 监听关闭， 这里经过测试发现任意一遍关闭都会导致另一边关闭，所以只需要监听一边即可
  // clientConnection.targetTcpSocket.on('end', ()=>{
  //   doClose('tcp end')
  // })
  clientConnection.clientWsSocket.on("close", () => {
    doClose("ws close");
  });
  function doClose(reason) {
    // 为了保险，全部都关闭一遍
    clientConnection.wsStream?.end();
    clientConnection.targetTcpSocket?.end();
    clientConnection.clientWsSocket?.close();
    clientConnection.wsStream = null;
    clientConnection.targetTcpSocket = null;
    clientConnection.clientWsSocket = null;
    console.info(`connection closed`, {
      clientId,
      clientIp,
      targetHost,
      targetPort,
    });
    removeClientConnectionId(clientConnection.clientConnectionId);
  }
});

// 其他请求，返回404
httpServer.on("request", function request(req, res) {
  // 不是upgrade请求且不是wsPath，返回404
  const path = new URL(req.url, `http://${req.headers.host}`).pathname;
  const isUpgrade =
    req.headers.upgrade && req.headers.upgrade.toLowerCase() === "websocket";
  if (path !== wsPath || !isUpgrade) {
    res.writeHead(404);
    res.end(
      JSON.stringify({
        msg: "Not found",
        code: 404,
      })
    );
  }
});

function removeClientConnectionId(clientConnectionId) {
  const index = clientConnectionIdList.indexOf(clientConnectionId);
  if (index >= 0) {
    clientConnectionIdList.splice(index, 1);
  }
}

httpServer.on("upgrade", function upgrade(request, socket, head) {
  // 检查wsPath（不包含query参数）
  const url = new URL(request.url, `http://${request.headers.host}`);
  const path = url.pathname;
  if (path !== wsPath) {
    socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    socket.destroy();
    return;
  }

  // 检查wsHost（如果配置了的话）
  if (wsHost && wsHost.trim() !== "") {
    const requestHost = request.headers.host;
    // 去掉端口号进行比较
    const hostWithoutPort = requestHost ? requestHost.split(':')[0] : '';
    if (hostWithoutPort !== wsHost) {
      console.info(`Host validation failed: expected ${wsHost}, got ${hostWithoutPort}`);
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      socket.destroy();
      return;
    }
  }

  socket.on("error", onSocketError);

  // 校验连接参数
  authenticate(request, function next(err, clientConnection) {
    clientConnection.clientIp = socket.remoteAddress;
    const { clientId, clientIp } = clientConnection;
    let clientInfo = `[clientId: ${
      clientId || "unknown"
    }, clientIp: ${clientIp}]`;
    if (err) {
      console.info(`${clientInfo} authenticate error:`, err.message);
      socket.write(`HTTP/1.1 401 Unauthorized: ${err.message} \r\n\r\n`);
      socket.destroy();
      return;
    }
    socket.removeListener("error", onSocketError);
    wsServer.handleUpgrade(request, socket, head, function done(ws) {
      wsServer.emit("connection", ws, request, clientConnection);
    });
  });
});

httpServer.listen(httpListenPort, httpListenAddress);
console.log(
  `Http websocket server listen on ${httpListenAddress}:${httpListenPort} ${ssl ? "with ssl" : ""}`
);

function authenticate(request, cb) {
  // 从地址栏获取参数command
  const command = new URL(
    request.url,
    `http://${request.headers.host}`
  ).searchParams.get("command");
  const clientTemp = {};
  // 解密参数
  let auth = "";
  try {
    auth = aesDecrypt(decodeURIComponent(command), aesKey);
  } catch (err) {
    cb(new Error("decrypt command error"), clientTemp);
    return;
  }
  if (!auth) {
    cb(new Error("no auth info"), clientTemp);
    return;
  }
  const [
    clientId,
    clientSecret,
    targetHost,
    targetPortSrt,
    clientConnectionId,
  ] = auth.split(":");
  const targetPort = parseInt(targetPortSrt, 10);
  const client = clientList.find(
    (c) => c.clientId === clientId && c.clientSecret === clientSecret
  );

  // 追加client信息
  Object.assign(clientTemp, {
    clientId,
    clientId,
    targetHost,
    targetPort,
    clientConnectionId,
  });

  if (!client) {
    cb(new Error("invalid client"), clientTemp);
    return;
  }
  // 校验clientConnectionId
  if (clientConnectionIdList.includes(clientConnectionId)) {
    cb(new Error("clientConnectionId already exists"), clientTemp);
    return;
  }
  // 校验端口是否为数字
  if (isNaN(targetPort)) {
    cb(new Error("invalid target port"), clientTemp);
    return;
  }
  // 校验host和port是否正确
  if (!targetHost || !targetPort) {
    cb(new Error("invalid target"), clientTemp);
    return;
  }
  // port 范围校验
  if (targetPort < 0 || targetPort > 65535) {
    cb(new Error("invalid target port"), clientTemp);
    return;
  }
  cb(
    null,
    Object.assign(clientTemp, {
      // 每次客户端发起的一个连接请求都会生成一个clientConnection
      // 客户端id，用于后续记录
      clientId: client.clientId,
      targetHost,
      targetPort,
      targetTcpSocket: null,
      clientWsSocket: null,
      clientConnectionId,
    })
  );
}
