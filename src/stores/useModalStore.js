// src/store/useModalStore.js
import { create } from 'zustand';

const useModalStore = create((set) => ({
  isOpen: false,
  content: null,
  title: null,
  onClose: null,
  classes: null,
  
  openModal: ({ content, title, onClose, classes }) => set({
    isOpen: true,
    content,
    classes,
    title: title || null,
    onClose: onClose || null,
  }),
  
  closeModal: () => set({
    isOpen: false,
    content: null,
    title: null,
    classes: null,
    onClose: null,
  }),
}));

export default useModalStore;