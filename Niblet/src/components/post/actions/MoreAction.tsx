import React, { useCallback, useMemo, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  ACTION_STYLES,
  ICON_SIZE,
} from '@src/components/post/actions/ActionsConstants';
import {
  AppModal,
  MODAL_ANIMATION_SPEED,
} from '@src/components/modal/AppModal';
import { ListItem } from '@src/components/modal/ListItem';
import { useAuthContext } from '@src/auth';
import { usePostContext } from '@src/components/post/PostContext';
import { useApi } from '@src/hooks/useApi';
import { postsApi } from '@src/api/posts';
import { AppDialogModal } from '@src/components/AppDialogModal';
import { LoadingModal } from '@src/components/modal/LoadingModal';
import { ErrorModal } from '@src/components/modal/ErrorModal';

export default function MoreAction(): JSX.Element {
  const { user } = useAuthContext();
  const postContext = usePostContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const deletePostApi = useApi(postsApi.deletePost);
  const [isConfirmDeleteVisible, setIsConfirmDeleteVisible] = useState(false);

  const openModal = () => setIsModalVisible(true);

  const closeModal = () => setIsModalVisible(false);

  const handleDelete = useCallback(async () => {
    const res = await deletePostApi.request({
      params: { id: postContext.post.id },
    });

    if (res.ok) {
      postContext.onDelete(postContext.id);
    } else {
      setTimeout(() => {
        setIsErrorModalVisible(true);
      }, MODAL_ANIMATION_SPEED * 2);
    }
  }, [deletePostApi, postContext]);

  const hideConfirmDeleteModal = useCallback(() => {
    setIsConfirmDeleteVisible(false);
  }, []);

  const showConfirmDelete = useCallback(() => {
    setIsConfirmDeleteVisible(true);
  }, []);

  const closeErrorModal = useCallback(() => {
    setIsErrorModalVisible(false);
  }, []);

  const modalItems = useMemo(() => {
    if (user?.id === postContext.post.postedBy.id) {
      return (
        <ListItem
          onPress={showConfirmDelete}
          text="Delete"
          iconName="trash-can-outline"
        />
      );
    } else {
      return <ListItem text="Report" iconName="flag" />;
    }
  }, [postContext.post.postedBy.id, showConfirmDelete, user?.id]);

  return (
    <>
      <AppModal onBackdropPress={closeModal} isVisible={isModalVisible}>
        {modalItems}
        <ListItem onPress={closeModal} text="Close" iconName="close" />
        <AppDialogModal
          title="Confirm Delete"
          body="Are you sure you want to delete this post"
          buttons={[
            { title: 'Cancel', onPress: hideConfirmDeleteModal },
            { title: 'Delete', type: 'destructive', onPress: handleDelete },
          ]}
          onDismiss={hideConfirmDeleteModal}
          isVisible={isConfirmDeleteVisible}
        >
          <LoadingModal isVisible={deletePostApi.isLoading} />
          <ErrorModal
            title="Failed to delete."
            body={deletePostApi.error}
            isVisible={isErrorModalVisible}
            onDismiss={closeErrorModal}
          />
        </AppDialogModal>
      </AppModal>
      <TouchableOpacity onPress={openModal} style={ACTION_STYLES.container}>
        <MaterialCommunityIcons
          name={'dots-horizontal'}
          size={ICON_SIZE}
          color="#fff"
        />
      </TouchableOpacity>
    </>
  );
}
