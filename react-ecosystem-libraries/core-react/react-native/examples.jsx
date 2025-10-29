import React, { useState, useEffect, useRef, useCallback } from 'react';

// Note: These examples demonstrate React Native concepts in a web-compatible format
// In a real React Native app, you would use native components like View, Text, etc.

// Example 1: Basic Component Structure
function BasicComponentExample() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="react-native-example">
      <h2>Basic Component Structure</h2>
      <p>Demonstrates fundamental React Native component patterns.</p>
      
      <div className="native-component">
        <h3>Counter Component</h3>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>
          Increment
        </button>
        <button onClick={() => setCount(count - 1)}>
          Decrement
        </button>
      </div>
      
      <pre>{`
// React Native equivalent:
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Counter = () => {
  const [count, setCount] = useState(0);
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Count: {count}</Text>
      <Button 
        title="Increment" 
        onPress={() => setCount(count + 1)} 
      />
      <Button 
        title="Decrement" 
        onPress={() => setCount(count - 1)} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  text: {
    fontSize: 18,
    marginBottom: 20
  }
});
      `}</pre>
    </div>
  );
}

// Example 2: List Rendering with FlatList
function FlatListExample() {
  const [data, setData] = useState([
    { id: '1', title: 'Item 1', description: 'Description for item 1' },
    { id: '2', title: 'Item 2', description: 'Description for item 2' },
    { id: '3', title: 'Item 3', description: 'Description for item 3' },
    { id: '4', title: 'Item 4', description: 'Description for item 4' },
    { id: '5', title: 'Item 5', description: 'Description for item 5' }
  ]);
  
  const renderItem = ({ item }) => (
    <div className="list-item">
      <h4>{item.title}</h4>
      <p>{item.description}</p>
    </div>
  );
  
  return (
    <div className="react-native-example">
      <h2>FlatList Component</h2>
      <p>Demonstrates efficient list rendering in React Native.</p>
      
      <div className="list-container">
        {data.map(renderItem)}
      </div>
      
      <pre>{`
// React Native FlatList:
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const DATA = [
  { id: '1', title: 'Item 1', description: 'Description for item 1' },
  { id: '2', title: 'Item 2', description: 'Description for item 2' },
  // ... more items
];

const Item = ({ title, description }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
  </View>
);

const ListExample = () => {
  const renderItem = ({ item }) => (
    <Item title={item.title} description={item.description} />
  );

  return (
    <FlatList
      data={DATA}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 20,
    backgroundColor: '#f9c2ff',
  },
  title: {
    fontSize: 18,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
  }
});
      `}</pre>
    </div>
  );
}

// Example 3: Navigation Patterns
function NavigationExample() {
  const [currentScreen, setCurrentScreen] = useState('Home');
  
  const navigateTo = (screen) => {
    setCurrentScreen(screen);
  };
  
  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return (
          <div className="screen">
            <h3>Home Screen</h3>
            <p>Welcome to the app!</p>
            <button onClick={() => navigateTo('Profile')}>
              Go to Profile
            </button>
            <button onClick={() => navigateTo('Settings')}>
              Go to Settings
            </button>
          </div>
        );
      case 'Profile':
        return (
          <div className="screen">
            <h3>Profile Screen</h3>
            <p>User profile information</p>
            <button onClick={() => navigateTo('Home')}>
              Back to Home
            </button>
          </div>
        );
      case 'Settings':
        return (
          <div className="screen">
            <h3>Settings Screen</h3>
            <p>App settings</p>
            <button onClick={() => navigateTo('Home')}>
              Back to Home
            </button>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="react-native-example">
      <h2>Navigation Patterns</h2>
      <p>Demonstrates navigation concepts in React Native.</p>
      
      <div className="navigation-container">
        <div className="nav-bar">
          <span>Current: {currentScreen}</span>
        </div>
        {renderScreen()}
      </div>
      
      <pre>{`
// React Native Navigation with React Navigation:
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ title: 'Profile' }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// HomeScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Text>Welcome to the app!</Text>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile')}
      />
      <Button
        title="Go to Settings"
        onPress={() => navigation.navigate('Settings')}
      />
    </View>
  );
};
      `}</pre>
    </div>
  );
}

