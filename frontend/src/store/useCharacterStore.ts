import { create } from "zustand";

export type TCharacterStore = {
  id: string | undefined;
  setId: (id: string) => void;
};

const useCharacterStore = create<TCharacterStore>()((set) => ({
  id: undefined,
  setId: (id: string) => set(() => ({ id })),
}));

export default useCharacterStore;
