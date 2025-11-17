export interface IconRemoteProps {
  /** The name of the icon to display */
  name: string,
  /** The size of the icon */
  size?: `${number}%` | number,
  /** The color of the icon */
  color?: string,
}

export const ICONIFY_HOST = 'https://api.iconify.design';

export const getUrl = (name: string) =>
  `${ICONIFY_HOST}/${name.replace(':', '/')}.svg`;
