import { ID_TOKEN, TEST_STREAMS } from "./constants";
import { FFMpegRecorder } from "./recorder/FFMpegRecorde";
import { RecParams } from "./types/RecParams";

async function main() {
  console.log("Main function started.");

  const rec = new FFMpegRecorder();
  const p: RecParams = {
    url: TEST_STREAMS.STREAM_1,
    durationInSec: 6,
    outPut: `output${ID_TOKEN}.mp4`,
    audioOn: false,
  };

  try {
    rec.start(p);
    console.log("Recording started successfully.");
    // setTimeout(async () => {
    //   await rec.stop();
    //   console.log("Recording stopped.");
    // }, p.durationInSec * 1000);
  } catch (err) {
    console.error("Error during recording:", err);
  }
}

main()
  .then(() => console.log("Main function completed."))
  .catch((err) => console.error("Error in main function:", err));
