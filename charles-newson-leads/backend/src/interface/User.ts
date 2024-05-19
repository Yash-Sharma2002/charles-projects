
export default interface User {
    uid: string;
    username: string;
    email: string;
    password: string;
    phone?: string;
    access_token?: string;
    session?: string;
    provider?: string;
    profile?: string;
    status: string;
    created?: Date;
    modified?: Date;
}
