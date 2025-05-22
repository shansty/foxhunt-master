export const getSideBarMenuPadding = (depth) => {
  let paddingLeft = 22;

  if (depth > 0) {
    paddingLeft = 16 + 20 * depth;
  }
  return { paddingLeft };
};
