import { auth } from "express-oauth2-jwt-bearer";

const jwtCheck = auth({
    audience:'https://prisma-ks.netlify.app/',
    issuerBaseURL:'https://dev-01jqlp4png236jat.us.auth0.com',
    tokenSigningAlg:'RS256'
})

export default jwtCheck;

