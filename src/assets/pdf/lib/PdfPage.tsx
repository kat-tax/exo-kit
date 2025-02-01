import {useState, useEffect} from 'react';
import {usePdf} from './PdfContext';

import type {DimensionValue} from 'react-native';

interface PdfPageProps {
  page: number,
  width?: DimensionValue,
  height?: DimensionValue,
}

export function PdfPage(props: PdfPageProps) {
  const [img, setImg] = useState<string>();
  const {renderPage} = usePdf();
  const {page} = props;

  const height = typeof props.height === 'number'
    ? `${props.height}px`
    : props.height?.toString()
      ?? '100%';

  useEffect(() => {
    console.log('>> pdf render page', page);
    let url: string;
    renderPage(page).then(png => {
      if (!png) return;
      url = URL.createObjectURL(new Blob([png], {type: 'image/png'}));
      setImg(url);
    });
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    }
  }, [renderPage, page]);

  return img
    ? <img src={img} alt={`Page ${page}`}/>
    : <div style={{width: '100%', height}}/>
}
