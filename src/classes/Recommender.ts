export class Reco {
  private Idf: Map<string, number>

  private Cids: string[]

  private Documents: VectorizedDocument[]

  private StopWords: string[]


  constructor(texts: string[], cids: string[]) {
    this.Idf = new Map<string, number>;
    this.Cids = [];
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
   * calculateCorpusFrequency
   */
  public fit() {
    var corpusFrequencies = new Map<string, number>;
    var corpusLength = this.Documents.length;
    console.log(corpusLength);

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
    console.log("hey"),
      console.log(corpusFrequencies);
    console.log('no more hey');
    corpusFrequencies.forEach((count, word) => {
      this.Idf.set(word, corpusLength / count);
    })
  }

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


    });;

  }

  public transformText(text: string): VectorizedDocument {
    if (!this.Idf) {
      this.fit();
    }
    var document = new VectorizedDocument(text, '')
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
  public updateDocumentVector(cid: string){
    
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


  // Expects a single one of the texts originally passed into Corpus
  constructor(text: string, cid: string = '') {
    // this.Words = this.tokenize(text);
    this.Cid = cid;
    this.TermFrequencies = new Map<string, number>;
    const tokenizedVectorizedDocuments = this.tokenize(text);
    this.calculateTermFrequencies(tokenizedVectorizedDocuments);
    this.Vector = [];
  }

  public tokenize(VectorizedDocument: string = ''): string[] | undefined {
    return VectorizedDocument.match(/[a-zA-ZÀ-ÖØ-öø-ÿ]+/g)
      ?.filter((word: string) => {
        if (word.length < 2 || word.match(/^\d/)) {
          return false;
        } else {
          return true;
        }
      })
      .map((word: string) => word.toLowerCase());
  }

  public calculateTermFrequencies(tokenizedVectorizedDocuments: string[] | undefined) {
    if (!tokenizedVectorizedDocuments) return;
    tokenizedVectorizedDocuments.forEach(word => {
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

export function cosineSimilarity(vector1: number[], vector2: number[]) {
  const v1 = Array.from(vector1.values());
  const v2 = Array.from(vector2.values());
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