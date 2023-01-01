export async function getHTML(view, root) {
    const path = `/${root}/${view}/${view}.html`;
    return await fetch(path).then(result => result.text());
}