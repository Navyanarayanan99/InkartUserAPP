import firestore from '@react-native-firebase/firestore';

export const getRecentProducts = async token => {
  try {
    const objectsArray = [];
    await firestore()
      .collection('Orders')
      .orderBy('updated', 'desc')
      .where('userId', '==', token)
      .limit(3)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          return objectsArray;
        } else {
          snapshot?.docs.forEach(document => {
            if (document.exists) {
              const result = {...document?.data()?.cartItems};
              objectsArray.push(...Object.values(result));
            }
          });
        }
      });
      return objectsArray;
  } catch (error) {
    return [];
  }
};
