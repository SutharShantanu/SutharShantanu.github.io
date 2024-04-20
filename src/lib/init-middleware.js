import Cors from "cors";

const corsMiddleware = Cors({
    methods: ["GET", "POST", "OPTIONS"],
});

function initMiddleware(middleware) {
    return (req, res) =>
        new Promise((resolve, reject) => {
            middleware(req, res, (result) => {
                if (result instanceof Error) {
                    return reject(result);
                }
                return resolve(result);
            });
        });
}

export default initMiddleware(corsMiddleware);
