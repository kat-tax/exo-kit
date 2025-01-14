import type {GameProps} from '../Game.interface';

export default (props: GameProps) => `
<html>
  <head>
    <style>
      body, html, #game {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
      }
    </style>
  </head>
  <body>
    <div id="game"></div>
    <script>
      EJS_player = "#game";
      EJS_core = "${props.platform}";
      EJS_gameUrl = "${props.url}";
      EJS_gameName = "${props.name}";
      EJS_biosUrl = "${props.bios}";
      EJS_loadStateURL = "${props.save ?? ''}";
      EJS_gamePatchUrl = "${props.patch ?? ''}";
      EJS_gameParentUrl = "${props.parent ?? ''}";
      EJS_cheats = ${props.cheats ? JSON.stringify(props.cheats) : '[]'};
      EJS_threads = ${props.threads?.toString() ?? 'false'};
      EJS_startOnLoaded = ${props.startOnLoaded?.toString() ?? 'false'};
      EJS_fullscreen = ${props.fullscreen?.toString() ?? 'false'};
      EJS_volume = ${props.volume?.toString() ?? 1};
      EJS_language = "${props.language ?? 'en-US'}";
      EJS_backgroundColor = "${props.background ?? '#000'}";
      EJS_backgroundBlur = "${props.blur?.toString() ?? 'false'}";
      EJS_color = "${props.accent ?? '#00FF80'}";
      EJS_Buttons = ${props.controls === false ? {
        exitEmulation: false,
        contextMenuButton: false,
        playPause: false,
        restart: false,
        mute: false,
        settings: false,
        fullscreen: false,
        saveState: false,
        loadState: false,
        screenRecord: false,
        gamepad: false,
        cheat: false,
        volume: false,
        saveSavFiles: false,
        loadSavFiles: false,
        quickSave: false,
        quickLoad: false,
        screenshot: false,
        cacheManager: false
      } : 'undefined'};
      EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
      EJS_ready = function() {
        onmessage = function(event) {
          console.log(event);
          const {type, data} = JSON.parse(event);
          switch (type) {
            case 'emu:pause':
              return EJS_emulator.pause();
            case 'emu:play':
              return EJS_emulator.play();
          }
        };
      };
    </script>
    <script src="https://cdn.emulatorjs.org/stable/data/loader.js"></script>
  </body>
</html>
`;
