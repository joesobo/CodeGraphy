import { whiteListExtensions, whiteListDirs } from "../../temp/tempInfo";

export const removeWhiteListExtension = (input: string) => {
  let output = input;

  whiteListExtensions.some((element) => {
    if (input.includes(element)) {
      output = input.replace(element, "");
    }
  });
  return output;
};

export const containsWhiteListExtension = (
  input: string,
  whitelistSettings: string[]
) => {
  if (whitelistSettings.length === 0) return true;

  return whitelistSettings.some((element) => {
    const inputExtension = `.${input.split(".").pop()}`;

    if (inputExtension === element) {
      return true;
    }

    return false;
  });
};

export const containsWhitelistDir = (path: string) => {
  return whiteListDirs.some((element) => {
    if (path.includes(element)) {
      return true;
    }

    return false;
  });
};
