import type {PdfRendererViewPropsType} from 'react-native-pdf-renderer/dist/PdfRendererView';
import type {DimensionValue} from 'react-native';

export type PdfComponent = React.ForwardRefExoticComponent<PdfProps>

export interface PdfProps extends Omit<PdfRendererViewPropsType, 'source'> {
  /** The source of the PDF document */
  src: string | ArrayBuffer | Uint8Array,
  /** The width of the PDF document */
  width?: DimensionValue,
  /** The height of the PDF document */
  height?: DimensionValue,
  /** The component to render in place of a loading page (web only) */
  placeholder?: React.ReactNode,
}

export interface PdfRef {
  /** Go to the previous page */
  prevPage: () => void,
  /** Go to the next page */
  nextPage: () => void,
}
