import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import Header from '../../../components/parts/Header';
import { Context as UpcomingCompetitionContext }
  from '../../../context/competition/UpcomingCompetitionContext';
import Accordion from 'react-native-collapsible/Accordion';
import COLORS from '../../../utils/constants/colors';
import RenderUpcomingCompetitionSectionHeader
  from '../../../components/competitions/accordion/RenderUpcomingCompetitionSectionHeader';
import RenderUpcomingCompetitionSectionContent
  from '../../../components/competitions/accordion/RenderUpcomingCompetitionSectionContent';
import Spinner from '../../../components/Spinner';

const UpcomingCompetitionListScreen = (props) => {
  const { state, setCompetitions, setCurrentCompetition } = useContext(UpcomingCompetitionContext);
  const [openSection, setOpenSection] = useState([]);

  useEffect(() => {
    setCompetitions();
  }, []);

  return state.isLoading ? <Spinner /> :
    <View style={styles.container}>
      <Header
        currentRoute="Upcoming competitions"
        openDrawer={props.navigation.openDrawer}
      />
      {state.competitions.length !== 0 ?
        <ScrollView>
          <View style={styles.accordionContainer}>
            <Accordion
              sections={state.competitions}
              activeSections={openSection}
              underlayColor="none"
              expandMultiple={true}
              renderHeader={RenderUpcomingCompetitionSectionHeader}
              renderContent={(competition) =>
                <RenderUpcomingCompetitionSectionContent
                  competition={competition}
                  setCurrentCompetition={setCurrentCompetition}
                />
              }
              onChange={setOpenSection}
            />
          </View>
        </ScrollView> : <Text style={styles.title}>No upcoming competitions</Text>
      }
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

export default UpcomingCompetitionListScreen;
