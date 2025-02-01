import {useMemo, useState} from 'react';
import {LegendList} from '@legendapp/list';
import {View} from 'react-native';
import {PdfPage} from './PdfPage';
import {usePdf} from './PdfContext';

import type {PdfProps} from '../Pdf.interface';

export function PdfScroller(props: PdfProps) {
  const {pageCount} = usePdf();
  const [height, setHeight] = useState(typeof props.height === 'number' ? props.height : 555);
  const list = useMemo(() => Array.from({length: pageCount}, (_, i) => i), [pageCount]);

  return (
    <LegendList
      data={list}
      keyExtractor={i => i.toString()}
      drawDistance={height * 2}
      estimatedItemSize={height}
      contentContainerStyle={props.style}
      style={{
        width: props.width ?? '100%',
        height: props.height ?? '100%',
      }}
      onItemSizeChanged={(info) => {
        console.log('>> pdf [web] onItemSizeChanged', info);
        setHeight(info.size);
      }}
      ItemSeparatorComponent={() =>
        <View style={{height: (props.distanceBetweenPages ?? 16) * (72 / 96)}}/>
      }
      renderItem={({item}) => (
        <PdfPage
          page={item}
          width={props.width}
          height={props.height}
        />
      )}
      onViewableItemsChanged={({viewableItems}) => {
        console.log('>> pdf [web] viewableItems', viewableItems);
      }}
    />
  );
}
