export const getViteEnv = () => {
  try {
    return eval('import.meta.env');
  } catch {
    return {}; 
  }
};