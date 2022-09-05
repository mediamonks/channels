import { newServer } from 'mock-xmlhttprequest';

export const mockXMLHttpRequest = () => {
  const server = newServer({
    get: [
      () => true,
      {
        status: 200,
        body: new ArrayBuffer(10000000),
      } as any,
    ],
  });
  server.install();
};
