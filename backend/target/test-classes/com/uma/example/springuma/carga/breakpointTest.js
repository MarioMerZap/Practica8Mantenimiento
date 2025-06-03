import http from "k6/http";
import { sleep } from "k6";

/*
Breakpoint test: con esta prueba vamos a romper nuestro servidor 💣. 
En primer lugar, realiza la prueba con un executor de ‘ramping-arrival-rate’ 
durante 10 minutos y al menos 100000 VUs. Posteriormente realiza una prueba 
sin executors, es decir, directamente con stages para comparar los resultados. 
¿Qué diferencias hay? En todos los casos el punto de terminación de los tests, 
y por tanto, de rotura, se alcanzará una vez las peticiones fallidas sean 
mayores al 1%. Apunta bien el número de VUs máximo sin executors ya que 
lo necesitarás para los próximos tests 🔜.
*/

export const options = {
  scenarios: {
    breakpoint: {
      executor: "ramping-arrival-rate", // Incrementa la carga exponencial
      preAllocatedVUs: 100, //VUs alocados inicialmente
      maxVUs: 1e7, //VUs maximo
      stages: [{ duration: "10m", target: 100000 }],
    },
  },
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
