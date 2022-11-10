import Notification from './Notification';
import {API_ENDPOINT} from '../constants/Endpoint';

type Method = 'GET' | 'POST';

export const request = async <T>(
  method: Method,
  route: string,
  body?: any,
): Promise<{
  content: T;
  status: number;
}> => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (method === 'POST' && body !== undefined) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(API_ENDPOINT + route, options);

  if (response.status !== 200) {
    Notification.show({
      type: 'warning',
      message: 'Oops... something went wrong',
    });
    return Promise.reject(response.status);
  }

  return Promise.resolve({
    content: (await response.json()) as T,
    status: response.status,
  });
};
