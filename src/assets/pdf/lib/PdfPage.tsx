import {useState, useEffect} from 'react';
import {usePdf} from './PdfContext';

interface PdfPageProps {
  item: number,
  height: number,
}

export function PdfPage(props: PdfPageProps) {
  const [dataUri, setDataUri] = useState<string>();
  const {renderPage} = usePdf();
  const {item, height} = props;

  useEffect(() => {
    let url: string;
    renderPage(item).then(png => {
      if (!png) return;
      url = URL.createObjectURL(new Blob([png], {type: 'image/png'}));
      setDataUri(url);
    });
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    }
  }, [item, renderPage]);

  return dataUri
    ? <img src={dataUri} alt={`Page ${item}`}/>
    : <div style={{width: '100%', height: `${height}px`}}/>
}
