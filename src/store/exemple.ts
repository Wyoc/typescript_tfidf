import { defineStore } from 'pinia';
import { Exemple } from '@/classes/Exemple';

export interface ExempleInterface {
  exemples: Array<Exemple> | undefined;
}
export const useTagStore = defineStore('Exemple', {
  state: (): ExempleInterface => ({
    exemples: [],
  }),
  getters: {
    getExemples: (state) => state.exemples,
  },
  actions: {
    setExemples(data: Array<Exemple>) {
      this.exemples = data;
    },
  },
});
