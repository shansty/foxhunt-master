import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, KeyboardAvoidingView } from 'react-native';
import { Context as AuthContext } from '../../context/AuthContext';
import DefaultTitle from '../../components/parts/DefaultTitle';
import COLORS from '../../utils/constants/colors';
import Input from '../../components/parts/Input';
import Button from '../../components/parts/Button';
import { Context as CommonContext } from '../../context/CommonContext';

const DomainScreen = ({ navigation }) => {
  const [organizationDomain, setOrganizationDomain] = useState('');
  const { state, setDomain, clearErrorMessage } = useContext(AuthContext);
  const { state: { tooltips } } = useContext(CommonContext);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      clearErrorMessage();
    });

    return unsubscribe;
  }, []);

  const onSubmit = () => {
    setDomain(organizationDomain);
  };

  return (

    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.headerBackground}/>
      <KeyboardAvoidingView
        behavior={'position'}
        keyboardVerticalOffset={30}
      >
        <DefaultTitle
          title="Please, enter your organization domain to continue"
          titleCode={tooltips.DOMAIN_TITLE}
          centered={true}
        />
        <Input
          label='Domain'
          value={organizationDomain}
          onChangeText={setOrganizationDomain}
          leftIconName="home"
          inputCode={tooltips.DOMAIN_INPUT}
        />
        {!!state.errorMessage && <Text style={styles.errorMessage}>{state.errorMessage}</Text>}
        <Button
          title='Next'
          backgroundColor={COLORS.blueBackground}
          buttonCode={tooltips.DOMAIN_SUBMIT_BTN}
          action={onSubmit}
        />
      </KeyboardAvoidingView>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.greyBackground,
    paddingHorizontal: 10,
    paddingTop: '65%',
  },
  errorMessage: {
    fontSize: 14,
    color: COLORS.errorText,
    opacity: 0.8,
    marginHorizontal: 10,
    marginBottom: 15,
    marginTop: -15,
    textAlign: 'center',
  },
});

export default DomainScreen;
