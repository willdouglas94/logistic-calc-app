export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Calculation {
  id: string;
  userId: string;
  supplierName: string;
  palletCount: number;
  startTime: string;
  unloadingTime: string;
  labelingTime: string;
  inspectionTime: string;
  storageTime: string;
  totalTime: string;
  createdAt: string;
}

const STORAGE_KEY = 'logistics_app_user';
const USERS_KEY = 'logistics_app_users';
const CALCULATIONS_KEY = 'logistics_app_calculations';

export const auth = {
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem(STORAGE_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },

  login: (email: string, password: string): User | null => {
    const usersJson = localStorage.getItem(USERS_KEY);
    const users: Array<User & { password: string }> = usersJson ? JSON.parse(usersJson) : [];
    
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    }
    return null;
  },

  signup: (name: string, email: string, password: string): User | null => {
    const usersJson = localStorage.getItem(USERS_KEY);
    const users: Array<User & { password: string }> = usersJson ? JSON.parse(usersJson) : [];
    
    if (users.find(u => u.email === email)) {
      return null; // User already exists
    }

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
  },
};

export const calculations = {
  save: (calculation: Omit<Calculation, 'id' | 'createdAt'>): Calculation => {
    const calcJson = localStorage.getItem(CALCULATIONS_KEY);
    const calcs: Calculation[] = calcJson ? JSON.parse(calcJson) : [];
    
    const newCalc: Calculation = {
      ...calculation,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    calcs.push(newCalc);
    localStorage.setItem(CALCULATIONS_KEY, JSON.stringify(calcs));
    return newCalc;
  },

  getAll: (userId: string): Calculation[] => {
    const calcJson = localStorage.getItem(CALCULATIONS_KEY);
    const calcs: Calculation[] = calcJson ? JSON.parse(calcJson) : [];
    return calcs.filter(c => c.userId === userId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
};
