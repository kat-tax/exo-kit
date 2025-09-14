import {defineConfig} from 'tsdown';

export default defineConfig({
  platform: 'neutral',
  outDir: './lib2',
  dts: {
    oxc: true,
  },
  entry: {
    // Entry
    index: 'src/index.ts',
    // Assets
    book: 'src/assets/book/Book.export',
    code: 'src/assets/code/Code.export',
    game: 'src/assets/game/Game.export',
    icon: 'src/assets/icon/Icon.export',
    image: 'src/assets/image/Image.export',
    lottie: 'src/assets/lottie/Lottie.export',
    map: 'src/assets/map/Map.export',
    markdown: 'src/assets/markdown/Markdown.export',
    model: 'src/assets/model/Model.export',
    pdf: 'src/assets/pdf/Pdf.export',
    rive: 'src/assets/rive/Rive.export',
    video: 'src/assets/video/Video.export',
    // Layout
    gesture: 'src/layout/gesture/Gesture.export',
    grid: 'src/layout/grid/Grid.export',
    motion: 'src/layout/motion/Motion.export',
    navigation: 'src/layout/navigation/Navigation.export',
    skeleton: 'src/layout/skeleton/Skeleton.export',
    // Services
    device: 'src/services/device/Device.export',
    fs: 'src/services/fs/Fs.export',
    kv: 'src/services/kv/Kv.export',
    redux: 'src/services/redux/Redux.export',
    toast: 'src/services/toast/Toast.export',
    // Widgets
    checkbox: 'src/widgets/checkbox/Checkbox.export',
    picker: 'src/widgets/picker/Picker.export',
    progress: 'src/widgets/progress/Progress.export',
    radio: 'src/widgets/radio/Radio.export',
    slider: 'src/widgets/slider/Slider.export',
    switch: 'src/widgets/switch/Switch.export',
    // Utils
    utils: 'src/utilities/index.ts',
  },
})
