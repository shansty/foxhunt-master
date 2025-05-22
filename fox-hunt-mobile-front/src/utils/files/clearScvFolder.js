import RNFetchBlob from 'rn-fetch-blob';
import { INTERNAL_STORE_FOLDER_NAME } from '../constants/commonConstants';

const clearScvFolder = async () => {
  const dirs = RNFetchBlob.fs.dirs;
  try {
    const isStoreFolderAlreadyExist =
      await RNFetchBlob.fs.exists(`${dirs.DocumentDir}/${INTERNAL_STORE_FOLDER_NAME}`);
    if (!isStoreFolderAlreadyExist) {
      await RNFetchBlob.fs.mkdir(`${dirs.DocumentDir}/${INTERNAL_STORE_FOLDER_NAME}`);
    }
    const files = await RNFetchBlob.fs.ls(`${dirs.DocumentDir}/${INTERNAL_STORE_FOLDER_NAME}`);
    files.map((file) => {
      RNFetchBlob.fs.unlink(`${dirs.DocumentDir}/${INTERNAL_STORE_FOLDER_NAME}/${file}`);
    });
  } catch (err) {
    throw new Error(err);
  }
};

export default clearScvFolder;
