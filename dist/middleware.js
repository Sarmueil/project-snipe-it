"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import session from 'express-session'
exports.requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    else {
        return res.redirect('/login');
    }
};
//# sourceMappingURL=middleware.js.map