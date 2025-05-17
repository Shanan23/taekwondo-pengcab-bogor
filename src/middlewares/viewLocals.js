// Middleware to set view locals
module.exports = (req, res, next) => {
    // Set the current path for active menu highlighting
    res.locals.path = req.path;
    
    // Set other common view variables
    res.locals.success_msg = req.flash('success');
    res.locals.error_msg = req.flash('error');
    res.locals.user = req.user || null;
    
    next();
}; 