# OPWASP Top10 (v2021)

small presentation using [revealjs](https://revealjs.com/) about the owasp Top10

## on github pages

This is deployed on [Github Pages for easy Viewing](https://dominikschopper.github.io/presentation-owasptop10/)

## Usage for developing or local display

1. check out and cd into
    ```bash
    git checkout https://github.com/dominikschopper/presentation-owasptop10.git
    cd presentation-owasptop10
    ```
1. install dependencies and start local dev server (I used
    [live-server](https://github.com/tapio/live-server). Should reload
    as soon as you change something
    ```bash
    npm install # or pnpm, yarn
    npm start
    ```

## structure

- slides for bigger strucutres that are often UI heavy can be placed into the `./index.html`
- slide groups should get their own folder (like each top10 topic) and slide content can be placed in this folder with a formidable and recognizable name in markdown format e.g. `content/overview/owasp-top10.md`
- each markdown file can be referenced in a section tag like this
    ```html
    <section data-markdown="content/overview/owasp-top10.md" ...
    ```
