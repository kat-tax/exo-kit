import {usePageImage} from './usePageImage';

interface PdfPageProps {
  index: number,
  width?: number | string,
  height?: number | string,
  render: (index: number) => Promise<Uint8Array>,
}

export function PdfPage({index, width, height, render}: PdfPageProps) {
  const img = usePageImage(index, render);

  if (!img) {
    return (
      <div style={{width, height}}/>
    );
  }

  return (
    <img src={img} alt={`Page ${index}`}/>
  );
}
