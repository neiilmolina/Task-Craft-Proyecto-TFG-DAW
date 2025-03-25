const mysql = {
  createConnection: jest.fn().mockReturnValue({
    connect: jest.fn(), // Mockea el método connect
    query: jest.fn(),   // Mockea el método query con jest.fn()
    end: jest.fn(),     // Opcional: Si usas end() en alguna parte, también puedes mockearlo
  }),
};

export default mysql;