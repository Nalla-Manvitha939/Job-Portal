
export interface User {
  id: number;
  fullName: string;
  email: string;
  mobile?: string;
  password: string;
  role: "user" | "recruiter" | "admin";
  createdAt: string;
}

const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

export const getUsers = (): User[] => {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const registerUser = (
  userData: Omit<User, "id" | "createdAt">
) => {
  const users = getUsers();

  const exists = users.some(
    (u) => u.email.toLowerCase() === userData.email.toLowerCase()
  );

  if (exists) {
    return {
      success: false,
      message: "Email already exists.",
    };
  }

  const newUser: User = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...userData,
  };

  users.push(newUser);

  saveUsers(users);

  return {
    success: true,
    user: newUser,
  };
};

export const loginUser = (
  email: string,
  password: string
) => {
  const users = getUsers();

  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
  );

  if (!user) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  localStorage.setItem(
    CURRENT_USER_KEY,
    JSON.stringify(user)
  );

  return {
    success: true,
    user,
  };
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);

  return user ? JSON.parse(user) : null;
};

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const isLoggedIn = () => {
  return !!getCurrentUser();
};

export const hasRole = (
  role: User["role"]
) => {
  const user = getCurrentUser();

  return user?.role === role;
};

export const seedDemoAccounts = () => {
  const users = getUsers();

  if (users.length > 0) return;

  const demoUsers: User[] = [
    {
      id: 1,
      fullName: "Administrator",
      email: "admin@jobportal.com",
      mobile: "9999999999",
      password: "admin123",
      role: "admin",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      fullName: "Recruiter",
      email: "recruiter@jobportal.com",
      mobile: "8888888888",
      password: "recruiter123",
      role: "recruiter",
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      fullName: "Demo User",
      email: "user@jobportal.com",
      mobile: "7777777777",
      password: "user123",
      role: "user",
      createdAt: new Date().toISOString(),
    },
  ];

  saveUsers(demoUsers);
};