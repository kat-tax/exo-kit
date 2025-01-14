import {ScrollView} from 'react-native';
import {PdfPage} from './PdfPage';

import type {ScrollViewProps} from 'react-native';
import type {PdfProps} from '../Pdf.interface';
import type {useMupdf} from './useMupdf';

interface PdfScrollerProps extends PdfProps {
  pdf: ReturnType<typeof useMupdf>,
  onScroll: ScrollViewProps['onScroll'],
}

export function PdfScroller({pdf, onScroll, ...props}: PdfScrollerProps) {
  return (
    <ScrollView
      onScroll={onScroll}
      scrollEventThrottle={1000}
      style={{
        width: props.width ?? '100%',
        height: props.height ?? '100%',
      }}
      contentContainerStyle={[
        {
          gap: (props.distanceBetweenPages ?? 16) * (72 / 96),
        },
        props.style,
      ]}>
      {Array.from({length: pdf.pageCount}, (_, i) => (
        <PdfPage
          key={i.toString()}
          index={i}
          render={pdf.renderPage}
          width={props.width}
          height={props.height}
        />
      ))}
    </ScrollView>
  );
}
