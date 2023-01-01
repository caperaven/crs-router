export async function findRoute(data, hash) {
    return data.routes.find(item => item.hash === hash);
}