
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
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

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    console.log('QRScanner - Scanned:', type, data);
    onScan(data);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={commonStyles.text}>Solicitando permisos de cámara...</Text>
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
        <Text style={[commonStyles.textSecondary, { marginTop: 8, textAlign: 'center' }]}>
          Necesitamos acceso a la cámara para escanear códigos QR
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
            onPress={() => setScanned(false)}
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
