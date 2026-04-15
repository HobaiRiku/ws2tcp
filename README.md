# 一个websocket转tcp的代理工具

如果服务前面挂了 nginx 之类的反向代理，客户端 IP 需要从转发头里取，不能直接用 socket 的 remoteAddress。

服务端配置里增加：

```json
{
	"trustProxy": true
}
```

开启后，服务端会按下面顺序取客户端 IP：

1. `X-Forwarded-For` 的第一个地址
2. `X-Real-IP`
3. TCP 连接的 `remoteAddress`

nginx 需要把真实 IP 透传过来，例如：

```nginx
location /connect {
		proxy_pass http://127.0.0.1:3005;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

注意：只有在服务端只接受受信任代理转发流量时，才应该打开 `trustProxy`，否则客户端可以伪造这些请求头。