// Example 4: Gesture Handling
function GestureExample() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [scale, setScale] = useState(1);
  
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setPosition({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleWheel = (e) => {
    e.preventDefault();
    const newScale = scale + (e.deltaY > 0 ? -0.1 : 0.1);
    setScale(Math.max(0.5, Math.min(2, newScale)));
  };
  
  return (
    <div className="react-native-example">
      <h2>Gesture Handling</h2>
      <p>Demonstrates touch and gesture interactions.</p>
      
      <div 
        className="gesture-area"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="draggable-box"
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
          style={{
            transform: `translate(${position.x - 50}px, ${position.y - 50}px) scale(${scale})`,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        >
          Drag me!
        </div>
      </div>
      
      <pre>{`
// React Native Gesture Handling with React Native Gesture Handler:
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const GestureExample = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
      translateY.value = context.startY + event.translationY;
    },
  });

  const pinchGestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      scale.value = event.scale;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <PinchGestureHandler onGestureEvent={pinchGestureHandler}>
        <PanGestureHandler onGestureEvent={panGestureHandler}>
          <Animated.View style={[styles.box, animatedStyle]}>
            <Text style={styles.text}>Drag and Pinch me!</Text>
          </Animated.View>
        </PanGestureHandler>
      </PinchGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 150,
    height: 150,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});
      `}</pre>
    </div>
  );
}

// Example 5: AsyncStorage
function StorageExample() {
  const [storedValue, setStoredValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [savedItems, setSavedItems] = useState([]);
  
  // Simulate AsyncStorage with localStorage
  const saveItem = () => {
    if (inputValue.trim()) {
      const newItems = [...savedItems, inputValue];
      setSavedItems(newItems);
      localStorage.setItem('reactNativeItems', JSON.stringify(newItems));
      setInputValue('');
    }
  };
  
  const loadItems = () => {
    const items = localStorage.getItem('reactNativeItems');
    if (items) {
      setSavedItems(JSON.parse(items));
    }
  };
  
  const clearItems = () => {
    setSavedItems([]);
    localStorage.removeItem('reactNativeItems');
  };
  
  useEffect(() => {
    loadItems();
  }, []);
  
  return (
    <div className="react-native-example">
      <h2>AsyncStorage</h2>
      <p>Demonstrates persistent data storage in React Native.</p>
      
      <div className="storage-demo">
        <div className="input-section">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value to store"
          />
          <button onClick={saveItem}>Save</button>
          <button onClick={clearItems}>Clear All</button>
        </div>
        
        <div className="stored-items">
          <h4>Saved Items:</h4>
          {savedItems.length === 0 ? (
            <p>No items saved</p>
          ) : (
            <ul>
              {savedItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <pre>{`
// React Native AsyncStorage:
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StorageExample = () => {
  const [inputValue, setInputValue] = useState('');
  const [savedItems, setSavedItems] = useState([]);

  const saveItem = async () => {
    if (inputValue.trim()) {
      try {
        const newItems = [...savedItems, inputValue];
        await AsyncStorage.setItem('items', JSON.stringify(newItems));
        setSavedItems(newItems);
        setInputValue('');
      } catch (error) {
        console.error('Error saving item:', error);
      }
    }
  };

  const loadItems = async () => {
    try {
      const items = await AsyncStorage.getItem('items');
      if (items) {
        setSavedItems(JSON.parse(items));
      }
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const clearItems = async () => {
    try {
      await AsyncStorage.removeItem('items');
      setSavedItems([]);
    } catch (error) {
      console.error('Error clearing items:', error);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const renderItem = ({ item, index }) => (
    <View style={styles.item}>
      <Text>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={inputValue}
        onChangeText={setInputValue}
        placeholder="Enter value to store"
      />
      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={saveItem} />
        <Button title="Clear All" onPress={clearItems} />
      </View>
      <FlatList
        data={savedItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={<Text style={styles.header}>Saved Items:</Text>}
      />
    </View>
  );
};
      `}</pre>
    </div>
  );
}

// Example 6: Camera Integration
function CameraExample() {
  const [hasPermission, setHasPermission] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const takePicture = () => {
    // Simulate taking a picture
    setCapturedImage(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`);
    setIsCameraActive(false);
  };
  
  const startCamera = () => {
    setIsCameraActive(true);
  };
  
  return (
    <div className="react-native-example">
      <h2>Camera Integration</h2>
      <p>Demonstrates camera usage in React Native.</p>
      
      <div className="camera-demo">
        {!hasPermission ? (
          <p>Camera permission denied</p>
        ) : (
          <>
            {isCameraActive ? (
              <div className="camera-view">
                <div className="camera-preview">
                  <p>Camera Preview (Simulated)</p>
                </div>
                <button onClick={takePicture}>Take Picture</button>
                <button onClick={() => setIsCameraActive(false)}>Close Camera</button>
              </div>
            ) : (
              <div className="camera-controls">
                {capturedImage && (
                  <div className="captured-image">
                    <h4>Captured Image:</h4>
                    <img src={capturedImage} alt="Captured" />
                  </div>
                )}
                <button onClick={startCamera}>Open Camera</button>
              </div>
            )}
          </>
        )}
      </div>
      
      <pre>{`
// React Native Camera with react-native-camera:
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';

const CameraExample = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    const checkCameraPermission = async () => {
      const status = await RNCamera.checkCameraPermission();
      setHasPermission(status === 'authorized');
    };
    checkCameraPermission();
  }, []);

  const takePicture = async (camera) => {
    try {
      const options = { quality: 0.5, base64: true };
      const data = await camera.takePictureAsync(options);
      setCapturedImage(data.uri);
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (!hasPermission) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {capturedImage ? (
        <View style={styles.preview}>
          <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
          <TouchableOpacity
            style={styles.button}
            onPress={() => setCapturedImage(null)}
          >
            <Text style={styles.buttonText}>Take Another</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        >
          {({ camera, status, recordAudioPermissionStatus }) => {
            if (status !== 'READY') return <Text>Loading...</Text>;
            return (
              <View style={styles.captureContainer}>
                <TouchableOpacity
                  onPress={() => takePicture(camera)}
                  style={styles.capture}
                >
                  <Text style={styles.captureText}>CAPTURE</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        </RNCamera>
      )}
    </View>
  );
};
      `}</pre>
    </div>
  );
}

// Example 7: Push Notifications
function NotificationExample() {
  const [token, setToken] = useState('mock-notification-token');
  const [notifications, setNotifications] = useState([]);
  const [permission, setPermission] = useState(true);
  
  const requestPermission = () => {
    setPermission(true);
  };
  
  const sendTestNotification = () => {
    const newNotification = {
      id: Date.now(),
      title: 'Test Notification',
      body: 'This is a test notification from React Native!',
      timestamp: new Date().toLocaleTimeString()
    };
    setNotifications([newNotification, ...notifications]);
  };
  
  return (
    <div className="react-native-example">
      <h2>Push Notifications</h2>
      <p>Demonstrates push notification handling in React Native.</p>
      
      <div className="notification-demo">
        <div className="permission-section">
          <h4>Permission Status: {permission ? 'Granted' : 'Denied'}</h4>
          {!permission && (
            <button onClick={requestPermission}>
              Request Permission
            </button>
          )}
        </div>
        
        <div className="token-section">
          <h4>Device Token:</h4>
          <code>{token}</code>
        </div>
        
        <div className="notification-controls">
          <button onClick={sendTestNotification}>
            Send Test Notification
          </button>
        </div>
        
        <div className="notification-list">
          <h4>Received Notifications:</h4>
          {notifications.length === 0 ? (
            <p>No notifications received</p>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className="notification-item">
                <h5>{notification.title}</h5>
                <p>{notification.body}</p>
                <small>{notification.timestamp}</small>
              </div>
            ))
          )}
        </div>
      </div>
      
      <pre>{`
// React Native Push Notifications with react-native-push-notification:
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import PushNotification from 'react-native-push-notification';

const NotificationExample = () => {
  const [token, setToken] = useState('');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Configure push notifications
    PushNotification.configure({
      onRegister: (token) => {
        console.log('TOKEN:', token);
        setToken(token);
      },
      onNotification: (notification) => {
        console.log('NOTIFICATION:', notification);
        if (notification.userInteraction) {
          setNotifications(prev => [notification, ...prev]);
        }
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    // Create notification channel (Android)
    PushNotification.createChannel(
      {
        channelId: 'default-channel-id',
        channelName: 'Default Channel',
        channelDescription: 'A default channel',
        playSound: false,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(\`createChannel returned '\${created}'\`)
    );
  }, []);

  const sendLocalNotification = () => {
    PushNotification.localNotification({
      channelId: 'default-channel-id',
      title: 'Local Notification',
      message: 'This is a local notification!',
    });
  };

  const sendScheduledNotification = () => {
    PushNotification.localNotificationSchedule({
      channelId: 'default-channel-id',
      title: 'Scheduled Notification',
      message: 'This notification was scheduled!',
      date: new Date(Date.now() + 5 * 1000), // 5 seconds from now
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Push Notifications</Text>
      
      <Text style={styles.label}>Device Token:</Text>
      <Text style={styles.token}>{token}</Text>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Send Local Notification"
          onPress={sendLocalNotification}
        />
        <Button
          title="Send Scheduled Notification"
          onPress={sendScheduledNotification}
        />
      </View>
      
      <Text style={styles.label}>Received Notifications:</Text>
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text>{item.message}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};
      `}</pre>
    </div>
  );
}

// Example 8: Platform-Specific Code
function PlatformExample() {
  const [platform, setPlatform] = useState('web');
  
  const detectPlatform = () => {
    // In real React Native, you'd use Platform.OS
    const detectedPlatform = navigator.userAgent.includes('Mobile') ? 'ios' : 'android';
    setPlatform(detectedPlatform);
  };
  
  return (
    <div className="react-native-example">
      <h2>Platform-Specific Code</h2>
      <p>Demonstrates handling different platforms in React Native.</p>
      
      <div className="platform-demo">
        <button onClick={detectPlatform}>
          Detect Platform
        </button>
        
        <div className="platform-info">
          <h4>Current Platform: {platform}</h4>
          
          {platform === 'ios' && (
            <div className="ios-specific">
              <h5>iOS Specific Features:</h5>
              <ul>
                <li>Native iOS components</li>
                <li>Swift/Objective-C modules</li>
                <li>iOS-specific APIs</li>
              </ul>
            </div>
          )}
          
          {platform === 'android' && (
            <div className="android-specific">
              <h5>Android Specific Features:</h5>
              <ul>
                <li>Native Android components</li>
                <li>Java/Kotlin modules</li>
                <li>Android-specific APIs</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <pre>{`
// React Native Platform-Specific Code:
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

const PlatformExample = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Platform-Specific Code</Text>
      
      {/* Platform-specific styling */}
      <View style={[
        styles.box,
        Platform.OS === 'ios' ? styles.iosBox : styles.androidBox
      ]}>
        <Text>This box has platform-specific styling</Text>
      </View>
      
      {/* Platform-specific components */}
      {Platform.OS === 'ios' && (
        <View style={styles.iosFeature}>
          <Text>iOS-specific feature</Text>
        </View>
      )}
      
      {Platform.OS === 'android' && (
        <View style={styles.androidFeature}>
          <Text>Android-specific feature</Text>
        </View>
      )}
      
      {/* Platform.select for different implementations */}
      <Text style={styles.platformText}>
        {Platform.select({
          ios: 'Running on iOS',
          android: 'Running on Android',
          default: 'Running on unknown platform'
        })}
      </Text>
      
      {/* Platform-specific constants */}
      <Text>Version: {Platform.Version}</Text>
      <Text>OS: {Platform.OS}</Text>
    </View>
  );
};

// Platform-specific file structure:
// MyComponent.ios.js - iOS specific implementation
// MyComponent.android.js - Android specific implementation

// Or using Platform.select:
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  box: {
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  iosBox: {
    backgroundColor: '#007AFF', // iOS blue
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  androidBox: {
    backgroundColor: '#3DDC84', // Android green
    elevation: 5,
  },
  iosFeature: {
    backgroundColor: '#F2F2F7',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  androidFeature: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
});
      `}</pre>
    </div>
  );
}

// Main component that combines all examples
export default function ReactNativeExamples() {
  const [activeExample, setActiveExample] = useState(0);
  
  const examples = [
    { component: BasicComponentExample, title: "Basic Components" },
    { component: FlatListExample, title: "FlatList" },
    { component: NavigationExample, title: "Navigation" },
    { component: GestureExample, title: "Gesture Handling" },
    { component: StorageExample, title: "AsyncStorage" },
    { component: CameraExample, title: "Camera" },
    { component: NotificationExample, title: "Push Notifications" },
    { component: PlatformExample, title: "Platform-Specific" }
  ];
  
  const ActiveExampleComponent = examples[activeExample].component;
  
  return (
    <div className="react-native-examples">
      <h1>React Native Examples</h1>
      <p>Comprehensive examples demonstrating React Native features and patterns.</p>
      
      <div className="example-navigation">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => setActiveExample(index)}
            className={activeExample === index ? 'active' : ''}
          >
            {example.title}
          </button>
        ))}
      </div>
      
      <div className="example-content">
        <ActiveExampleComponent />
      </div>
      
      <div className="info-section">
        <h2>About React Native</h2>
        <p>
          React Native is a framework for building native mobile applications using React. 
          It allows developers to create cross-platform apps for iOS and Android from a single codebase, 
          while maintaining native performance and user experience.
        </p>
        
        <h3>Key Features:</h3>
        <ul>
          <li><strong>Cross-Platform</strong>: Write once, run on both iOS and Android</li>
          <li><strong>Native Performance</strong>: Uses native UI components and APIs</li>
          <li><strong>Hot Reloading</strong>: Instant feedback during development</li>
          <li><strong>Rich Ecosystem</strong>: Extensive library and tool support</li>
          <li><strong>Platform-Specific Code</strong>: Access to native platform features</li>
        </ul>
        
        <h3>Core Components:</h3>
        <ul>
          <li><strong>View</strong>: Container component similar to div</li>
          <li><strong>Text</strong>: For displaying text</li>
          <li><strong>Image</strong>: For displaying images</li>
          <li><strong>ScrollView</strong>: Scrollable container</li>
          <li><strong>FlatList</strong>: Efficient list rendering</li>
          <li><strong>TextInput</strong>: Text input field</li>
          <li><strong>TouchableOpacity</strong>: Touchable button</li>
        </ul>
        
        <h3>Installation:</h3>
        <pre>{`# Create new React Native app
npx @react-native-community/cli@latest init MyApp

# Or with Expo
npx create-expo-app@latest MyApp`}</pre>
        
        <h3>Basic Usage:</h3>
        <pre>{`import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, React Native!</Text>
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
  },
});

export default App;`}</pre>
      </div>
    </div>
  );
}