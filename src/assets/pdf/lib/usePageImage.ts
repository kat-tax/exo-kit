import {useState, useEffect} from 'react';

export function usePageImage(
  index: number,
  render: (index: number) => Promise<Uint8Array>,
) {
  const [img, setImg] = useState<string>();

  // Load Page Image
  useEffect(() => {
    let url: string;
    render(index).then(png => {
      url = URL.createObjectURL(new Blob([png], {type: 'image/png'}));
      setImg(url);
    });
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    }
  }, [index, render]);

  return img;
}
