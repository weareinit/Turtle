import { Worker, isMainThread, parentPort, workerData } from "worker_threads";

/**
 * #### WIP
 * here i'm trying to create  process that runs on a "second thread"
 * that sends at most 50 reminder emails per hour
 * @param {*} path
 * @param {*} workerData
 */
function runService(path, workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path, { workerData: Script });
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", code => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

export default runService;
