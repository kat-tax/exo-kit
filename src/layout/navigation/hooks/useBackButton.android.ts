import {useCallback, useEffect} from 'react';
import {BackHandler} from 'react-native';

export function useBackButton(callback: () => boolean) {
  const handler = useCallback(() => (callback()), [callback]);

  useEffect(() =>
    BackHandler.addEventListener('hardwareBackPress', handler).remove,
    [handler],
  );
}
