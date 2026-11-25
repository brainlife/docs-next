# git submodules

Submodules let several GitHub repositories share code. If you maintain several similar Apps, they are a good way to keep the common code in one place.

## Add a submodule

Run a command like this at the root of your repository:

```
git submodule add https://github.com/vistalab/vistasoft vistasoft
```

!!! warning
    Do not use an SSH URL for a submodule (like `git@github.com:something/something.git`). brainlife.io cannot clone your App if a submodule uses a `git@` URL. Check and fix the URLs in the `.gitmodules` file.
