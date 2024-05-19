import Collections from "../../config/collections";


/**
 * Interface for Sequence
 * @readonly
 */
interface SequenceInterface {
    sequence_Id: string;
    organisation_id: string;
    name: string;
    SequenceFor: Collections;
    description?: string;
    current: number;
    increment: number;
    maxDigits: number;
    prefix?: string;
    suffix?: string;
    created_at: number;
    updated_at: number;
}

export default SequenceInterface;