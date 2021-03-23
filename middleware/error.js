function error404(req, res, next) {
    res.status(404).render('404', {
        title: 'Page Not Found'
    });
}

export {
    error404
}