import { CameraView, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Modal, View, Button, Alert } from 'react-native';

export default function App() {

  const [modalVisible, setModalVisible] = React.useState(false);
  const [scanned, setScanned] = React.useState(false);
  const [permission, askForPermission] = useCameraPermissions();

  const qrCodeLocked = React.useRef(false);

  async function handleOpenModal() {
    try {

      const { granted } = await askForPermission();

      if (!granted) {
        return Alert.alert('Permissão de câmera negada');
      } 

      setModalVisible(true);
      qrCodeLocked.current = false;
    }
    catch (error) {
      console.log(error);
    }
  }

  function handleBarCodeScanned({ type, data }) {
    setScanned(true);
    setModalVisible(false);
    Alert.alert(`Código de barras do tipo ${type} com o valor ${data} foi escaneado!`);
  }

  return (
    <View style={styles.container}>
     
     <Button 
      title='Ler QrCode'
      onPress={handleOpenModal}
     />

     <Modal
      visible={modalVisible}
      style={{flex: 1}}
      >
        <CameraView
          style={{flex: 1}}
          facing='back'
          onBarcodeScanned={
            ({ type, data }) => {
              if(data && !qrCodeLocked.current) {
                qrCodeLocked.current = true;
                setTimeout(() => handleBarCodeScanned({ type, data }), 500);
              }

            }
          }
        />

          <View 
            style={{
              position: 'absolute',
              bottom: 32,
              left: 32,
              right: 32
            }}
          >
            <Button 
              title='Fechar'
              onPress={() => setModalVisible(false)}
            />
          </View>
     </Modal>
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
