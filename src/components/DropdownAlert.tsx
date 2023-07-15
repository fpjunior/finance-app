// import React, { useEffect, useRef, useState } from 'react';
// import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
// import DropdownAlert from 'react-native-dropdownalert';
// const Color = {
//   info: '#2B73B6',
//   warn: '#cd853f',
//   success: '#32A54A',
//   error: '#cc3232',
//   purple: '#6441A4',
//   white: 'whitesmoke',
// };
// const InfoIcon = '';


// const Button = ({
//   item = { title: '', type: '', color: '#202020' },
//   onSelect = () => { },
// }) => {
//   const text = item.title ? item.title : item.type;
//   return (
//     <Pressable
//       style={[styles.button, { borderColor: item.color }]}
//       onPress={() => onSelect({ item })}>
//       <Text style={[styles.text, { color: item.color }]}>{text}</Text>
//     </Pressable>
//   );
// };

// const List = ({ items = [], onSelect = () => { } }) => {
//   return (
//     <FlatList
//       keyExtractor={item => item.type}
//       data={items}
//       numColumns={3}
//       renderItem={({ item }) => {
//         return <Button item={item} onSelect={onSelect} />;
//       }}
//     />
//   );
// };




// const DropDownAlert = () => {
//   const items = [
//     {
//       color: Color.info,
//       type: 'info',
//       message:
//         'System maintenance starts at midnight. System will be down for approximately 3 hours.',
//     },
//     {
//       color: Color.warn,
//       type: 'warn',
//       message:
//         'Warning: Low disk space. Please add more at your earliest convenience.',
//     },
//     {
//       color: Color.error,
//       type: 'error',
//       message:
//         'Sorry, we are having some technical difficulties. Please try again.',
//     },
//     {
//       color: Color.success,
//       type: 'success',
//       message: 'Order complete. Please check your email for further details.',
//     },
//     {
//       color: Color.purple,
//       type: 'custom',
//       message: 'This is a custom notification',
//     },
//     { type: 'close', title: 'close' },
//     { type: 'show', title: 'enqueue all alerts' },
//     { type: 'clear', title: 'clear queue' },
//   ];
//   const reactNativeLogo = 'https://reactnative.dev/docs/assets/favicon.png';

//   const [queueSize, setQueueSize] = useState(0);
//   let dropDownAlertRef = useRef();

//   useEffect(() => {
//     _fetchData();
//   }, []);

//   const _fetchData = async () => {
//     try {
//       dropDownAlertRef.alertWithType('info', 'Info', 'Start fetch data');
//       const response = await fetch('https://httpbin.org/uuid');
//       const { uuid } = await response.json();
//       dropDownAlertRef.alertWithType('success', 'Success', uuid);
//       throw 'Error fetch data'; // example thrown error
//     } catch (error) {
//       dropDownAlertRef.alertWithType('error', 'Error', error);
//     } finally {
//       _updateQueueSize();
//     }
//   };

//   const _onProgrammaticClose = () => {
//     dropDownAlertRef.closeAction();
//   };

//   const _onProgrammaticClear = () => {
//     dropDownAlertRef.clearQueue();
//   };

//   const _showAlertQueue = () => {
//     const types = ['info', 'warn', 'error', 'success', 'custom'];
//     const message =
//       'Officia eu do labore incididunt consequat sunt sint ullamco cillum.';
//     let count = 1;
//     types.map(type => {
//       dropDownAlertRef.alertWithType(
//         type,
//         'Alert ' + count + ' of ' + types.length,
//         message,
//       );
//       count++;
//     });
//   };

//   const _onSelect = ({ item }) => {
//     switch (item.type) {
//       case 'close':
//         _onProgrammaticClose();
//         break;
//       case 'clear':
//         _onProgrammaticClear();
//         break;
//       case 'show':
//         _showAlertQueue();
//         break;
//       default:
//         const inMilliSeconds = Math.floor(Math.random() * 6000 + 1);
//         const inSeconds = (inMilliSeconds / 1000).toFixed(2);
//         const title = item.type + ' closes in ' + inSeconds + 's';
//         let payload;
//         if (item.type === 'custom') {
//           // example using remote image source in payload
//           payload = { source: reactNativeLogo };
//         } else if (item.type === 'info') {
//           // example using local image source in payload
//           payload = { source: InfoIcon };
//         }
//         dropDownAlertRef.alertWithType(
//           item.type,
//           title,
//           item.message,
//           payload,
//           inMilliSeconds,
//         );
//     }
//     _updateQueueSize();
//   };

//   const _onClose = data => {
//     _log(data);
//     _updateQueueSize();
//   };

//   const _onCancel = data => {
//     _log(data);
//     _updateQueueSize();
//   };

//   const _onTap = data => {
//     _log(data);
//     _updateQueueSize();
//   };

//   const _updateQueueSize = () => {
//     try {
//       setQueueSize(dropDownAlertRef.getQueueSize());
//     } catch (error) {
//       console.log('error- ', error)
//     }
//   };

//   const _log = data => {
//     console.log(data);
//   };

//   return (
//     <View style={styles.container}>
//       <SafeAreaView>
//         <Text style={styles.size}>{'Alert queue size: ' + queueSize}</Text>
//         <List items={items} onSelect={_onSelect} />
//       </SafeAreaView>
//       <DropdownAlert
//         ref={ref => {
//           if (ref) {
//             dropDownAlertRef = ref;
//           }
//         }}
//         containerStyle={styles.content}
//         showCancel={true}
//         onCancel={_onCancel}
//         onTap={_onTap}
//         titleNumOfLines={2}
//         messageNumOfLines={0}
//         onClose={_onClose}
//         inactiveStatusBarBackgroundColor='#0c6b87'
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Color.white,
//     justifyContent: 'center',
//   },
//   content: {
//     backgroundColor: Color.purple,
//   },
//   size: {
//     textAlign: 'center',
//     fontSize: 26,
//     fontWeight: 'bold',
//     marginVertical: 8,
//   },
//   button: {
//     flex: 1,
//     borderRadius: 8,
//     margin: 4,
//     borderWidth: 1,
//   },
//   text: {
//     margin: 8,
//     fontSize: 20,
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
// });

// export default DropDownAlert;
