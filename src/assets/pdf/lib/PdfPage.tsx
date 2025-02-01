import {useState, useEffect} from 'react';
import {usePdf} from './PdfContext';

interface PdfPageProps {
  page: number,
}

export function PdfPage(props: PdfPageProps) {
  const [dataUri, setDataUri] = useState<string>();
  const {renderPage, pageSize} = usePdf();
  const [_width, height] = pageSize;
  const {page} = props;

  useEffect(() => {
    let url: string;
    renderPage(page).then(png => {
      if (!png) return;
      url = URL.createObjectURL(new Blob([png], {type: 'image/png'}));
      setDataUri(url);
    });
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    }
  }, [renderPage, page]);

  return dataUri
    ? <img src={dataUri} alt={`Page ${page}`}/>
    : <div style={{width: '100%', height: `${height}px`}}/>
}
