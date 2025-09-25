
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      try {
        console.log('Requesting camera permissions...');
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        console.log('Camera permission status:', status);
        setHasPermission(status === 'granted');
      } catch (error) {
        console.error('Error requesting camera permissions:', error);
        setHasPermission(false);
        Alert.alert(
          'Error',
          'No se pudo solicitar permisos de cámara. Por favor, verifica la configuración de la aplicación.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    console.log('QR Code scanned:', { type, data });
    setScanned(true);
    onScan(data);
  };

  const handleScanAgain = () => {
    console.log('Scanning again...');
    setScanned(false);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Icon name="camera" size={48} color={colors.textSecondary} />
        <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
          Iniciando cámara...
        </Text>
        <Text style={[commonStyles.textSecondary, { marginTop: 8, textAlign: 'center' }]}>
          Solicitando permisos de cámara
        </Text>
      </View>
    );
  }

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Icon name="camera" size={48} color={colors.textSecondary} />
        <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
          Solicitando permisos de cámara...
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Icon name="camera-off" size={48} color={colors.textSecondary} />
        <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
          Sin acceso a la cámara
        </Text>
        <Text style={[commonStyles.textSecondary, { marginTop: 8, textAlign: 'center', paddingHorizontal: 20 }]}>
          Necesitamos acceso a la cámara para escanear códigos QR. Por favor, habilita los permisos en la configuración de la aplicación.
        </Text>
        <TouchableOpacity
          style={[buttonStyles.primary, { marginTop: 20 }]}
          onPress={onClose}
        >
          <Text style={buttonStyles.primaryText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Check if we're on web platform and show appropriate message
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Icon name="monitor" size={48} color={colors.textSecondary} />
        <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
          Escáner no disponible en web
        </Text>
        <Text style={[commonStyles.textSecondary, { marginTop: 8, textAlign: 'center', paddingHorizontal: 20 }]}>
          El escáner de códigos QR solo está disponible en dispositivos móviles.
        </Text>
        <TouchableOpacity
          style={[buttonStyles.primary, { marginTop: 20 }]}
          onPress={onClose}
        >
          <Text style={buttonStyles.primaryText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="x" size={24} color={colors.background} />
        </TouchableOpacity>
        <Text style={[commonStyles.text, { color: colors.background, fontWeight: '600' }]}>
          Escanear QR
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.scannerContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        
        <View style={styles.overlay}>
          <View style={styles.scanArea} />
        </View>

        <View style={styles.instructions}>
          <Text style={[commonStyles.text, { color: colors.background, textAlign: 'center' }]}>
            Apunta la cámara hacia el código QR
          </Text>
          <Text style={[commonStyles.textSecondary, { color: colors.background + '80', textAlign: 'center', marginTop: 8 }]}>
            El escaneo se realizará automáticamente
          </Text>
        </View>
      </View>

      {scanned && (
        <View style={styles.scannedContainer}>
          <TouchableOpacity
            style={[buttonStyles.primary, { backgroundColor: colors.background }]}
            onPress={handleScanAgain}
          >
            <Text style={[buttonStyles.primaryText, { color: colors.text }]}>
              Escanear de nuevo
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.text + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  instructions: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
  },
  scannedContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
});
