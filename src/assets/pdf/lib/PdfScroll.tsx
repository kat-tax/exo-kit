import {useMemo} from 'react';
import {LegendList} from '@legendapp/list';
import {View} from 'react-native';
import {PdfPage} from './PdfPage';
import {usePdf} from './PdfContext';

import type {PdfProps} from '../Pdf.interface';

export function PdfScroll(props: PdfProps) {
  const {pageCount, pageSize, setPageSize} = usePdf();
  const list = useMemo(() => Array.from({length: pageCount}, (_, i) => i), [pageCount]);
  const gap = (props.distanceBetweenPages ?? 16) * (72 / 96);
  const [width, height] = pageSize;
  return (
    <LegendList
      data={list}
      keyExtractor={i => i.toString()}
      drawDistance={height * 5}
      estimatedItemSize={height}
      waitForInitialLayout
      contentContainerStyle={props.style}
      style={{
        width: props.width ?? '100%',
        height: props.height ?? '100%',
      }}
      onItemSizeChanged={(info) => {
        // console.log('>> [pdf] onItemSizeChanged', info);
        const expectedHeight = height - gap;
        if (info.size !== expectedHeight) {
          setPageSize([width, expectedHeight]);
        }
      }}
      ItemSeparatorComponent={() =>
        <View style={{height: gap}}/>
      }
      renderItem={({item}) => (
        <PdfPage page={item}/>
      )}
      onViewableItemsChanged={({viewableItems}) => {
        console.log('>> pdf [web] viewableItems', viewableItems);
      }}
    />
  );
}
