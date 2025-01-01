import { useStaticDb } from '../SETTINGS';

export default function DevOnly({ children, unless = false }) {
  return useStaticDb || unless ? null : children;
}
