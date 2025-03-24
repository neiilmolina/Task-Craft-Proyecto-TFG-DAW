export const supabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis(),
  then: jest.fn(),
  catch: jest.fn(),

  auth: {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
    resetPasswordForEmail: jest.fn(),
    updateUser: jest.fn(),
    getUser: jest.fn(),

    admin: {
      listUsers: jest.fn(),
      deleteUser: jest.fn(),
      updateUserById: jest.fn(),
    },
  },
};

export default supabase;
