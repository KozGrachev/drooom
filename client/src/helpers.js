exports.generateNoteIDs = (num) => {
  const arr = [];
  for (let i = 0; i < 30; i++) arr.push(`note${i}`);
  return arr;
}

exports.noteIDs = [
  'note0', 'note1', 'note2',
  'note3', 'note4', 'note5',
  'note6', 'note7', 'note8',
  'note9', 'note10', 'note11',
  'note12', 'note13', 'note14',
  'note15', 'note16', 'note17',
  'note18', 'note19', 'note20',
  'note21', 'note22', 'note23',
  'note24', 'note25', 'note26',
  'note27', 'note28', 'note29'
];

exports.buttonColor = {
  lead: 'yellow',
  bass: 'red',
}

