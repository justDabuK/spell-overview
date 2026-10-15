// 5etools tags look like {@tag text|source|display...}; [^|}] keeps each match inside its own tag.
export const highlightSpecialParts = (text: string) => {
  return text
    .replace(/\{@damage ([^}]+)}/g, "<strong>$1</strong>")
    .replace(
      /\{@scaledamage \d+d\d+\|\d-\d\|(\d+d\d+)}/g,
      "<strong>$1</strong>",
    )
    .replace(/\{@scaledice \d+d\d+\|\d-\d\|(\d+d\d+)}/g, "<strong>$1</strong>")
    .replace(/\{@dice ([^}]+)}/g, "<strong>$1</strong>")
    .replace(/\{@dc ([^}]+)}/g, "<strong>DC $1</strong>")
    .replace(/\{@chance (\d+)(\|[^}]*)?}/g, "<strong>$1%</strong>")
    .replace(
      /\{@variantrule (\w+) \[Area of Effect]\|\w+\|\w+}/g,
      "<strong>$1</strong>",
    )
    .replace(
      /\{@variantrule [^|}]+\|\w+\|([^|}]+)}/g,
      "<em><strong>$1</strong></em>",
    )
    .replace(
      /\{@variantrule ([^|}]+)(\|[^}]*)?}/g,
      "<em><strong>$1</strong></em>",
    )
    .replace(
      /\{@action [^|}]+\|[^|}]*\|([^|}]+)}/g,
      "<em><strong>$1</strong></em>",
    )
    .replace(
      /\{@(condition|status|skill|spell|sense|creature|action|hazard) ([^|}]+)(\|[^}]*)?}/g,
      "<em><strong>$2</strong></em>",
    )
    .replace(/\{@(book|quickref) ([^|}]+)(\|[^}]*)?}/g, "<em>$2</em>")
    .replace(/\{@filter ([^|}]+)(\|[^}]*)?}/g, "<em><strong>$1</strong></em>")
    .replace(/(\w+ saving throw)/g, "<em><strong>$1</strong></em>");
};
