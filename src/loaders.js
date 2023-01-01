export async function loadHTML(view, root, hasStyle) {
    const path = `/${root}/${view}/${view}.html`;
    const stylePath = `/styles/views/${view}.css`;

    const html = await fetch(path).then(result => result.text());
    const css = hasStyle === false ? "" : `<style>${await fetch(stylePath).then(result => result.text())}</style>`;
    return `${css}${html}`;
}

export async function loadViewModel(view, root, element) {
    const path = `/${root}/${view}/${view}.js`;
    const instance = new (await import(path)).default();
    instance.element = element;
    return instance;
}