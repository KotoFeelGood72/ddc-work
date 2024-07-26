import { defineStore, storeToRefs } from 'pinia';

interface ModalsState {
  client: boolean;
  qr: boolean;
}

export const useModalStore = defineStore('modal', {
  state: (): { modals: ModalsState } => ({
    modals: {
      client: false,
      qr: false,
    },
  }),
  actions: {
    openModal(modalName: keyof ModalsState) {
      this.modals[modalName] = true;
    },
    closeModal(modalName: keyof ModalsState, router: any): void {
      this.modals[modalName] = false;
      this.clearQueryParams(router);
    },
   clearQueryParams(router: any) {
      const query = { ...router.currentRoute.value.query };
      delete query.client;
      delete query.phone;
      router.replace({ query });
    },
  },
});

export const useModalStoreRefs = () => storeToRefs(useModalStore());
