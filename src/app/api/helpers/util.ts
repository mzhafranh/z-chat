import jwt from 'jsonwebtoken';

export const createAccessToken = (username: string) => {
    return jwt.sign(
        { username },
        process.env.JWT_SECRET,
        { expiresIn: '15m' } // Access tokens expire quickly
    );
};

export const createRefreshToken = (username: string) => {
    return jwt.sign(
        { username },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' } // Refresh tokens have a longer lifespan
    );
};
