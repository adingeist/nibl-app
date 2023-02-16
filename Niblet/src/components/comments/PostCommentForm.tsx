import React from 'react';
import { StyleSheet, TextInput as RNTextInput, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { ReplyingToBanner } from '@src/components/comments/ReplyingToBanner';
import { useTheme } from '@src/hooks/useTheme';
import { CommentJoiSchema } from '@shared/schemas/routes/comments.controller.yup';
import { AppAvatar } from '@src/components/AppAvatar';
import { AppTextInput } from '@src/components/form/AppTextInput';
import { LinkText } from '@src/components/LinkText';
import { FormikSubmitHandler } from '@src/types/formik';
import { TextInput } from 'react-native-paper';
import { CommentDto } from '@shared/types/dto/Comment.entity';
import { useAuthContext } from '@src/auth';

export type PostCommentFormValues = {
  body: string;
};

const initialFormValues: PostCommentFormValues = {
  body: '',
};

type PostCommentFormProps = {
  onSubmit: FormikSubmitHandler<PostCommentFormValues>;
  replyingToComment: CommentDto | undefined;
  onCancelReply: () => void;
  inputRef: React.Ref<RNTextInput>;
  onFocus: () => void;
};

const PostCommentFormComponent = ({
  onSubmit,
  replyingToComment,
  onCancelReply,
  inputRef,
  onFocus,
}: PostCommentFormProps) => {
  const theme = useTheme();
  const { user } = useAuthContext();

  return (
    <>
      {replyingToComment && (
        <ReplyingToBanner
          onCancelReply={onCancelReply}
          replyingToComment={replyingToComment}
        />
      )}
      <Formik
        validationSchema={Yup.object().shape({
          body: CommentJoiSchema.body.required(),
        })}
        initialValues={initialFormValues}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <View
            style={[
              {
                backgroundColor: theme.colors.background,
                paddingHorizontal: theme.screenMargin,
              },
              styles.formContainer,
            ]}
          >
            <AppAvatar size={35} uri={user?.profileImage} />
            <View
              style={[
                { marginLeft: theme.screenMargin },
                styles.textBoxContainer,
              ]}
            >
              <AppTextInput
                multiline
                onFocus={onFocus}
                ignoreErrors
                formik={formik}
                right={
                  <TextInput.Icon
                    name={() => (
                      <LinkText
                        onPress={formik.submitForm}
                        style={{
                          color: formik.isValid
                            ? theme.colors.primary
                            : theme.colors.medium,
                        }}
                      >
                        Post
                      </LinkText>
                    )}
                  />
                }
                ref={inputRef}
                name="body"
                placeholder="Add a comment"
              />
            </View>
          </View>
        )}
      </Formik>
    </>
  );
};

export const PostCommentForm = React.memo(PostCommentFormComponent);

const styles = StyleSheet.create({
  formContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginVertical: 6,
  },

  textBoxContainer: {
    flex: 1,
  },
});
