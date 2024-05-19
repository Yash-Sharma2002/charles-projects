import Collections from "../../config/collections";
import CommonMessage from "../../config/response/CommonMessage";
import ResStatus from "../../config/response/ResStatus";
import SequenceFields from "../../config/response/Sequence";
import SequenceInterface from "../Interface/Sequence";
import ResponseClass from "./Response";
import Start from "./Start";

class Sequence extends Start implements SequenceInterface {
  sequence_Id: string;
  organisation_id: string;
  name: string = "";
  SequenceFor: Collections = Collections.Sequence;
  description?: string;
  current: number;
  increment: number = 0;
  maxDigits: number = 4;
  prefix?: string = "";
  suffix?: string = "";
  created_at: number;
  updated_at: number;

  /**
   * Constructor
   * @param sequence - Sequence Interface
   */
  constructor(sequence?: SequenceInterface) {
    super();
    this.sequence_Id = sequence?.sequence_Id || this.generateId();
    this.organisation_id = sequence?.organisation_id || "";
    this.name = sequence?.name || this.name;
    this.SequenceFor = sequence?.SequenceFor || this.SequenceFor;
    this.description = sequence?.description || "";
    this.current = sequence?.current || 0;
    this.increment = sequence?.increment || 1;
    this.maxDigits = sequence?.maxDigits || 4;
    this.prefix = sequence?.prefix || this.prefix;
    this.suffix = sequence?.suffix || this.suffix;
    this.created_at = sequence?.created_at || new Date().getTime();
    this.updated_at = sequence?.updated_at || new Date().getTime();
  }

  // Getters
  /**
   * Get Sequence Id
   * @returns string
   */
  getSequenceId(): string {
    return this.sequence_Id;
  }

  /**
   * Get Organisation Id
   */
  getOrganisationId(): string {
    return this.organisation_id;
  }

  /**
   * Get Sequence Name
   * @returns string
   */
  getName(): string {
    return this.name;
  }

  /**
   * Get Sequence For
   * @returns string
   */
  getSequenceFor(): string {
    return this.SequenceFor;
  }

  /**
   * Get Sequence Description
   * @returns string
   */
  getDescription(): string | undefined {
    return this.description;
  }

  /**
   * Get Sequence Current
   * @returns number
   */
  getCurrent(): number {
    return this.current;
  }

  /**
   * Get Sequence Increment
   * @returns number
   */
  getIncrement(): number {
    return this.increment;
  }

  /**
   * Get Sequence Prefix
   * @returns string
   */
  getPrefix(): string | undefined {
    return this.prefix;
  }

  /**
   * Get Sequence Suffix
   * @returns string
   */
  getSuffix(): string | undefined {
    return this.suffix;
  }

  /**
   * Get Sequence Max Digits
   */
  getMaxDigits(): number {
    return this.maxDigits;
  }

  /**
   * Get Sequence Created Date
   * @returns Date
   */
  getCreatedAt(): number | undefined {
    return this.created_at;
  }

  /**
   * Get Sequence Updated Date
   * @returns Date
   */
  getUpdatedAt(): number | undefined {
    return this.updated_at;
  }

  // Setters
  /**
   * Set Sequence Id
   * @param sequence_Id
   */
  setSequenceId(sequence_Id: string) {
    this.sequence_Id = sequence_Id;
  }

  /**
   * Set Organisation Id
   * @param organisation_id
   */
  setOrganisationId(organisation_id: string) {
    this.organisation_id = organisation_id;
  }

  /**
   * Set Sequence Name
   * @param name
   */
  setName(name: string) {
    this.name = name;
  }

  /**
   * Set Sequence For
   * @param SequenceFor
   */
  setSequenceFor(SequenceFor: Collections) {
    this.SequenceFor = SequenceFor;
  }

  /**
   * Set Sequence Description
   * @param description
   */
  setDescription(description: string) {
    this.description = description;
  }

  /**
   * Set Sequence Current
   * @param current
   */
  setCurrent(current: number) {
    this.current = current;
  }

  /**
   * Set Sequence Increment
   * @param increment
   */
  setIncrement(increment: number) {
    this.increment = increment;
  }

  /**
   * Set Sequence Prefix
   * @param prefix
   */
  setPrefix(prefix: string) {
    this.prefix = prefix;
  }

  /**
   * Set Sequence Suffix
   * @param suffix
   */
  setSuffix(suffix: string) {
    this.suffix = suffix;
  }

  /**
   * Set Sequence Max Digits
   * @param maxDigits
   */
  setMaxDigits(maxDigits: number) {
    this.maxDigits = maxDigits;
  }

  /**
   * Set Sequence Created Date
   * @param created_at
   */
  setCreatedAt() {
    this.created_at = new Date().getTime();
  }

  /**
   * Set Sequence Updated Date
   * @param updated_at
   */
  setUpdatedAt() {
    this.updated_at = new Date().getTime();
  }

