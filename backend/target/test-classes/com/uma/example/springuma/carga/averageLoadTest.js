import http from "k6/http";
import { sleep } from "k6";

export const options = {
  stages: [
    { duration: "3m", target: 399 }, // subimos a un carga de estres de VUs en 3 minutos
    { duration: "3m", target: 399 },
    { duration: "2m", target: 0 }, // bajamos a 0 VU
  ],
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
