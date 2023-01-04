import { TreebankWordTokenizer, WordTokenizer, TfIdf } from "natural";
import type { Tokenizer } from "natural";

export type serializer = (item: any) => string[];


export class Reco {
  private tfidf_: TfIdf;
  private cids_ : [];
  private tokenizer_: Tokenizer;

  constructor() {
    this.cids_ = [];
    this.tfidf_ = new TfIdf();
    this.tokenizer_ = new TreebankWordTokenizer();
  }

  /**
   * Tokenize the individual serialized parts of the document.
   */
  tokenize(parts: string[]): string[][] {
    return parts.map((part) => this.tokenizer_.tokenize(part));
  }

  fit(pages: any, cids: []): void{
    this.cids_ = cids;
    for (var page of pages){
        this.tfidf_.addDocument(page);
    }
  }



}