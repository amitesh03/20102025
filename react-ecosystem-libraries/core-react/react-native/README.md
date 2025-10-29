# React Native

React Native is a framework for building native mobile apps using React. It lets you build mobile applications for iOS and Android using the same React concepts and patterns.

## Overview

React Native enables you to create truly native apps for both iOS and Android platforms without compromising on user experience. It uses native components instead of web views, providing better performance and a more authentic feel.

## Key Features

- **Native Components**: Uses actual native UI components
- **Cross-Platform**: Write once, deploy to both iOS and Android
- **Hot Reloading**: Instantly see changes without rebuilding
- **Fast Refresh**: See changes reflected immediately while preserving state
- **Native APIs Access**: Access device features like camera, GPS, etc.
- **Large Community**: Extensive ecosystem of libraries and tools

## Installation

### Setting up the development environment

```bash
# Install Expo CLI (recommended for beginners)
npm install -g expo-cli

# Or install React Native CLI
npm install -g @react-native-community/cli

# Create a new project
expo init MyReactNativeApp

# Navigate to project directory
cd MyReactNativeApp

# Start the development server
npm start
```

### Using React Native CLI

```bash
# Create a new project
npx react-native init MyReactNativeApp

# Navigate to project directory
cd MyReactNativeApp

# Run on iOS
npx react-native run-ios

# Run on Android
npx react-native run-android
```

## Basic Usage

### Core Components

```jsx
import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, React Native!</Text>
      <Image
        source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
        style={styles.logo}
      />
      <Button
        title="Press me"
        onPress={() => alert('Button pressed!')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },
});

export default App;
```

### Using Hooks

```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Counter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Count changed:', count);
  }, [count]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Count: {count}</Text>
      <Button
        title="Increment"
        onPress={() => setCount(count + 1)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default Counter;
```

### Navigation

```jsx
// Install navigation packages
// npm install @react-navigation/native @react-navigation/stack
// npm install react-native-screens react-native-safe-area-context

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
```

## Core Components

### Basic Components

- **View**: Container component similar to div
- **Text**: For displaying text
- **Image**: For displaying images
- **TextInput**: For user input
- **ScrollView**: For scrollable content
- **StyleSheet**: For creating optimized styles

### Input Components

- **Button**: Basic button component
- **TouchableOpacity**: Touchable with opacity feedback
- **TouchableHighlight**: Touchable with highlight feedback
- **Switch**: Toggle switch component

### List Components

- **FlatList**: Efficient scrolling list
- **SectionList**: Sectioned list with headers

```jsx
import React from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';

const DATA = [
  { id: '1', title: 'Item 1' },
  { id: '2', title: 'Item 2' },
  { id: '3', title: 'Item 3' },
];

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const FlatListExample = () => {
  const renderItem = ({ item }) => <Item title={item.title} />;

  return (
    <FlatList
      data={DATA}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default FlatListExample;
```

## Platform-Specific Code

```jsx
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        backgroundColor: '#f0f0f0',
      },
      android: {
        backgroundColor: '#e0e0e0',
      },
    }),
  },
});

// Or using Platform.OS
const isAndroid = Platform.OS === 'android';
```

## Accessing Native APIs

```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

const DeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState({});

  useEffect(() => {
    setDeviceInfo({
      OS: Platform.OS,
      Version: Platform.Version,
      isPad: Platform.isPad,
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>OS: {deviceInfo.OS}</Text>
      <Text>Version: {deviceInfo.Version}</Text>
      {Platform.OS === 'ios' && (
        <Text>Is iPad: {deviceInfo.isPad ? 'Yes' : 'No'}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DeviceInfo;
```

## Best Practices

1. **Use StyleSheet.create()** for performance optimization
2. **Optimize FlatList** with proper keyExtractor and getItemLayout
3. **Use Platform-specific code** when needed
4. **Implement proper error boundaries**
5. **Test on both platforms** regularly
6. **Use community libraries** for common functionality

## Popular Libraries

- **Navigation**: React Navigation
- **State Management**: Redux, MobX, Zustand
- **Networking**: Axios, Fetch API
- **Storage**: AsyncStorage, SQLite
- **UI Components**: NativeBase, React Native Elements, UI Kitten
- **Icons**: React Native Vector Icons
- **Animations**: React Native Reanimated, Lottie

## Resources

- [Official Documentation](https://reactnative.dev/)
- [React Native CLI Documentation](https://github.com/react-native-community/cli)
- [Expo Documentation](https://docs.expo.io/)
- [React Native Community](https://github.com/react-native-community)