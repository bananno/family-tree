// The send, json, and status methods are chainable (they return res):
export const res = {
  send: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
};

export function expectResStatus(status) {
  expect(res.status).toHaveBeenCalledWith(status);
}

afterEach(() => {
  res.send.mockClear();
  res.json.mockClear();
  res.status.mockClear();
});
