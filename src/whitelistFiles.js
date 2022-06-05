export const WhiteListFiles = ["js", "ts", "json"];

export const removeWhiteListExtension = (input) => {
  let output = input;

  WhiteListFiles.some((element) => {
    if (input.includes(element)) {
      output = input.replace("." + element, "");
    }
  });
  return output;
};

export const containsWhiteListExtension = (file) => {
  return WhiteListFiles.some((element) => {
    if (file.includes("." + element)) {
      return true;
    }

    return false;
  });
};
