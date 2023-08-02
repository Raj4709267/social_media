export const getFriendDetailsFromChat = (chatUsers, user) => {
  if (!chatUsers || !user) {
    return null;
  }
  return chatUsers.filter((item) => item._id !== user.userId)[0];
};
