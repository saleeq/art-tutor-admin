import { create } from "zustand";

interface Group {
  id: number;
  name: string;
  is_private: boolean;
  member_limit: number;
  group_profile_image: string;
  role: {
    id: number;
    role_name: string;
  };
}

interface GroupState {
  selectedGroup: Group | null;
  setSelectedGroup: (group: Group) => void;
}

export const useGroupStore = create<GroupState>((set) => ({
  selectedGroup: null,
  setSelectedGroup: (group) => set({ selectedGroup: group }),
}));
