// @ts-ignore
globalThis.global = {};

// Temp: workaround for vocs
if (typeof navigator === 'undefined') {
  console.log('navigator is undefined');
  globalThis.navigator = {
    clipboard: {
      // @ts-ignore
      writeText: () => {},
    }
  };
}

export default function Layout(props: React.PropsWithChildren) {
  return props.children;
}
