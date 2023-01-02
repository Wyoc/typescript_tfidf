import { CID } from 'multiformats/cid';

export class Exemple {
  private Cid: CID;

  private Name: string;

  constructor(cid: CID, name: string) {
    this.Cid = cid;
    this.Name = name;
  }

  get cid(): CID {
    return this.Cid;
  }

  set cid(value: CID) {
    this.Cid = value;
  }

  get name(): string {
    return this.Name;
  }

  set name(value: string) {
    this.Name = value;
  }
}
