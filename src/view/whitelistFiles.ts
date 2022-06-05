export const WhiteListFiles = ["js", "ts", "json"];

export const removeWhiteListExtension = (input: string) => {
  let output = input;

  WhiteListFiles.some((element) => {
    if (input.includes(element)) {
      output = input.replace("." + element, "");
    }
  });
  return output;
};

export const containsWhiteListExtension = (input: string) => {
  return WhiteListFiles.some((element) => {
    if (input.includes("." + element)) {
      return true;
    }

    return false;
  });
};
