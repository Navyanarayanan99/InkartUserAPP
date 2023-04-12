/* eslint-disable no-async-promise-executor */
import storage from '@react-native-firebase/storage';
import {Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

export async function UploadImage(path, type = 'default') {
  return new Promise(async resolve => {
    try {
      const uri = path;
      if (type === 'default') {
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const pathForFirebaseStorage = await getPathForFirebaseStorage(uri);
        const uploadUri =
          Platform.OS === 'ios'
            ? pathForFirebaseStorage.replace('file://', '')
            : pathForFirebaseStorage;

        await storage().ref(filename).putFile(pathForFirebaseStorage);

        await storage()
          .ref(filename)
          .getDownloadURL()
          .then(url => {
            resolve(url);
          });
      } else {
        RNFetchBlob.config({
          fileCache: true,
        })
          .fetch('GET', uri)
          .then(async res => {
            const filename = res.path().substring(res.path().lastIndexOf('/') + 1);
            await storage().ref(filename).putFile(res.path());

            await storage()
              .ref(filename)
              .getDownloadURL()
              .then(url => {
                resolve(url);
              });
          });
      }
    } catch (e) {
      console.log(e);
    }
  });
}

const getPathForFirebaseStorage = async uri => {
  if (Platform.OS === 'ios') {
    return uri;
  }
  const stat = await RNFetchBlob.fs.stat(uri);
  return stat.path;
};

export async function UploadThumbImage(path) {
  return new Promise(async resolve => {
    const uri = path;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);

    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    // const concatString = moment(new Date()).valueOf().toString();

    const task = storage().ref(filename).putFile(uploadUri);
    try {
      await task;
      await storage()
        .ref(filename)
        .getDownloadURL()
        .then(url => {
          resolve(url);
        });
    } catch (e) {
      console.log(e);
    }
  });
}

export async function UploadVideo(path) {
  return new Promise(async resolve => {
    const uri = path;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);

    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

    const task = storage().ref(filename).putFile(uploadUri);
    try {
      await task;
      await storage()
        .ref(filename)
        .getDownloadURL()
        .then(url => {
          resolve(url);
        });
    } catch (e) {
      console.log(e);
    }
  });
}
