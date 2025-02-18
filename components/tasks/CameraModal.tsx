import React, { useRef, useState } from 'react';
import { View, StyleSheet, Modal, Pressable, Platform, Text, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { manipulateAsync } from 'expo-image-manipulator';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../app/context/ThemeContext';
import { X, Camera as CameraIcon } from 'lucide-react-native';
import { BottomPill } from '../BottomPill';

interface CameraModalProps {
  isVisible: boolean;
  onClose: () => void;
  onPhotoTaken: (base64: string) => Promise<void>;
}

export function CameraModal({ isVisible, onClose, onPhotoTaken }: CameraModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  console.log('[CameraModal] Rendering with isVisible:', isVisible);
  const { colors } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const handleTakePhoto = async () => {
    const startTime = Date.now();
    console.log('[CameraModal] Starting photo capture...');
    if (!cameraRef.current) {
      console.log('[CameraModal] Camera ref is null');
      return;
    }

    try {
      if (Platform.OS !== 'web') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      setIsProcessing(true);
      console.log('[CameraModal] Taking picture...');
      const photo = await cameraRef.current.takePictureAsync();
      const photoTime = Date.now() - startTime;
      console.log('[CameraModal] Picture taken in', photoTime, 'ms. URI:', photo.uri);
      console.log('[CameraModal] Original image size:', photo.width, 'x', photo.height);
      
      // Convert to base64 without any processing
      const base64 = await manipulateAsync(
        photo.uri,
        [],  // No transformations
        { base64: true }
      );
      const processTime = Date.now() - startTime - photoTime;
      console.log('[CameraModal] Base64 size:', base64.base64?.length || 0, 'characters');

      if (base64.base64) {
        console.log('[CameraModal] Sending image to AI...');
        await onPhotoTaken(base64.base64);
        const aiTime = Date.now() - startTime - photoTime - processTime;
        console.log('[CameraModal] AI processing completed in', aiTime, 'ms');
        console.log('[CameraModal] Total time:', Date.now() - startTime, 'ms');
        setIsProcessing(false);
        onClose();
      } else {
        console.error('[CameraModal] No base64 data in processed image');
      }
    } catch (error) {
      console.error('[CameraModal] Error in photo capture flow:', error);
      if (error instanceof Error) {
        console.error('[CameraModal] Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }
    }
  };

  if (!isVisible) {
    return null;
  }

  if (!permission) {
    console.log('[CameraModal] Permission is loading...');
    return null;
  }

  if (!permission.granted) {
    console.log('[CameraModal] Permission denied');
    return (
      <Modal
        visible={isVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={onClose}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <Text style={[styles.permissionText, { color: colors.text }]}>
            We need your permission to use the camera
          </Text>
          <Pressable
            onPress={requestPermission}
            style={[styles.permissionButton, { backgroundColor: colors.primary }]}>
            <Text style={[styles.permissionButtonText, { color: colors.onPrimary }]}>
              Grant Permission
            </Text>
          </Pressable>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
        />
        {isProcessing && (
          <View style={[styles.processingOverlay, { backgroundColor: colors.background + 'CC' }]}>
            <ActivityIndicator size="large" color={colors.text} style={styles.processingSpinner} />
            <Text style={[styles.processingText, { color: colors.text }]}>Processing image...</Text>
          </View>
        )}
        
        <Pressable
          onPress={onClose}
          style={[styles.closeButton, { backgroundColor: colors.text + '14' }]}>
          <X size={24} color={colors.text} />
        </Pressable>

        <View style={styles.bottomPillContainer}>
          <BottomPill>
            <Pressable
              onPress={handleTakePhoto}
              style={styles.captureButton}>
              <CameraIcon size={24} color={colors.text} />
            </Pressable>
          </BottomPill>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  processingSpinner: {
    marginBottom: 12,
  },
  processingText: {
    fontSize: 18,
    fontWeight: '600',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomPillContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  captureButton: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
