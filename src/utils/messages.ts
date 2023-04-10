interface Message {
  username: string;
  text: string;
  createdAt: number;
}

interface LocationMessage {
  username: string;
  url: string;
  createdAt: number;
}

const generateMessage = (username: string, text: string): Message => {
  return {
    username,
    text,
    createdAt: new Date().getTime(),
  };
};

const generateLocationMessage = (
  username: string,
  url: string
): LocationMessage => {
  return {
    username,
    url,
    createdAt: new Date().getTime(),
  };
};

export { generateMessage, generateLocationMessage, Message, LocationMessage };
