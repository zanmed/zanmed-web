
import sanitizeHtmlLib from "sanitize-html";

const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "s", "u", "mark",
  "h1", "h2", "h3", "ul", "ol", "li", "blockquote",
  "a", "img",
];

const ALLOWED_ATTRIBUTES: sanitizeHtmlLib.IOptions["allowedAttributes"] = {
  a: ["href", "target", "rel"],
  img: ["src", "alt"],
};

export function sanitizeHtml(html: string): string {
  return sanitizeHtmlLib(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
  });
}

export function htmlToPlainText(html: string): string {
  return sanitizeHtmlLib(html, { allowedTags: [], allowedAttributes: {} }).trim();
}