module.exports = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
    });
};