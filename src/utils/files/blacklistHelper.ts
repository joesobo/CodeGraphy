export const containsBlacklist = (
  input: string,
  blacklistSettings: string[]
) => {
  return blacklistSettings.some((element) => {
    if (input.includes(element)) {
      return true;
    }

    return false;
  });
};
