import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  Modal,
  Keyboard,
  RefreshControl,
  Pressable,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { CircleFadingPlus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withSpring,
  FadeOut,
  Layout,
} from 'react-native-reanimated';
import { BottomPill } from '../../components/BottomPill';
import { SwipeableRow } from '../../components/SwipeableRow';
import { useNotes } from '../../src/hooks/useNotes';
import { getPreviewText } from '../../src/utils/textUtils';
import { formatDate } from '../../src/utils/formatDate';

export default function NotesScreen() {
  const { colors, theme } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const richTextRef = useRef<RichEditor>(null);
  const {
    notes,
    isLoading,
    isRefreshing,
    addNote,
    updateNote,
    deleteNote,
    refreshNotes,
  } = useNotes();

  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const toolbarTranslateY = useSharedValue(100);
  const fabScale = useSharedValue(1);
  const bottomPillOpacity = useSharedValue(1);

  React.useEffect(() => {
    const showSubscription = Platform.OS === 'ios'
      ? Keyboard.addListener('keyboardWillShow', (e) => {
          setKeyboardHeight(e.endCoordinates.height);
          toolbarTranslateY.value = withTiming(0, { duration: 250 });
          bottomPillOpacity.value = withTiming(0, { duration: 150 });
        })
      : Keyboard.addListener('keyboardDidShow', (e) => {
          setKeyboardHeight(e.endCoordinates.height);
          toolbarTranslateY.value = withTiming(0, { duration: 250 });
          bottomPillOpacity.value = withTiming(0, { duration: 150 });
        });

    const hideSubscription = Platform.OS === 'ios'
      ? Keyboard.addListener('keyboardWillHide', () => {
          setKeyboardHeight(0);
          toolbarTranslateY.value = withTiming(100, { duration: 200 });
          bottomPillOpacity.value = withSpring(1);
        })
      : Keyboard.addListener('keyboardDidHide', () => {
          setKeyboardHeight(0);
          toolbarTranslateY.value = withTiming(100, { duration: 200 });
          bottomPillOpacity.value = withSpring(1);
        });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleNotePress = (noteId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedNote(noteId);
  };

  const closeNote = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (Platform.OS === 'ios') {
      Keyboard.dismiss();
    }
    
    setSelectedNote(null);
  };

  const handleNewNote = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    fabScale.value = withSpring(0.8, { mass: 0.3, stiffness: 400 });
    setTimeout(() => {
      fabScale.value = withSpring(1, { mass: 0.3, stiffness: 400 });
    }, 100);

    const note = await addNote();
    if (note) {
      handleNotePress(note.id);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    await deleteNote(noteId);
  };

  const animatedToolbarStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: toolbarTranslateY.value }],
    position: 'absolute',
    bottom: keyboardHeight + 20,
    left: 0,
    right: 0,
    zIndex: 1000,
  }));

  const animatedBottomPillStyle = useAnimatedStyle(() => ({
    opacity: bottomPillOpacity.value,
  }));

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading notes...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={Platform.OS !== 'web'}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshNotes}
            tintColor={colors.text}
            colors={[colors.text]} // Android
            progressBackgroundColor={colors.background} // Android
          />
        }>
        {notes.map((note) => (
          <Animated.View
            key={note.id}
            layout={Layout}
            exiting={FadeOut.duration(200)}>
            <SwipeableRow onDelete={() => handleDelete(note.id)}>
              <View
                style={[
                  styles.noteCard,
                  { backgroundColor: colors.text + '08' },
                ]}>
                <Text
                  style={[styles.notePreview, { color: colors.text }]}
                  numberOfLines={1}
                  onPress={() => handleNotePress(note.id)}>
                  {getPreviewText(note.content)}
                </Text>
                <Text style={[styles.noteDate, { color: colors.text + '60' }]}>
                  {formatDate(new Date(note.updated_at))}
                </Text>
              </View>
            </SwipeableRow>
          </Animated.View>
        ))}
      </ScrollView>

      <Animated.View style={[styles.bottomPillContainer, animatedBottomPillStyle]}>
        <BottomPill>
          <Animated.View style={[{ transform: [{ scale: fabScale }] }]}>
            <Pressable
              onPress={handleNewNote}
              style={styles.iconButton}>
              <CircleFadingPlus
                size={24}
                color={colors.text}
              />
            </Pressable>
          </Animated.View>
        </BottomPill>
      </Animated.View>

      <Modal
        visible={selectedNote !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeNote}>
        <SafeAreaView style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
            keyboardVerticalOffset={0}>
            {selectedNote && (
              <RichEditor
                ref={richTextRef}
                initialContentHTML={notes.find(n => n.id === selectedNote)?.content || ''}
                onChange={(content) => {
                  updateNote(selectedNote, content);
                }}
                initialHeight={500}
                placeholder="Start typing..."
                style={styles.editor}
                editorStyle={{
                  backgroundColor: colors.background,
                  color: colors.text,
                  placeholderColor: colors.text + '80',
                  contentCSSText: `
                    font-family: -apple-system, system-ui;
                    font-size: 16px;
                    padding: 24px 12px;
                    color: ${colors.text};
                    caret-color: ${colors.text};
                  `,
                }}
              />
            )}

            <Animated.View style={animatedToolbarStyle}>
              <BottomPill floating={false} style={styles.toolbarPill}>
                <RichToolbar
                  editor={richTextRef}
                  selectedIconTint={colors.text}
                  iconTint={colors.text + '80'}
                  style={styles.toolbar}
                  actions={[
                    actions.setBold,
                    actions.setItalic,
                    actions.setUnderline,
                    actions.keyboard,
                  ]}
                />
              </BottomPill>
            </Animated.View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 100,
  },
  noteCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  notePreview: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  noteDate: {
    fontSize: 13,
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  editor: {
    flex: 1,
  },
  toolbar: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  bottomPillContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  toolbarPill: {
    alignSelf: 'center',
    marginBottom: 8,
  },
});