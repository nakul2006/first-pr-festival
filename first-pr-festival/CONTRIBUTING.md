# Contributing

See the "Join the Society" section of the [README](./README.md) for the full
walkthrough. The short version:

1. Fork → branch (`git checkout -b add-<username>`)
2. Add **one** file: `spider-society/<your-github-username>.json`
3. `npm run validate` (optional but nice)
4. Push and open a PR against `main`

## Maintainer checklist

- [ ] Exactly one new file, named `<githubUsername>.json`
- [ ] `_template.json` and other contributors' files untouched
- [ ] CI (`Validate Spider-IDs`) is green
- [ ] `alias`, `name`, and `skills` are event-appropriate
