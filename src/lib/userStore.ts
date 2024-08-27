import { selectedUserState, userState } from "@/types";

import { createWithEqualityFn } from "zustand/traditional";

export const useUser = createWithEqualityFn<userState>((set) => ({
  myUser: undefined,
  setUser: (user) => set({ myUser: user }),
  resetUser: () => set({ myUser: null }),
}));
export const useAllUsers = createWithEqualityFn((set) => ({
  users: undefined,
  setUsers: (users: any) => set({ users: users }),
}));
export const useSelectedUser = createWithEqualityFn<selectedUserState>(
  (set) => ({
    selectedUser: undefined,
    setSelectedUser: (user) => set({ selectedUser: user }),
  })
);
export const useMessages = createWithEqualityFn((set) => ({
  messages: undefined,
  setMessages: (messages: any) => set({ messages }),
}));
