import { spawn, ChildProcess } from "child_process";
import { RecParams } from "../types/RecParams";
import { ERRORS, ID_TOKEN } from "../constants";

export class FFMpegRecorder {
  private ffmpegArgs: string[] | undefined;
  private ffmpegProcess: ChildProcess | undefined;
  private params: RecParams | undefined;

  public async start(parms: RecParams): Promise<void> {
    console.log("Starting recorder with parameters:", parms);
    const { url, durationInSec, outPut } = parms;
    const id = Math.floor(Math.random() * 1000);
    const outpfile = outPut.replace(ID_TOKEN, id.toString());

    if (!url || !durationInSec || !outPut) {
      throw new Error(ERRORS.NULL_CONTRACTOR_PARAMS);
    }

    this.params = parms;
    this.ffmpegArgs = [
      "-i",
      url,
      "-t",
      String(durationInSec),
      "-c:v",
      "copy", // Copy video codec (no re-encoding)
      "-c:a",
      "aac", // Use AAC audio codec
      outpfile,
    ];

    return new Promise((resolve, reject) => {
      console.log("FFmpeg arguments:", this.ffmpegArgs);

      // Spawn the FFmpeg process
      this.ffmpegProcess = spawn("ffmpeg", this.ffmpegArgs);

      // Capture stdout
      this.ffmpegProcess.stdout?.on("data", (data: Buffer) => {
        console.log("FFmpeg stdout:", data.toString());
      });

      // Capture stderr
      this.ffmpegProcess.stderr?.on("data", (data: Buffer) => {
        console.error("FFmpeg stderr:", data.toString());
      });

      // Handle process close
      this.ffmpegProcess.on("close", (code: number) => {
        if (code === 0) {
          console.log("Recording completed successfully:", outPut);
          resolve();
        } else {
          console.error(`FFmpeg exited with code ${code}`);
          reject(new Error(`FFmpeg process failed with exit code: ${code}`));
        }
      });

      // Handle process errors
      this.ffmpegProcess.on("error", (err: Error) => {
        console.error("FFmpeg process error:", err);
        reject(err);
      });
    });
  }

  public async stop(): Promise<void> {
    if (!this.ffmpegProcess) {
      throw new Error(ERRORS.STOP_NOT_IMPLEMETED);
    }

    this.ffmpegProcess.kill("SIGTERM"); // Send SIGTERM to terminate FFmpeg
    console.log("FFmpeg recording stopped.");
  }
}
