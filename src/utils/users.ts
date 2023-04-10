interface User {
  id: string;
  username: string;
  room: string;
}

const users: User[] = [];

const addUser = ({ id, username, room }: User) => {
  // Clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate the data
  if (!username || !room) {
    return {
      error: "Username and room are required!",
    };
  }

  // Check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  // Validate username
  if (existingUser) {
    return {
      error: "Username is in use!",
    };
  }

  // Store user
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id: string) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id: string) => {
  return users.find((user) => user.id === id);
};

const getUsersInRoom = (room: string) => {
  room = room.trim().toLowerCase();
  return users.filter((user) => user.room === room);
};

export { addUser, removeUser, getUser, getUsersInRoom };
