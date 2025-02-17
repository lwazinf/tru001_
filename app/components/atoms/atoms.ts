import { atom } from 'jotai';

interface PolicyState {
  isOpen: boolean;
  section: 'terms' | 'privacy' | null;
}

export const PolicyState = atom<PolicyState>({
  isOpen: false,
  section: null
});