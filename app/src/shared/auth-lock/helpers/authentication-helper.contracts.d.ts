interface IAuth0UserProfile extends auth0.Auth0UserProfile {
    user_metadata: IAuthUserMetadata;
}

interface IAuthUserMetadata {
    name: string;
    organization?: string;
}

interface IAuthClaim {
    name: string;
    value: string;
}

interface IIdTokenPayload {
    aud: string;
    email: string;
    email_verified: boolean;
    identities: IIdentity[];
    claims: IAuthClaim[];
}

type IAuthResult = AuthResult & { idTokenPayload: IIdTokenPayload };

interface IIdentity {
    provider: string;
    connection: string;
}



interface IAuth0Connection {
    strategy: string;
    domain: string;
}


// interface IAuth0Static extends Auth0Static {
//     logout(options): void;
// }