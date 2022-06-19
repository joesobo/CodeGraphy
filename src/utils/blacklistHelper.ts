import { blackListDirs } from "../temp/tempInfo";

export const containsBlacklistDir = (path: string) => {
  return blackListDirs.some((element) => {
    if (path.includes(element)) {
      return true;
    }

    return false;
  });
};
