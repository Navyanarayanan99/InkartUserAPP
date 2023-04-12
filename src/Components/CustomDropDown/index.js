import React, {useState, useEffect, useRef} from 'react';
import {
  Dimensions,
  View,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import {colors} from '../../common/colors';
import {style} from './style';
import firestore from '@react-native-firebase/firestore';
import ActionSheet, {
  SheetManager,
  useScrollHandlers,
} from 'react-native-actions-sheet';

const CustomDropDown = props => {
  const {placeholder, type, onChange, error} = {...props};
  const {width, height} = Dimensions.get('window');
  const [focus, setFocus] = useState(false);
  const [color, setColor] = useState(colors.grey);
  const [brColor, setBrColor] = useState(colors.borderGrey);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState({});
  const actionSheetRef = useRef('update-category');
  const scrollHandlers = useScrollHandlers('scrollview-1', actionSheetRef);

  useEffect(() => {
    return () => {
      setSelectedCat({});
    };
  }, []);

  const handleModal = () => {
    if (type === 'categories') {
      getCategories();
    }
  };

  const getCategories = () => {
    // firestore()
    //   .collection('Categories')
    //   .get()
    //   .then(snapshot => {
    //     if (snapshot.empty) {
    //       console.log('empty');
    //     } else {
    //       const objectsArray = [];
    //       snapshot?.docs.forEach(document => {
    //         if (document.exists) {
    //           const result = {id: document.id, ...document?.data()};
    //           objectsArray.push(result);
    //         }
    //       });
    //       actionSheetRef.current?.show();
    //       setCategories(objectsArray);
    //     }
    //   });
  };

  const handleSlectCategory = item => {
    actionSheetRef.current?.hide();
    setSelectedCat(item);
    onChange(item);
  };

  return (
    <View style={style.container}>
      <TouchableOpacity
        onPress={handleModal}
        style={[
          style.textInputContainer,
          {borderColor: brColor, backgroundColor: colors.secondaryGreen},
        ]}>
        <View style={style.customTextInput}>
          <Text
            style={{
              fontFamily: 'Lato-Regular',
              color:
                selectedCat?.name == undefined
                  ? colors.placeholder
                  : colors.black,
            }}>
            {selectedCat?.name == undefined ? placeholder : selectedCat?.name}
          </Text>
        </View>
        <Image
          source={require('../../../assets/images/down-arrow.png')}
          style={style.iconStyle}
        />
      </TouchableOpacity>
      <ActionSheet
        ref={actionSheetRef}
        headerAlwaysVisible={true}
        backgroundInteractionEnabled={false}
        drawUnderStatusBar={true}
        gestureEnabled={true}
        gstatusBarTranslucent
        defaultOverlayOpacity={0.3}>
        <ScrollView
          {...scrollHandlers}
          style={{padding: 15, height: height * 0.7}}
          showsVerticalScrollIndicator={false}>
          {categories?.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={{
                  backgroundColor: colors.secondaryGreen,
                  marginVertical: 10,
                  padding: 10,
                  borderRadius: 15,
                }}
                onPress={() => handleSlectCategory(item)}>
                <Text
                  style={{
                    fontFamily: 'Lato-Regular',
                    fontSize: 14,
                    marginVertical: 5,
                  }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </ActionSheet>
    </View>
  );
};

export default CustomDropDown;
