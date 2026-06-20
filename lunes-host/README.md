# Lunes Node - Enhanced Proxy Node

Lunes Host 平台增强版代理节点部署脚本，支持 VLESS + Reality 和 Hysteria2 双协议。

## 功能特性

- **VLESS + Reality** - 抗封锁能力强，伪装成访问 dl.google.com 的正常 HTTPS 流量
- **Hysteria2** - 基于 QUIC 协议，弱网环境下表现优异
- **密钥持久化** - 首次生成后自动保存，重启不会丢失
- **自动重启** - 服务崩溃后自动恢复
- **日志隐藏** - 不记录访问日志，降低被检测风险

## 快速开始

### 一键安装（推荐）

在 Lunes 面板的 **Console** 中执行以下命令：

```bash
curl -s https://raw.githubusercontent.com/wdrma2010/Lunes-node/main/lunes-host/install.sh |
env DOMAIN=node24.lunes.host PORT=3134 UUID=$(cat /proc/sys/kernel/random/uuid) HY2_PASSWORD='YourPassword' bash
```

**参数说明：**
- `DOMAIN` - 你的 Lunes 域名（如 `node24.lunes.host`）
- `PORT` - 你的端口号（如 `3134`）
- `UUID` - 自动生成，也可手动指定
- `HY2_PASSWORD` - Hysteria2 密码，建议修改

安装完成后：
1. 设置启动命令为 `node setup.js`
2. 重启容器
3. 查看 `node.txt` 获取连接链接

### 前置条件

1. 已注册 Lunes Host 账号
2. 已创建容器并获得以下信息：
   - 域名（如 `node24.lunes.host`）
   - 端口号（如 `3134`）

### 部署步骤

#### 1. 上传文件

将以下文件上传到 Lunes 面板的 `/home/container/` 目录：

- `setup.js` - 主部署脚本
- `app.js` - 进程管理器
- `package.json` - Node.js 配置

#### 2. 修改配置

编辑 `setup.js`，修改以下配置项：

```javascript
const UUID = "YOUR_UUID";                    // 你的 UUID
const DOMAIN = "YOUR_DOMAIN.lunes.host";     // 你的域名
const PORT = 3134;                           // 你的端口号
const HY2_PASSWORD = "YOUR_PASSWORD";        // Hysteria2 密码
```

**生成 UUID：**
```bash
cat /proc/sys/kernel/random/uuid
```

#### 3. 设置启动命令

在 Lunes 面板的 **Startup** 页面，将启动命令改为：

```
node setup.js
```

#### 4. 重启容器

在 **Console** 页面点击 **Restart** 重启容器。

#### 5. 获取连接信息

重启后，在 **Files** 页面查看 `node.txt` 文件，里面有完整的连接链接。

## 配置说明

### UUID 生成

```bash
# 在 Lunes Console 中执行
cat /proc/sys/kernel/random/uuid
```

### 端口号

端口号在创建容器时由 Lunes 平台分配，格式为 `节点名.lunes.host:端口号`。

在 **Network** 页面可以查看你的端口号。

### Hysteria2 密码

可以使用任意字符串，建议使用强密码。

## 连接方式

### VLESS + Reality（推荐）

1. 复制 `node.txt` 中的 VLESS 链接
2. 在客户端（v2rayN、Clash、小火箭等）中导入
3. 测试延迟，正常即可使用

**参数说明：**
- `encryption=none` - 无加密（Reality 自带加密）
- `flow=xtls-rprx-vision` - XTLS Vision 流控
- `security=reality` - Reality 安全层
- `sni=dl.google.com` - 伪装域名
- `fp=chrome` - 浏览器指纹

### Hysteria2

1. 复制 `node.txt` 中的 Hysteria2 链接
2. 在客户端中导入
3. 测试延迟，正常即可使用

## 密钥管理

### 首次部署

首次运行时，`setup.js` 会自动生成 REALITY 密钥对并保存到 `keys.json`。

### 重启后

重启容器后，脚本会自动读取 `keys.json` 中的密钥，不会重新生成。

### 重新生成密钥

如需重新生成密钥，删除 `keys.json` 文件后重启容器：

```bash
rm /home/container/keys.json
```

## 常见问题

### Q: 连接不上怎么办？

1. 检查域名和端口是否正确
2. 确认客户端使用的 UUID 与服务器一致
3. 检查防火墙是否放行了端口

### Q: 延迟很高怎么办？

1. 尝试切换到 Hysteria2 协议
2. 检查 Lunes 服务器负载情况
3. 尝试在不同时间段使用

### Q: 密钥丢失了怎么办？

删除 `keys.json` 文件，重启容器会重新生成。但需要重新导入连接链接。

### Q: 如何查看当前配置？

```bash
# 查看连接信息
cat /home/container/node.txt

# 查看 Xray 配置
cat /home/container/xy/config.json

# 查看 Hysteria2 配置
cat /home/container/h2/config.yaml
```

## 注意事项

1. **Lunes 免费计划**资源有限（128MB 内存），高流量下可能不稳定
2. **Lunes 服务条款**明确禁止托管代理服务，账号有被封禁风险
3. **密钥安全** - 不要分享 `keys.json` 文件
4. **定期备份** - 建议备份 `node.txt` 中的连接信息

## 技术支持

如有问题，请在 GitHub Issues 中反馈。

## 许可证

MIT License
