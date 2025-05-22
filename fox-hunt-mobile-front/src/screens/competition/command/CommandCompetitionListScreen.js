import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Text, BackHandler } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import Header from '../../../components/parts/Header';
import Spinner from '../../../components/Spinner';
import COLORS from '../../../utils/constants/colors';
import { Context as CompetitionContext }
  from '../../../context/competition/active/CompetitionContext';
import RenderCommandCompetitionSectionHeader
  from '../../../components/competitions/accordion/RenderCommandCompetitionSectionHeader';
import RenderCommandCompetitionSectionContent
  from '../../../components/competitions/accordion/RenderCommandCompetitionSectionContent';
import { HOME_PAGE } from '../../../utils/constants/routeNames';

const CommandCompetitionListScreen = ({ navigation }) => {
  const { state, initializeCommandCompetition, setCompetitions, clearState } = useContext(
    CompetitionContext,
  );
  const [openSection, setOpenSection] = useState([]);

  useEffect(() => {
    setCompetitions();
    clearState();
  }, []);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate(HOME_PAGE);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  return state.isLoading ? <Spinner/> :
    <View style={styles.container}>
      <Header
        currentRoute="Live Competitions"
        openDrawer={navigation.openDrawer}
      />
      <ScrollView>
        <View style={styles.accordionContainer}>
          {state.competitions.length !== 0 ?
            <Accordion
              sections={state.competitions}
              activeSections={openSection}
              underlayColor="none"
              expandMultiple={true}
              renderHeader={(competition, index, isActive) =>
                <RenderCommandCompetitionSectionHeader
                  competition={competition}
                  email={state.email}
                  isActive={isActive}
                />
              }
              renderContent={(competition) =>
                <RenderCommandCompetitionSectionContent
                  competition={competition}
                  setCompetition={initializeCommandCompetition}
                />
              }
              onChange={setOpenSection}
            /> : <Text style={styles.title}>No live competitions</Text>}
        </View>
      </ScrollView>
    </View>;
};

const styles = StyleSheet.create({
  accordionContainer: {
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    paddingTop: 47,
    backgroundColor: COLORS.greyBackground,
  },
  title: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: '80%',
    marginHorizontal: 15,
  },
});

export default CommandCompetitionListScreen;
