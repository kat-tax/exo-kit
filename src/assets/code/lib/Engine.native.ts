import {createNativeEngine, isNativeEngineAvailable} from 'react-native-shiki-engine';

export default Promise.resolve(isNativeEngineAvailable() ? createNativeEngine() : null);
