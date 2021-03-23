export const SHORTCUTS = {
  "^\\* ": "list-item",
  "^- ": "list-item",
  "^\\+ ": "list-item",

  "^> ": "block-quote",

  "^# ": "heading-one",
  "^## ": "heading-two",
  "^### ": "heading-three",

  "^\\/\\/ ": "comment",
} as { [index: string]: string };

export const LEAF_REGEX = {
  "^> (.*$)": "quote",
  "\\*(.*)\\*": "italic",
  "\\*\\*(.*)\\*\\*": "bold",

  "\\B(@[a-zA-Z-]+\\b)(?!;)": "handle",
  "\\[\\[(.*?)\\]\\]": "handle",
  "\\B(@[a-zA-Z-]+:inline\\b)(?!;)": "inlineHandle",
  "\\B(#[a-zA-Z-]+\\b)(?!;)": "hashtag",
  "(https?|ftp|ssh|mailto)://[a-z0-9/:%_+.,#?!@&=-]+": "url",
  "(?!```)`(.+)`": "code",
} as { [index: string]: string };
