

export default interface Admin {
    uid: string;
    username: string;
    email: string;
    phone?: string;
    password: string;
    access_token?: string;
    session?: string;
    provider?: string;
    profile?: string;
    status: string;
    created?: Date;
    modified: Date;
}