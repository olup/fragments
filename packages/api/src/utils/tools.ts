const HANDLE_REGEX = /\B(\@[a-zA-Z\-]+\b)(?!;)/gim
const TAG_REGEX = /\B(\#[a-zA-Z\-]+\b)(?!;)/gim

export const listHandles = (content: string) => {
  const res = content.match(HANDLE_REGEX)
  return res?.map((h) => h.split('@')[1]) || []
}

export const listTags = (content: string) => {
  const res = content.match(TAG_REGEX)
  return res?.map((h) => h.split('#')[1]) || []
}
