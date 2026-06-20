# Lunes Node

Lunes Host 平台代理节点部署脚本集合，支持多种协议和平台。

## 项目结构

```
Lunes-node/
├── lunes-host/          # Lunes Host 部署脚本
│   ├── setup.js         # 主部署脚本（修改此文件配置）
│   ├── app.js           # 进程管理器
│   ├── package.json     # Node.js 配置
│   └── README.md        # 详细文档
├── claw-cloud/          # Claw Cloud 部署脚本
├── cto-new/             # CTO New 部署脚本
├── google-idx/          # Google IDX 部署脚本
├── hugging-face/        # Hugging Face 部署脚本
├── waifly-host/         # Waifly Host 部署脚本
├── webhostmost/         # Webhostmost 部署脚本
└── xserver-games/       # XServer Games 部署脚本
```

## 快速开始

### Lunes Host

1. 进入 `lunes-host/` 目录
2. 编辑 `setup.js` 填入你的配置
3. 上传文件到 Lunes 面板
4. 设置启动命令为 `node setup.js`
5. 重启容器

详细步骤请查看 [lunes-host/README.md](lunes-host/README.md)

## 支持的协议

- **VLESS + Reality** - 抗封锁能力强
- **Hysteria2** - 基于 QUIC，弱网表现好

## 注意事项

1. 免费计划资源有限，适合轻度使用
2. 服务条款禁止托管代理服务，账号有风险
3. 建议定期备份连接信息

## 许可证

MIT License
