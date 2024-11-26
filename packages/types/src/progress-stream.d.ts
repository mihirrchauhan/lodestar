declare module 'progress-stream' {
    import { Transform } from 'stream';
  
    interface ProgressStreamOptions {
      length: number; // Total length of the data being processed
      time?: number;  // Time interval to emit progress events
    }
  
    function progressStream(options?: ProgressStreamOptions): Transform;
  
    export = progressStream;
  }
  