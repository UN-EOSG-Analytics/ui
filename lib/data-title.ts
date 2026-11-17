const acronyms = new Set([
  "UN",
  "UNCT",
  "UNSDG",
  "UNDP",
  "UNICEF",
  "UNFPA",
  "UNHCR",
  "UNESCO",
  "UNEP",
  "UNIDO",
  "UNODC",
  "UNOPS",
  "UNV",
  "WHO",
  "FAO",
  "ILO",
  "IOM",
  "WFP",
  "IFAD",
  "SDG",
  "SDGS",
  "HIV",
  "AIDS",
  "COVID",
  "SRHR",
  "SP",
  "OC",
  "OU",
  "SOU",
]);

/** Normalize fully uppercase source titles while retaining agency names and codes. */
export function formatDataTitle(title: string): string {
  if (title !== title.toUpperCase() || title === title.toLowerCase())
    return title;
  return title.replace(/[\p{L}\p{N}][\p{L}\p{M}\p{N}'’]*/gu, (word) => {
    if (acronyms.has(word) || /\d/.test(word)) return word;
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  });
}
