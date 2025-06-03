import http from "k6/http";
import { sleep } from "k6";

export const options = {
  // Define stages to gradually ramp up VUs
  stages: [{ duration: "10m", target: 100000 }],
  // Maximum number of VUs to allocate
  vus: 100,
  // Maximum possible VUs to scale to
  maxVUs: 1000000,
  // Thresholds remain the same
  thresholds: {
    http_req_failed: [
      {
        threshold: "rate<=0.01",
        abortOnFail: true,
      },
    ],
  },
};

export default () => {
  const urlRes = http.get("http://localhost:8080/medico/1");
  sleep(1);
};
