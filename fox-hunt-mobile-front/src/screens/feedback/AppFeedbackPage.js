import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import StarRating from 'react-native-star-rating';
import { Context as CommonContext } from '../../context/CommonContext';
import Header from '../../components/parts/Header';
import COLORS from '../../utils/constants/colors';
import { FEEDBACK_PAGE } from '../../utils/constants/routeNames';
import SupportTeamAnimation from '../../animations/SupportTeamAnimation';
import {
  INITIAL_STAR_COUNT,
  SHORT_SERVER_DATE_FORMAT,
  TIMES_TO_SUBMIT_FEEDBACK,
} from '../../utils/constants/commonConstants';
import SuccessNotification from '../../components/notification/SuccessNotification';
import {
  FEEDBACK_SUBMIT_ERROR,
  FEEDBACK_SUCCESS_SUBTITLE,
  FEEDBACK_SUCCESS_TITLE,
} from '../../utils/constants/errors';
import styles from './AppFeedbackPage.styles';
import Spinner from '../../components/Spinner';
import { getCurrentDate, isEmptyObject } from '../../utils/commonUtils';

const AppFeedbackPage = ({ navigation }) => {
  const { setActiveTab, setFeedback, state: { feedback, isLoading, isOpenNotification },
    getUserFeedback, createFeedBack, updateFeedBack, toggleNotification } =
    useContext(CommonContext);
  const [starCount, setStarCount] = useState(0);
  const isFocused = useIsFocused();
  const [count, setCount] = useState(0);
  const [error, setErrorMessage] = useState('');
  const [feedbackComment, setFeedbackComment] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      fetchFeedback();
    }, []),
  );

  useEffect(() => {
    if (isFocused) {
      setActiveTab(FEEDBACK_PAGE);
    } else {
      setStarCount(INITIAL_STAR_COUNT);
    }
  }, [isFocused]);

  const fetchFeedback = async () => {
    const feedback = await getUserFeedback();
    setFeedbackComment(feedback ? feedback.comment : '');
    setStarCount(feedback ? feedback.ranking : 0);
  };

  const changeFeedback = async (userFeedback) => {
    if (isEmptyObject(feedback)) {
      const feedback = await createFeedBack(userFeedback);

      setFeedback(feedback);
    } else {
      await updateFeedBack(userFeedback);
    }
  };

  const onHandlePress = async () => {
    if (count < TIMES_TO_SUBMIT_FEEDBACK) {
      setCount((count) => count + 1);
      const userFeedback = collectFeedback();
      await changeFeedback(userFeedback);
      toggleNotification();
    } else {
      setErrorMessage(FEEDBACK_SUBMIT_ERROR);
    }
  };

  const collectFeedback = () => {
    return {
      ranking: starCount,
      comment: feedbackComment,
      id: feedback.id,
      sendDate: getCurrentDate(SHORT_SERVER_DATE_FORMAT),
    };
  };

  const openDrawer = () => {
    navigation.openDrawer();
  };
  return (isLoading ? <Spinner/>:
    <View style={styles.container}>
      <Header
        currentRoute="App Feedback"
        openDrawer={openDrawer}
      />

      <SuccessNotification
        isVisible={isOpenNotification}
        title={FEEDBACK_SUCCESS_TITLE}
        subTitle={FEEDBACK_SUCCESS_SUBTITLE}
      />
      <View>
        <ScrollView contentContainerStyle={styles.secondaryContainer}>
          <SupportTeamAnimation/>
          <View>
            <StarRating
              disabled={false}
              maxStars={5}
              starSize={40}
              emptyStarColor={COLORS.yellow}
              fullStarColor={COLORS.yellow}
              containerStyle={{ marginHorizontal: 50 }}
              rating={starCount}
              selectedStar={(rating) => setStarCount(rating)}
            />
            <Text style={styles.greetingText}>
              Leave your message here:
            </Text>
            <TextInput
              multiline={true}
              maxLength={1000}
              editable={true}
              height={100}
              width={300}
              style={styles.inputContainerStyle}
              numberOfLines={15}
              onChangeText={(feedback) => setFeedbackComment(feedback)}
              value={feedbackComment}
              color={COLORS.white}
            />
            {!!error && <Text style={styles.errorMessage}>{error}</Text>}
            <TouchableOpacity style={styles.button} onPress={onHandlePress}>
              <Text style={styles.buttonText}>
               Submit
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

      </View>
      <StatusBar backgroundColor={COLORS.headerBackground}/>
    </View>
  );
};

export default AppFeedbackPage;
