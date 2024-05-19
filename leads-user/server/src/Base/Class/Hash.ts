
import dotenv from "dotenv";
import bcrypt from 'bcryptjs'

dotenv.config({ path: "../../../data.env" });

/**
 * Hash class
 */
class Hash{

    public data: string = "";

    /**
     * Constructor
     * @param data 
     */
    constructor(data: string) {
        this.data = data;
    }

    /**
     * Hash data
     */
    hash(): string {
        return bcrypt.hashSync(this.data, 10)
    }

    /**
     * Compare password
     * @param hash 
     */
    compareHash(hash: string): boolean {
        return bcrypt.compareSync(this.data, hash)
    }
}

export default Hash;

