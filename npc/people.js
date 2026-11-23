const names =
  "Nell Kit Finn Ida Silas Lark Maya Wes Iris Ada Joel Remy Bea Luca Cora Otto Inez Nico Tess Eli Cleo Jules Aya Leon June Theo Vera Milo Sia Bram Mika Esme Hugo Rae Bo Nina Sam Zora Max Eve".split(
    " ",
  );
// Stable identities cross systems. Simulation-specific roles and abilities belong to each scenario.
export const people = names.map((name, index) => ({
  index,
  key: name.toLowerCase(),
  name,
}));
export const byKey = Object.fromEntries(
  people.map((person) => [person.key, person]),
);
