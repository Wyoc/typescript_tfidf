export class Reco {
  private Idf: Map<string, number>

  private Documents: VectorizedDocument[]

  private StopWords: string[]


  constructor(texts: string[], cids: string[]) {
    this.Idf = new Map<string, number>;
    this.Documents = texts.map((text: string, index) => new VectorizedDocument(text, cids[index]));
    this.StopWords = []
  }

  public get idf() {
    return this.Idf;
  }

  public get documents() {
    return this.Documents;
  }

  /**
   * A function gathering all Documents vocabularies and setting the Inverse Documents Frequencies (Idf) property.
   */
  public fit(): void {
    var corpusFrequencies = new Map<string, number>;
    var corpusLength = this.Documents.length;

    this.Documents.map((VectorizedDocument: VectorizedDocument) => VectorizedDocument.getUniqueTerms()
      .filter(word => !this.StopWords.includes(word))
      .map(word => {
        if (corpusFrequencies.has(word)) {
          corpusFrequencies.set(word, corpusFrequencies.get(word) + 1);
        }
        else {
          corpusFrequencies.set(word, 1);
        }
      })
    );
    corpusFrequencies.forEach((count, word) => {
      this.Idf.set(word, corpusLength / count);
    })
  }

  /**
   * A function computing and setting vector representation of documents
   */
  public transform() {
    if (!this.Idf) {
      this.fit();
    }
    let vocabularyLength = this.Idf.keys.length;
    this.Documents.forEach((document: VectorizedDocument) => {
      var tfVector = []
      for (var word of this.Idf.keys()) {
        if (document.termFrequencies.has(word)) {
          var tfidf = Math.log(1 + document.termFrequencies.get(word)) * this.Idf.get(word);
          tfVector.push(tfidf);
        }
        else {
          tfVector.push(0.0);
        }
        document.vector = tfVector;
      }


    });
  }
  /**
   * Perform both fit and transform function
   */
  public fitTransform(){
    this.fit();
    this.transform();
  }

  /**
   * Process a text and return a VectorizedDocument with its tf-idf vector.
   * @param text - A string containing the document's content.
   * @param cid - The Cid of document (default: '').
   * @returns A VectrorizedDocument containing it's vector representation.
   */
  public transformText(text: string, cid: string = ''): VectorizedDocument {
    if (!this.Idf) {
      this.fit();
    }
    var document = new VectorizedDocument(text, cid)
    let vocabularyLength = this.Idf.keys.length;

    var tfVector = []
    for (var word of this.Idf.keys()) {
      if (document.termFrequencies.has(word)) {
        var tfidf = Math.log(1 + document.termFrequencies.get(word)) * this.Idf.get(word);
        tfVector.push(tfidf);
      }
      else {
        tfVector.push(0.0);
      }
      document.vector = tfVector;
    }
    ;
    return document;
  }

  /**
   * A function taking a new version of an existing document, updating its representation in the recommender.
   * @param text - The new text of the document to update
   * @param cid - The CID of the document.
   */
  public updateDocumentVector(text: string, cid: string){
    var updatedDoc = this.transformText(text, cid);
    var docIndex = this.Documents.findIndex(doc => doc.cid ===cid);
    this.Documents[docIndex] = updatedDoc; 
  }

}

export class VectorizedDocument {

  //private Words: string[] | undefined

  public Cid: string

  public TermFrequencies: Map<string, number>

  public Vector: number[]

  get termFrequencies() {
    return this.TermFrequencies;
  }

  public get vector() {
    return this.Vector;
  }

  public set vector(value: number[]) {
    this.Vector = value;
  }

  public get cid(){
    return this.Cid;
  }

  // Expects a single one of the texts originally passed into Corpus
  constructor(text: string, cid: string = '') {
    // this.Words = this.tokenize(text);
    this.Cid = cid;
    this.TermFrequencies = new Map<string, number>;
    var tokenizedDocuments = this.tokenize(text);
    this.calculateTermFrequencies(tokenizedDocuments);
    this.Vector = [];
  }

  /**
   * Tokenize a string.
   * @see Check {@link https://regex101.com/r/koau2e/1 | here} for regex explaination.
   * 
   * @param document - The string containing text to tokinize
   * 
   * @returns An array of strings, where all element are a word. It matches neither elements with numbers, nor punctuation marks.
   */
  private tokenize(document: string = ''): string[] | undefined {
    return document.match(/[a-zA-ZÀ-ÖØ-öø-ÿ]+/g)
      ?.filter((word: string) => {
        if (word.length < 2 || word.match(/^\d/)) {
          return false;
        } else {
          return true;
        }
      })
      .map((word: string) => word.toLowerCase());
  }

  /**
   * Calculate 
   * @param tokenizedDocument 
   * @returns 
   */
  private calculateTermFrequencies(tokenizedDocument: string[] | undefined) {
    if (!tokenizedDocument) return;
    tokenizedDocument.forEach(word => {
      if (this.TermFrequencies.has(word)) {
        this.TermFrequencies.set(word, this.TermFrequencies.get(word) + 1)
      }
      else {
        this.TermFrequencies.set(word, 1);
      }
    })

  }
  getUniqueTerms() {
    return Array.from(this.TermFrequencies.keys());
  }


}

/**
 * Compute the cosine similarity bewteen two vectors
 * @param v1 - An array of number 
 * @param v2 - An array of number
 * @returns The cosine similarity of the two input vector
 * @remarks 
 * Cosine similarity is a measure of "closeness" between two vectors. 
 * Two proportional vectors have a cosine similarity of 1, 
 * two orthogonal vectors have a similarity of 0, 
 * and two opposite vectors have a similarity of -1.
 * @see {@link https://en.wikipedia.org/wiki/Cosine_similarity}.
 */
export function cosineSimilarity(v1: number[], v2: number[]): number {
  let dotProduct = 0.0;
  let ss1 = 0.0;
  let ss2 = 0.0;
  const length = Math.min(v1.length, v2.length);
  for (let i = 0; i < length; i++) {
    // Ignore pairs that will not affect either the dot product or the magnitude
    if (v1[i] === 0 && v2[i] === 0) continue;
    dotProduct += v1[i] * v2[i];
    ss1 += v1[i] * v1[i];
    ss2 += v2[i] * v2[i];
  }
  const magnitude = Math.sqrt(ss1) * Math.sqrt(ss2);
  return magnitude ? dotProduct / magnitude : 0.0;
}