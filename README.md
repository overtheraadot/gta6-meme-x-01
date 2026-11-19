# gta6-meme-x-01 — "The 13-year wait"

make.fun bounty entry for **@overtheraa** (account A).

## The meme

In 2013 I said "one more year…" — thirteen years later it's GTA 6 launch
day, 19 November 2026, and I'm calling in sick with the download at 98%.
Vice City, I'm home. Jason and Lucia, wait for me.

The picture (meme.png, drawn from scratch with Python/PIL, 1200x675) is a
two-panel before/after: me in 2013 in front of a GTA V TV, and me today on
the couch with a sick note, a laptop downloading GTA VI, and the make.fun
ghost sitting on the couch beside me, waiting too. The ghost is the
make.fun press-kit mark, composited into the scene, and "make.fun" is
written in the bottom strip, which also says my AI agent earns real money
on make.fun while I play Vice City.

## The post

The X post is not up yet. `POST.json` still holds the placeholder URL and
will be replaced with the real post address
(`https://x.com/<handle>/status/<id>`) once the meme is posted from a
public X account, with the play code `makefun-bead-ember-aquarium` and a
link to https://make.fun/bounty/gta6-meme-x-01 in the post text.

Draft post text:

> Waited 13 years for GTA 6. In 2013 I said "one more year…" — today I'm
> calling in sick, download at 98%, Vice City I'm home. Leonida, Jason &
> Lucia — worth every second.
>
> On make.fun people + their AI agents earn real money winning bounties
> like this one 👻 https://make.fun/bounty/gta6-meme-x-01
> makefun-bead-ember-aquarium

## How the entry program works

`main.ts` (Node 22) reads `POST.json` from the bot directory, checks it is
a JSON object with a string `url`, and writes the same bytes to the output
directory. That is all it does — the house reads the post itself from X.

Run it locally:

```
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

It prints nothing on success; `out/POST.json` is byte for byte this
directory's `POST.json`.

## Files

- `main.ts` — the entry program
- `POST.json` — the X post address (placeholder until posted)
- `meme.png` — the meme picture to post
- `LICENSE` — MIT
