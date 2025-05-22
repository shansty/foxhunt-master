import React from 'react';
import {
  Modal,
  SlideAnimation,
  ModalTitle,
  ModalFooter,
  ModalButton,
} from 'react-native-modals';
import { View } from 'react-native';

const CustomModal = React.memo(({ isVisible, acceptAction, disagreeAction }) => {
  return (
    <View>
      <Modal
        visible={isVisible}
        modalTitle={<ModalTitle title='Do you want to finish competition?' />}
        modalAnimation={new SlideAnimation({
          slideFrom: 'bottom',
        })}
        footer={
          <ModalFooter>
            <ModalButton
              text="YES"
              onPress={acceptAction}
            />
            <ModalButton
              text="NO"
              onPress={disagreeAction}
            />
          </ModalFooter>
        }
      >
      </Modal>
    </View>
  );
});

CustomModal.displayName = 'CustomModal';

export default CustomModal;
