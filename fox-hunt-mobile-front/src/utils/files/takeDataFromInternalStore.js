import RNFetchBlob from 'rn-fetch-blob';
import { ENCODING, INTERNAL_STORE_FOLDER_NAME } from '../constants/commonConstants';

const takeDataFromInternalStore = async (folderName = INTERNAL_STORE_FOLDER_NAME) => {
  const dirs = RNFetchBlob.fs.dirs;

  try {
    const files = await RNFetchBlob
      .fs.ls(`${dirs.DocumentDir}/${folderName}`);
    const asyncRes = await Promise.all(files.map(async (fileName) => {
      const fileData = await RNFetchBlob.fs.readFile(
        `${dirs.DocumentDir}/${folderName}/${fileName}`,
        ENCODING,
      );
      return fileData;
    }));
    return asyncRes;
  } catch (err) {
    throw new Error(err);
  }
};

export default takeDataFromInternalStore;
