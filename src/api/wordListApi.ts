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

export interface WordOperationResponse {
  message: string;
  word: string;
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

  // Added getWordList method
  getWordList: async (token: string, wordListId: string | number): Promise<WordList> => {
    try {
      // First try to find the word list in the full list
      const allLists = await wordListApi.getAllWordLists(token);
      const wordList = allLists.find(list => list.id === Number(wordListId));
      
      if (!wordList) {
        throw new Error("Word list not found");
      }

      return wordList;
    } catch (error) {
      console.error("Error fetching word list:", error);
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

  addWord: async (
    token: string,
    wordListId: number,
    word: string
  ): Promise<WordOperationResponse> => {
    try {
      console.log("Making API call to add word:", {
        wordListId,
        word,
        endpoint: `${API_BASE_URL}word_lists/word_lists/add_word_to_list/`,
      });

      const response = await axios.post<WordOperationResponse>(
        `${API_BASE_URL}word_lists/word_lists/add_word_to_list/`,
        {
          word_list_id: wordListId,
          word: word.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Add word response:", response.data);

      if (!response.data) {
        throw new Error("No data received from server");
      }

      // Check if we have a valid response with message and word
      if (response.data.message && response.data.word) {
        return response.data;
      }

      throw new Error("Invalid response format from server");
    } catch (error: any) {
      console.error("Detailed add word error:", error);

      // Handle specific API error responses
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      // Handle validation errors (422)
      if (error.response?.status === 422) {
        throw new Error(
          error.response.data.detail || "Validation error occurred"
        );
      }

      throw new Error(error.message || "Failed to add word");
    }
  },

  deleteWord: async (
    token: string,
    wordListId: number,
    word: string
  ): Promise<WordOperationResponse> => {
    try {
      console.log("Delete word request:", {
        word_list_id: wordListId,
        word: word,
      });

      const response = await axios<WordOperationResponse>({
        method: "DELETE",
        url: `${API_BASE_URL}word_lists/word_lists/remove_word_from_list/`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          word_list_id: wordListId,
          word: word.trim(),
        },
      });

      console.log("Delete word response:", response.data);

      // Check if we have a valid response with message and word
      if (response.data.message && response.data.word) {
        return response.data;
      }

      throw new Error("Invalid response format from server");
    } catch (error: any) {
      console.error("Delete word error details:", {
        error,
        response: error.response,
        data: error.response?.data,
      });

      // Handle specific error cases
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      if (error.response?.status === 400) {
        throw new Error(error.response.data.error || "Invalid request data");
      }

      if (error.response?.status === 500) {
        throw new Error("Server error occurred. Please try again later.");
      }

      throw new Error(
        error.response?.data?.error || error.message || "Failed to delete word"
      );
    }
  },
};