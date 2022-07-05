export const setWindowSize = () => {
  const size = document.body.clientWidth - 32;

  document
    .getElementById("cy")
    ?.setAttribute(
      "style",
      `height: ${size}px; width: ${size}px; background-color: #1e1e1e;`
    );

  document
    .getElementById("cy-relative")
    ?.setAttribute(
      "style",
      `height: ${size}px; width: ${size}px; background-color: #1e1e1e;`
    );
};
