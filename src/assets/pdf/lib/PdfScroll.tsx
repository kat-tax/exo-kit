import {useMemo, useState} from 'react';
import {LegendList} from '@legendapp/list';
import {View} from 'react-native';
import {PdfPage} from './PdfPage';
import {usePdf} from './PdfContext';

import type {PdfProps} from '../Pdf.interface';

export function PdfScroll(props: Omit<PdfProps, 'src' | 'onPageChange'>) {
  const {pageCount, setCurrentPage, listRef} = usePdf();
  const [height, setHeight] = useState(typeof props.height === 'number' ? props.height : 682);
  const indices = useMemo(() => Array.from({length: pageCount}, (_, i) => i + 1), [pageCount]);
  const gap = (props.distanceBetweenPages ?? 16) * (72 / 96);
  return (
    <LegendList
      ref={listRef}
      data={indices}
      extraData={height}
      drawDistance={height * 5}
      estimatedItemSize={height}
      keyExtractor={i => i.toString()}
      contentContainerStyle={props.style}
      style={{
        width: props.width ?? '100%',
        height: props.height ?? '100%',
      }}
      renderItem={({item}) =>
        <PdfPage {...{item, height}}/>}
      ItemSeparatorComponent={() =>
        <View style={{height: gap}}/>}
      onViewableItemsChanged={({viewableItems}) =>
        setCurrentPage(viewableItems[0]?.item ?? 0)}
      onItemSizeChanged={(info) => {
        const expectedHeight = height - gap;
        if (info.size !== expectedHeight) {
          setHeight(expectedHeight);
        }
      }}
    />
  );
}
