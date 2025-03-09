import {Linking} from 'react-native';

let incId = new Date().getTime();

export function getUniqueID() {
  incId++;
  return `rnmd_${incId.toString(16)}`;
}

export function openUrl(
  url: string,
  onLinkPress?: (url: string) => boolean,
): void {
  if (onLinkPress) {
    const result = onLinkPress(url);
    if (url && result && typeof result === 'boolean') {
      Linking.openURL(url);
    }
  } else if (url) {
    Linking.openURL(url);
  }
}
