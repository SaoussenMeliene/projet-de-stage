import { api } from '../lib/axios';

export const messageService = {
  async getGroupMessages(groupId) {
    return api.get(`/messages/group/${groupId}`);
  },
  async sendMessage(groupId, { content = '', mediaUrl = '', mediaType = '' }) {
    return api.post(`/messages/group/${groupId}`, { content, mediaUrl, mediaType });
  },
};

export const uploadService = {
  async uploadImage(file) {
    const form = new FormData();
    form.append('image', file);
    return api.post('/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};