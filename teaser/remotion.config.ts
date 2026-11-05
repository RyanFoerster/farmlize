import { Config } from '@remotion/cli/config';
import { existsSync } from 'node:fs';

// Sous Windows, on réutilise Chrome s'il est installé (sinon Remotion télécharge son propre Chrome Headless Shell)
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
if (process.platform === 'win32' && existsSync(chrome)) Config.setBrowserExecutable(chrome);

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
Config.setCrf(16);
Config.setPixelFormat('yuv420p');
Config.setColorSpace('bt709');
Config.setOverwriteOutput(true);
