import { blackListExtensions, blackListDirs } from "../temp/tempInfo";

export const removeBlackListExtension = (input: string) => {
  let output = input;

  blackListExtensions.some((element) => {
    if (input.includes(element)) {
      output = input.replace(element, "");
    }
  });
  return output;
};

export const containsBlackListExtension = (input: string) => {
  return blackListExtensions.some((element) => {
    if (input.includes(element)) {
      return true;
    }

    return false;
  });
};

export const containsBlacklistDir = (path: string) => {
  return blackListDirs.some((element) => {
    if (path.includes(element)) {
      return true;
    }

    return false;
  });
};
