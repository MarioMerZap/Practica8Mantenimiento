
import http from "k6/http";
import { sleep } from "k6";

/*
Smoke test: prueba básica con 5 usuarios virtuales (VU) durante 1 minuto 💨. 
En esta prueba todas las comprobaciones realizadas (al menos el código HTTP de respuesta) 
deben de ser positivas, no debe de haber peticiones fallidas, y el promedio de la duración 
de las peticiones (http_req_duration) debe de ser inferior a 500ms. 
En cualquier otro caso se aborta el test.
*/

export const options = {
  vus: 5, // 5 usuarios virtuales
  duration: "1m", // Esto puede ser más corto o sólo unas pocas iteraciones
  thresholds: {
    http_req_failed: [
      {
        threshold: "rate<=0",
        abortOnFail: true,
      },
    ],
    http_req_duration: [
      {
        threshold: "avg<500",
        abortOnFail: true,
      },
    ],
  },
};
export default () => {
  const urlRes = http.get("http://localhost:8080/medico/1");
  sleep(1);
};