  /**
   * Get Sequence
   * @returns SequenceInterface
   */
  getSequence(): SequenceInterface {
    return {
      sequence_Id: this.sequence_Id,
      organisation_id: this.organisation_id,
      name: this.name,
      SequenceFor: this.SequenceFor,
      description: this.description,
      current: this.current,
      increment: this.increment,
      prefix: this.prefix,
      suffix: this.suffix,
      maxDigits: this.maxDigits,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  /**
   * Set Sequence
   * @param sequence - Sequence Interface
   */
  setSequence(sequence: SequenceInterface) {
    this.sequence_Id = sequence.sequence_Id;
    this.organisation_id = sequence.organisation_id;
    this.name = sequence.name;
    this.SequenceFor = sequence.SequenceFor;
    this.description = sequence.description;
    this.current = sequence.current;
    this.increment = sequence.increment;
    this.prefix = sequence.prefix;
    this.suffix = sequence.suffix;
    this.maxDigits = sequence.maxDigits;
    this.created_at = sequence.created_at;
    this.updated_at = sequence.updated_at;
  }

  /**
   * Validate Sequence
   */
  validate() {
    this.validateSequenceName(this.name);
    this.validateSequenceFor(this.SequenceFor);
    this.validateIncrement(this.increment);
    this.validateMaxDigits(this.maxDigits);
    this.validateCurrent(this.current);
    this.validateSequenceDescription(this.description ? this.description : "");
  }

  /**
   *  Get Sequence
   * @param sequence_Id
   * @param name
   * @param SequenceFor
   * @param organisation_id
   * @returns
   */
  async getSequenceDetails(
    sequence_Id: string = this.sequence_Id,
    name: string = this.name,
    SequenceFor: string = this.SequenceFor,
    organisation_id: string = this.organisation_id
  ): Promise<SequenceInterface> {
    return (await this.getOne(Collections.Sequence, {
      $or: [{ sequence_Id }, { name }, { SequenceFor }],
      organisation_id,
    })) as unknown as SequenceInterface;
  }

  /**
   * Get All Sequences
   * @param organisation_id
   * @returns
   */
  async getAllSequences(organisation_id:string = this.organisation_id): Promise<SequenceInterface[]> {
    return (await this.getAll(
      Collections.Sequence,
      {organisation_id}
    )) as unknown as SequenceInterface[];
  }

  /**
   * Check Sequence Exists
   * @param sequence_Id
   * @param name
   * @param SequenceFor
   * @param organisation_id
   */
  async checkSequenceExists(
    sequence_Id: string = this.sequence_Id,
    name: string = this.name,
    SequenceFor: string = this.SequenceFor,
    organisation_id: string = this.organisation_id
  ) {
    let sequence = await this.getSequenceDetails(
      sequence_Id,
      name,
      SequenceFor,
      organisation_id
    );
    if (sequence) {
      throw new ResponseClass(
        ResStatus.Conflict,
        SequenceFields.SequenceAlreadyExists
      );
    }
  }

  /**
   * Check Sequence Not Exists
   * @param sequence_Id
   * @param name
   * @param SequenceFor
   * @param organisation_id
   */
  async checkSequenceNotExists(
    sequence_Id: string = this.sequence_Id,
    name: string = this.name,
    SequenceFor: string = this.SequenceFor,
    organisation_id: string = this.organisation_id
  ) {
    let sequence = await this.getSequenceDetails(
      sequence_Id,
      name,
      SequenceFor,
      organisation_id
    );
    if (!sequence) {
      throw new ResponseClass(
        ResStatus.NotFound,
        SequenceFields.SequenceNotFound
      );
    }
  }

  /**
   * Create Sequence
   */
  async createSequence() {
    await this.insertOne(Collections.Sequence, this.getSequence());
  }

  /**
   * Update Sequence
   */
  async updateSequence() {
    await this.updateOne(
      Collections.Sequence,
      { sequence_Id: this.sequence_Id, organisation_id: this.organisation_id},
      { $set: this.getSequence() }
    );
  }

  /**
   * Delete Sequence
   * @param sequence_Id
   * @param organisation_id
   */
  async deleteSequence(sequence_Id: string = this.sequence_Id, organisation_id: string = this.organisation_id) {
    await this.deleteOne(Collections.Sequence, {
      sequence_Id: sequence_Id,
      organisation_id: organisation_id,
    });
  }

  /**
   * Get Next Sequence
   * @param SequenceFor
   * @param organisation_id
   * @returns
   */
  async getNextSequence(SequenceFor: string = this.SequenceFor, organisation_id: string = this.organisation_id) {
    const sequence = await this.getSequenceDetails("", "", SequenceFor, organisation_id);
    const current = sequence.current + sequence.increment;
    sequence.current = current;
    this.setSequence(sequence);
    await this.updateSequence();
    let prefix = sequence.prefix ? sequence.prefix + "-" : "";
    let suffix = sequence.suffix ? "-" + sequence.suffix : "";
    let midNum = current.toString().padStart(sequence.maxDigits, "0");
    return prefix + midNum + suffix;
  }

  /**
   * Flush
   */
  async flush() {
    super.flush();
    this.sequence_Id = "";
    this.organisation_id = "";
    this.name = "";
    this.SequenceFor = Collections.Sequence;
    this.description = "";
    this.current = 0;
    this.increment = 0;
    this.maxDigits = 4;
    this.prefix = "";
    this.suffix = "";
    this.created_at = 0;
    this.updated_at = 0;
  }
}

export default Sequence;
