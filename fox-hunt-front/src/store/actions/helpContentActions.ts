import { createAsyncThunk } from '@reduxjs/toolkit';

import { helpContentAPI } from 'src/api/admin';
import type { Article, Topic } from 'src/types/HelpContent';
import * as helpContentTypes from './types/helpContentTypes';

export const getHelpContents = createAsyncThunk(
  helpContentTypes.GET_HELP_CONTENTS,
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await helpContentAPI.get('/');
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const updateAllHelpContents = createAsyncThunk(
  helpContentTypes.UPDATE_ALL_HELP_CONTENTS,
  async (helpContents, { rejectWithValue }) => {
    try {
      await helpContentAPI.patch('/', helpContents);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const createHelpContentTopic = createAsyncThunk(
  helpContentTypes.CREATE_HELP_CONTENT_TOPIC,
  async (topic, { rejectWithValue }) => {
    try {
      const { data } = await helpContentAPI.post('/topic', topic);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const updateHelpContentTopic = createAsyncThunk(
  helpContentTypes.UPDATE_HELP_CONTENT_TOPIC,
  async (topic, { rejectWithValue }) => {
    try {
      const { data } = await helpContentAPI.put('/topic', topic);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const createHelpContentArticle = createAsyncThunk(
  helpContentTypes.CRAETE_HELP_CONTENT_ARTICLE,
  async (params: { article: Article; topic: Topic }, { rejectWithValue }) => {
    try {
      const { article, topic } = params;
      const response = await helpContentAPI.post(
        `/topic/${topic.id}/article`,
        article,
      );
      const updatedTopic = {
        ...topic,
        articles: [...topic.articles, response.data],
      };
      return updatedTopic;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const updateHelpContentArticle = createAsyncThunk(
  helpContentTypes.UPDATE_HELP_CONTENT_ARTICLE,
  async (params: { article: Article; topic: Topic }, { rejectWithValue }) => {
    try {
      const { article, topic } = params;
      const response = await helpContentAPI.put(
        `/topic/${topic.id}/article`,
        article,
      );
      const updatedArticle = response.data;
      topic.articles = topic.articles.map((article) =>
        article.index === updatedArticle.index ? updatedArticle : article,
      );
      return topic;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const removeHelpContentArticle = createAsyncThunk(
  helpContentTypes.REMOVE_HELP_CONTENT_ARTICLE,
  async (articleId, { dispatch, rejectWithValue }) => {
    try {
      await helpContentAPI.delete(`/article/${articleId}`);
      dispatch(getHelpContents());
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const removeHelpContentTopic = createAsyncThunk(
  helpContentTypes.REMOVE_HELP_CONTENT_TOPIC,
  async (topicId, { dispatch, rejectWithValue }) => {
    try {
      await helpContentAPI.delete(`/topic/${topicId}`);
      dispatch(getHelpContents());
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
