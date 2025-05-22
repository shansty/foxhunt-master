import React, { useContext, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import Header from '../../components/parts/Header';
import styles from './MyResultsPage.styles';
import ResultCard from '../results/resultCard/ResultCard';
import { Context as CommonContext } from '../../context/CommonContext';
import Spinner from '../../components/Spinner';
import { useFocusEffect } from '@react-navigation/native';

const MyResultsPage = ({ navigation }) => {
  const [page, setPage] = useState(0);
  const { state: { results, isLoading, lastResultsPage }, fetchCommandResults,
    clearCommandResult, fetchInitialCommandResults, changeIsLoading } = useContext(CommonContext);

  useFocusEffect(
    React.useCallback(() => {
      fetchInitialCommandResults();
      setPage((state) => state + 1);
      return () => {
        changeIsLoading();
        clearCommandResult();
      };
    }, []),
  );

  const openDrawer = () => {
    navigation.openDrawer();
  };

  const handleEnd = () => {
    setPage((state)=>state + 1);
    fetchCommandResults(page);
  };

  const renderNoResult = () => {
    return (
      <View>
        <Text style={styles.title}>No results</Text>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <ResultCard item={item}/>
  );

  return (isLoading ? <Spinner /> :
    <View style={styles.container}>
      <Header
        currentRoute="My results"
        openDrawer={openDrawer}
      />
      {results.length !== 0 ?
        <FlatList
          data={results}
          keyExtractor={(item) => item.competition.id.toString()}
          onEndReached={lastResultsPage? false: handleEnd }
          ListFooterComponent={lastResultsPage? false:<Spinner/>}
          initialNumToRender={8}
          onEndReachedThreshold={0.5}
          disableVirtualization={false}
          renderItem={( item )=>renderItem(item)}
        /> :
        renderNoResult()
      }
    </View>
  );
};

export default MyResultsPage;
