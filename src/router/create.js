function createRoute(route) {
    return resolve => require(['@/views/' + route], resolve)
}

export default createRoute;
