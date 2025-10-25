export const highlightSpecialParts = (text: string) => {
  return text
    .replace(/\{@damage (\d*d\d+)}/g, "<strong>$1</strong>")
    .replace(
      /\{@scaledamage \d+d\d+\|\d-\d\|(\d+d\d+)}/g,
      "<strong>$1</strong>",
    )
    .replace(/\{@dice ([^}]+)}/g, "<strong>$1</strong>")
    .replace(/\{@dc ([^}]+)}/g, "<strong>DC $1</strong>")
    .replace(
      /\{@variantrule (\w+) \[Area of Effect]\|\w+\|\w+}/g,
      "<strong>$1</strong>",
    )
    .replace(/\{@variantrule ([^|]+)\|\w+}/g, "<em><strong>$1</strong></em>")
    .replace(
      /\{@variantrule [^|]+\|\w+\|([^|]+)}/g,
      "<em><strong>$1</strong></em>",
    )
    .replace(/\{@condition ([^|]+)\|\w+}/g, "<em><strong>$1</strong></em>")
    .replace(/\{@status ([^|]+)\|\w+}/g, "<em><strong>$1</strong></em>")
    .replace(/\{@skill ([^|]+)\|\w+}/g, "<em><strong>$1</strong></em>")
    .replace(/\{@spell ([^|]+)\|\w+}/g, "<em><strong>$1</strong></em>")
    .replace(/\{@sense ([^|]+)\|\w+}/g, "<em><strong>$1</strong></em>")
    .replace(/\{@creature ([^|]+)\|\w+}/g, "<em><strong>$1</strong></em>")
    .replace(/\{@action ([^|]+)\|\w+}/g, "<em><strong>$1</strong></em>")
    .replace(/\{@action [^|]+\|\w+\|([^|]+)}/g, "<em><strong>$1</strong></em>")
    .replace(/(\w+ saving throw)/g, "<em><strong>$1</strong></em>");
};
