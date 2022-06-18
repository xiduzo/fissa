type Method = 'GET' | 'POST';

export const request = async (method: Method, route: string, body?: any) => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (method === 'POST' && body !== undefined) {
    options.body = JSON.stringify(body);
  }

  return fetch('https://server-xiduzo.vercel.app/api' + route, options);
};
