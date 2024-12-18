import jwt from 'jsonwebtoken';

export const createAccessToken = (username: string) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment variables");
    }
    return jwt.sign(
        { username },
        process.env.JWT_SECRET,
        { expiresIn: '5m' } // Access tokens expire quickly
    );
};

export const createRefreshToken = (username: string) => {
    if (!process.env.JWT_REFRESH_SECRET) {
        throw new Error("JWT_REFRESH_SECRET is not defined in the environment variables");
    }
    return jwt.sign(
        { username },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' } // Refresh tokens have a longer lifespan
    );
};

export function verifyToken(token: string, secret: string) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, user) => {
            if (err) return reject(err);
            resolve(user);
        });
    });
};
