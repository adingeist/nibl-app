import React, { createRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AnimatedClip, Clip } from '@src/components/camera/Clip';
import { useEditorContext } from '@src/components/camera/EditorContext';

const TIMELINE_SCALE = 60; // 60px per 1s

export const Timeline = () => {
  const { state } = useEditorContext();
  const scrollViewRef = createRef<ScrollView>();

  const handleSizeChange = () => {
    scrollViewRef.current?.scrollToEnd();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        ref={scrollViewRef}
        onContentSizeChange={handleSizeChange}
        contentContainerStyle={{ alignItems: 'center' }}
        style={styles.scrollView}
      >
        {state.clips.map((clipUri, index) => (
          <Clip
            timelineScale={TIMELINE_SCALE}
            key={index}
            uri={clipUri}
            isEditing={state.editingClipUri === clipUri}
          />
        ))}
        <AnimatedClip timelineScale={TIMELINE_SCALE} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
  },

  scrollView: {
    marginTop: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
