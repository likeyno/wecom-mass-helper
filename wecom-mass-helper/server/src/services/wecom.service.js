const axios = require('axios');
const { wecom } = require('../config/env');
const logger = require('../utils/logger');

class WeComService {
  constructor() {
    this.accessToken = null;
    this.tokenExpireTime = 0;
  }

  async getAccessToken() {
    if (this.accessToken && Date.now() < this.tokenExpireTime) {
      return this.accessToken;
    }

    try {
      const response = await axios.get(wecom.tokenUrl, {
        params: {
          corpid: wecom.corpId,
          corpsecret: wecom.secret,
        },
      });

      if (response.data.errcode !== 0) {
        throw new Error(`获取access_token失败: ${response.data.errmsg}`);
      }

      this.accessToken = response.data.access_token;
      this.tokenExpireTime = Date.now() + (response.data.expires_in - 300) * 1000;
      logger.info('获取企业微信access_token成功');
      return this.accessToken;
    } catch (error) {
      logger.error('获取企业微信access_token失败:', error.message);
      throw error;
    }
  }

  async uploadMedia(filePath, fileType) {
    const token = await this.getAccessToken();
    try {
      const response = await axios.post(wecom.uploadUrl, null, {
        params: {
          access_token: token,
          type: fileType || 'file',
        },
        data: require('fs').createReadStream(filePath),
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.errcode !== 0) {
        throw new Error(`上传素材失败: ${response.data.errmsg}`);
      }

      logger.info(`上传素材成功, media_id: ${response.data.media_id}`);
      return response.data.media_id;
    } catch (error) {
      logger.error('上传素材失败:', error.message);
      throw error;
    }
  }

  buildTextMessage(chatId, content) {
    return {
      touser: chatId,
      msgtype: 'text',
      agentid: parseInt(wecom.agentId),
      text: {
        content: content,
      },
      safe: 0,
    };
  }

  buildImageTextMessage(chatId, title, description, url, picUrl) {
    return {
      touser: chatId,
      msgtype: 'news',
      agentid: parseInt(wecom.agentId),
      news: {
        articles: [
          {
            title: title,
            description: description || '',
            url: url || '',
            picurl: picUrl || '',
          },
        ],
      },
    };
  }

  buildFileMessage(chatId, mediaId) {
    return {
      touser: chatId,
      msgtype: 'file',
      agentid: parseInt(wecom.agentId),
      file: {
        media_id: mediaId,
      },
      safe: 0,
    };
  }

  async sendMessage(messagePayload) {
    const token = await this.getAccessToken();
    try {
      const response = await axios.post(wecom.sendUrl, messagePayload, {
        params: { access_token: token },
      });

      if (response.data.errcode !== 0) {
        throw new Error(`发送消息失败: ${response.data.errmsg} (errcode: ${response.data.errcode})`);
      }

      logger.info(`消息发送成功, chatId: ${messagePayload.touser}, msgtype: ${messagePayload.msgtype}`);
      return response.data;
    } catch (error) {
      logger.error('发送消息失败:', error.message);
      throw error;
    }
  }

  async sendToGroup(chatId, template) {
    let messagePayload;

    switch (template.msgType) {
      case 1:
        messagePayload = this.buildTextMessage(chatId, template.content);
        break;
      case 2:
        messagePayload = this.buildImageTextMessage(
          chatId,
          template.title,
          template.description,
          template.fileUrl,
          template.mediaIds?.[0]
        );
        break;
      case 3:
        messagePayload = this.buildFileMessage(chatId, template.mediaIds?.[0]);
        break;
      default:
        throw new Error(`不支持的消息类型: ${template.msgType}`);
    }

    return this.sendMessage(messagePayload);
  }
}

module.exports = new WeComService();
