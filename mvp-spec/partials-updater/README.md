# Partials Updater

Our documents has shared content. For easing the maintenance, we use partials 
document to include in other one. This is the purpose of this script, we don't 
use tool like Mustache or Handlebar because you cannot read directly in
the documents the contents of its partials.

## Setup

```bash
npm install
```

## How to use it

In the `partials` directory, add a new file containing shared content.

`partials/shared-content.md`
```
My shared content.
```

In a document in the `mvp-spec` directory, add the partial configuration.

In `my-document.md`:
```
<!--partial-begin { "file": "shared-content.md" } -->

<!--partial-end-->

```

Launch the script:

```bash
npm run start
```

The content of `shared-content.md` is inserted directly in the `my-document.md`.
```
<!--partial-begin { "file": "shared-content.md" } -->
My shared content.
<!--partial-end-->

```