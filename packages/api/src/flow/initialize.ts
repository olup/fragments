import { nanoid } from 'nanoid'
import { DbFragment, DbUser } from '../db'

export const initializeUser = async (email: string) => {
  try {
    const user = await DbUser.create({ email, metadata: {} })
    await DbFragment.create([
      {
        uuid: nanoid(),
        handle: 'getting-started',

        content: `# Getting started
Welcome to *Fragment*, a small app dedicated to all and every writers.
## what it is
Fragment is a writer's notebook, a personnal wiki, a distraction-free text editor, a safe place to let it go. Fragment has been design to help people slowly build their ideas from small notes to organizing plans, writing long forms and finally editing.
It was built to avoid long, empty white page - induced writer's block. In fragment you can write two words or two thousands, important or not, well written or just plain ugly.
You can link your notes (and allways find linking notes in the backlinks), you can organize your fragments using tags and subtags. You can even embed one fragment in another in order to compose complex creation while being able to edit parts in isolation. 
#tutorial #home`,

        previewContent:
          "# Getting started\nWelcome to *Fragment*, a small app dedicated to all and every writers.\n## what it is\nFragment is a writer's notebook, a personnal wiki, a distraction-free text editor, a safe place to let it go. Fragment has been design to help people slowly build their ideas from small notes to organizing plans, writing long forms and finally editing.",
        tags: ['tutorial', 'home'],
        linksTo: [],
        linkedBy: ['getting-started-two'],
        userId: email,
      },

      {
        uuid: nanoid(),
        handle: 'getting-started-two',

        content: `## Organizing note
Organize your notes quickly : you can add tags by typing a \`#\` and a name, anywhere in your document : #a-tag. Then, if you want to follow this tag, just ctrl+click on it, and you'll find all your tagged fragments. Also, tags can have a hierarchy. For example, #a-tag-child will be listed in the #a-tag page.
Oh, by the way, #home is a special one, it makes fragments appear on you home page. There is other special tags, like #star, that pins a fragment on top of your feed. But more on the feed later.
Notes can also reference other notes - just like a wiki. For this, use the \`@\` sign followed by your page handle (handles are the words you find on top of your fragment when hovering on it, here "getting-started-two". It defaults to funny combination but you can edit that any time). 
If you hover on a handle link you should get a preview of the page - if it exists. Follow the link with ctrl-click ; you'll find your page if it exists otherwise it will offer you to create one. So to create a fragment from the one you're in, just add a handle-link, click-jump and write away.
#tutorial #home`,

        previewContent:
          "## Organizing note\nOrganize your notes quickly : you can add tags by typing a `#` and a name, anywhere in your document : #a-tag. Then, if you want to follow this tag, just ctrl+click on it, and you'll find all your tagged fragments. Also, tags can have a hierarchy. For example, #a-tag-child will be listed in the #a-tag page.",
        tags: ['home', 'tutorial', 'a-tag', 'a-tag-child'],
        linksTo: ['getting-started'],
        linkedBy: [],
        userId: email,
      },

      // Todo : inline
      // Todo : interface
    ])
    return user
  } catch (err) {
    return null
  }
}
