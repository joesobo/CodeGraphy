// returns true for anything that matches in the blacklist
// Expected blacklist settings:
// .js
// file.js
// folder/
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
