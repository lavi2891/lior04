// express-session.d.ts
declare module 'express-session' {
    interface Session {
      user_id: number; // Assuming userId is a number, you can adjust the type accordingly
    }
  }