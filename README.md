# `3d-noughts-and-crosses`
This is the source code for the "3D Noughts and Crosses" website, which you can try out [here](https://projects.ollybritton.com/3d-noughts-and-crosses).

The source code is quite messy. If I were to do this again, I'd use React and not have as many global variables so that the code actually makes sense, rather than being a tangled web of functions all mutating the same variable. I wouldn't be surprised if [it contains an ad hoc, informally-specified, bug-ridden, slow implementation of half of Common Lisp](https://en.wikipedia.org/wiki/Greenspun%27s_tenth_rule).

## Info
* HTML is in [`index.html`](index.html).
* JS is in [`js/scripts.js`](js/scripts.js).
* CSS is in [`css/styles.css`](css/styles.css).
* The [Tachyons](https://tachyons.io/) CSS toolkit is used, and the layout of the website is inspired by [this online Brainf**k interpreter](https://minond.xyz/brainfuck/).
* An old version of this project is located in the [`old/`](old/) directory.
* A never-finished 3D rendering of a grid is located in the [`3d/`](3d/) directory.