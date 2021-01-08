exports.generateNoteIDs = (num) => {
  const arr = [];
  for (let i = 0; i < 30; i++) arr.push(`note${i}`);
  return arr;
}