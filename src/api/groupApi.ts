// src/services/groupApi.ts
import axios from "axios";

import { API_BASE_URL } from "../config";

export interface StudentGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
}

export const groupApi = {
  getGroups: async (token: string): Promise<StudentGroup[]> => {
    const response = await axios.get(`${API_BASE_URL}/groups`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  createGroup: async (
    token: string,
    groupData: Omit<StudentGroup, "id" | "memberCount" | "createdAt">
  ): Promise<StudentGroup> => {
    const response = await axios.post(`${API_BASE_URL}/groups`, groupData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateGroup: async (
    token: string,
    groupId: string,
    groupData: Partial<StudentGroup>
  ): Promise<StudentGroup> => {
    const response = await axios.put(
      `${API_BASE_URL}/groups/${groupId}`,
      groupData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  deleteGroup: async (token: string, groupId: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/groups/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
