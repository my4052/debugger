export enum ProtocolCommands {
  'Input.dispatchKeyEvent' = 'Input.dispatchKeyEvent',
  'Input.emulateTouchFromMouseEvent' = 'Input.emulateTouchFromMouseEvent',
}

export enum HostCommands {
  'start' = 'start',
  'run' = 'run',
  'close' = 'close',
  'setViewport' = 'setViewport',
  'gotoUrl' = 'gotoUrl',
  'goBack' = 'goBack',
  'goForward' = 'goForward',
}

export enum WorkerCommands {
  'startComplete' = 'startComplete',
  'runComplete' = 'runComplete',
  'screencastFrame' = 'screencastFrame',
  'browserClose' = 'browserClose',
  'error' = 'error',
  'popup' = 'popup',
}

export interface Message {
  command: string,
  data: any,
}
