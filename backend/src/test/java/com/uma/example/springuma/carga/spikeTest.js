import http from "k6/http";
import { sleep } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 307 }, // Spike to 307 users quickly
    { duration: "2m", target: 307 }, // Stay at peak for 1 minute
    { duration: "10s", target: 0 }, // Scale back down
  ],
  thresholds: {
    http_req_failed: [
      {
        threshold: "rate<=0.5",
        abortOnFail: true,
      },
    ],
  },
};

export default () => {
  const urlRes = http.get("http://localhost:8080/medico/1");
  sleep(1);
};
