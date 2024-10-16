// src/services/wordListApi.ts
import axios from "axios";
import { API_BASE_URL } from "../config";

export interface WordListOwner {
  name: string;
  group_id?: number;
  role?: string;
  email?: string;
  user_id?: number;
}

export interface GroupAccess {
  id: number;
  name: string;
}

export interface WordList {
  id: number;
  name: string;
  owner: WordListOwner;
  words: string[];
  permission: string;
  groups_access: GroupAccess[];
}

export interface WordListResponse {
  word_lists: WordList[];
}

export const wordListApi = {
  getAllWordLists: async (token: string): Promise<WordList[]> => {
    try {
      const response = await axios.get<WordListResponse>(
        `${API_BASE_URL}word_lists/word_lists/show_all_word_lists/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.word_lists;
    } catch (error) {
      console.error("Error fetching word lists:", error);
      throw error;
    }
  },

  createWordList: async (
    token: string,
    wordListData: Omit<
      WordList,
      "id" | "owner" | "permission" | "groups_access"
    >
  ): Promise<WordList> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}word_lists/word_lists/`,
        wordListData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating word list:", error);
      throw error;
    }
  },

  updateWordList: async (
    token: string,
    wordListId: number,
    wordListData: Partial<WordList>
  ): Promise<WordList> => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}word_lists/word_lists/${wordListId}/`,
        wordListData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating word list:", error);
      throw error;
    }
  },

  deleteWordList: async (token: string, wordListId: number): Promise<void> => {
    try {
      await axios.delete(
        `${API_BASE_URL}word_lists/word_lists/${wordListId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Error deleting word list:", error);
      throw error;
    }
  },
};
