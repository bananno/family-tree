import useEnvironment from 'shared/useEnvironment';

export default function DevOnly({ children, unless = false }) {
  const { isDevelopment } = useEnvironment();
  return isDevelopment || unless ? children : null;
}
