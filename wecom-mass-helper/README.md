# 企业微信群发助手

基于 Node.js + Express + Vue 3 的企业微信群发管理工具。

## 技术栈

- **后端**: Node.js, Express, Sequelize, MySQL, node-cron
- **前端**: Vue 3, Vite, Element Plus, Axios
- **企业微信**: 服务端API（消息推送、素材上传）

## 功能特性

- 消息模板管理（文本、图文、文件三种类型）
- 群发任务管理（创建、查看、重试）
- 定时发送支持
- 发送记录追踪
- 任务状态监控

## 项目结构

```
wecom-mass-helper/
├── server/                 # 后端项目
│   ├── src/
│   │   ├── app.js          # 入口文件
│   │   ├── config/         # 配置文件
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # 路由定义
│   │   ├── controllers/    # 控制器
│   │   ├── services/       # 业务逻辑（企业微信API封装）
│   │   ├── middleware/     # 中间件
│   │   ├── jobs/           # 定时任务
│   │   └── utils/          # 工具函数
│   ├── .env                # 环境变量
│   └── package.json
├── client/                 # 前端项目
│   ├── src/
│   │   ├── api/            # API 请求封装
│   │   ├── views/          # 页面组件
│   │   ├── router/         # 路由配置
│   │   ├── stores/         # Pinia 状态管理
│   │   └── main.js         # 入口文件
│   ├── index.html
│   └── package.json
└── README.md
```

## 快速开始

### 1. 环境要求

- Node.js >= 18
- MySQL >= 8.0

### 2. 安装依赖

```bash
# 后端
cd server
npm install

# 前端
cd ../client
npm install
```

### 3. 配置环境变量

编辑 `server/.env`，填写企业微信相关配置：

```env
WECOM_CORP_ID=your_corp_id
WECOM_AGENT_ID=your_agent_id
WECOM_SECRET=your_corp_secret
```

### 4. 初始化数据库

```bash
cd server
npm run init-db
```

### 5. 启动服务

```bash
# 启动后端 (端口 3000)
cd server
npm run dev

# 启动前端 (端口 5173)
cd client
npm run dev
```

访问 http://localhost:5173 即可使用。

## 企业微信配置

1. 登录企业微信管理后台，创建自建应用
2. 获取 CorpID、AgentID、Secret
3. 配置应用的可信域名和IP白名单
4. 在 `.env` 中填入以上信息
5. 确保应用有「发送消息到群聊」权限

## API 接口

### 模板管理
- `GET /api/templates` - 获取模板列表
- `POST /api/templates` - 创建模板
- `GET /api/templates/:id` - 获取模板详情
- `PUT /api/templates/:id` - 更新模板
- `DELETE /api/templates/:id` - 删除模板

### 任务管理
- `GET /api/tasks` - 获取任务列表
- `POST /api/tasks` - 创建任务
- `GET /api/tasks/:id` - 获取任务详情
- `POST /api/tasks/:id/retry` - 重试失败记录

## 许可证

MIT
