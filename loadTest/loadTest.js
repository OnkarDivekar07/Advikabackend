import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,         // 100 virtual users
  duration: '30s',  // for 30 seconds
};

export default function () {
  const res = http.get('https://advikafront.vercel.app/api/products');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1); // wait 1 second before next request
}
