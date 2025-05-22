import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment';
import { ENCODING, INTERNAL_STORE_FOLDER_NAME } from '../constants/commonConstants';

const saveToFile = async (data, folderName = INTERNAL_STORE_FOLDER_NAME ) => {
  const dirs = RNFetchBlob.fs.dirs;
  const fs = RNFetchBlob.fs;

  const fileName = moment().format();

  const pathToStoreData =
    `${dirs.DocumentDir}/${folderName}/${fileName}`;
  try {
    await createFolderIfNotExist(folderName, dirs);

    const isFileExist = await RNFetchBlob.fs.exists(pathToStoreData);
    if (folderName === INTERNAL_STORE_FOLDER_NAME) {
      saveToNewFile(data, isFileExist, fs, pathToStoreData);
    } else {
      saveToExistFile(data, isFileExist, fs, pathToStoreData);
    }
  } catch (err) {
    throw new Error(err);
  }
};
const createFolderIfNotExist = async (folderName, dirs) => {
  const isStoreFolderExist =
    await RNFetchBlob.fs.exists(`${dirs.DocumentDir}/${folderName}`);
  if (!isStoreFolderExist) {
    await RNFetchBlob.fs.mkdir(`${dirs.DocumentDir}/${folderName}`);
  }
};
const saveToNewFile = (data, isFileExist, fs, pathToStoreData) => {
  if (!isFileExist) {
    fs.createFile(pathToStoreData, data, ENCODING);
  };
};
const saveToExistFile = (data, isFileExist, fs, pathToStoreData) => {
  if (!isFileExist) {
    fs.createFile(pathToStoreData, JSON.stringify(data), ENCODING);
  } else {
    fs.appendFile(pathToStoreData, JSON.stringify(data), ENCODING);
  };
};

export default saveToFile;
