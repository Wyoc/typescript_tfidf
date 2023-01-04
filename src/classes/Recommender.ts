export class Reco {
  private CorpusFrequencies: Map<string, number>

  private Cids: string[]

  private Documents: Document[]

  private StopWords: string[]

  public get corpusFrequencies(){
    return this.CorpusFrequencies
  }

  constructor(texts: string[]) {
    this.CorpusFrequencies = new Map<string, number>;
    //this.TermFrequencies = new Array<Map<string, number>>
    this.Cids = [];

    this.Documents = texts.map((text: string) => new Document(text));

    this.StopWords = []
  }


  /**
   * calculateCorpusFrequency
   */
  public calculateCorpusFrequencies() {
    this.Documents.map((document: Document) => document.getUniqueTerms()
    .filter(word => !this.StopWords.includes(word))
    .forEach(word => {
      if(this.CorpusFrequencies.has(word)){
        this.CorpusFrequencies.set(word, this.CorpusFrequencies.get(word) + 1);
      }
      else{
        this.CorpusFrequencies.set(word, 1);
      }
    }));
  }
}
export class Document {

  //private Words: string[] | undefined

  public TermFrequencies: Map<string, number>

  public Vector: []

  get termFrequencies() {
    return this.TermFrequencies;
  }

  // get words(){
  //   return this.Words;
  // }


  // Expects a single one of the texts originally passed into Corpus
  constructor(text: string) {
    // this.Words = this.tokenize(text);
    this.TermFrequencies = new Map<string, number>;
    const tokenizedDocuments = this.tokenize(text);
    this.calculateTermFrequencies(tokenizedDocuments);
    this.Vector = [];
  }

  public tokenize(document: string = ''): string[] | undefined {
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

  public calculateTermFrequencies(tokenizedDocuments: string[] | undefined) {
    if (!tokenizedDocuments) return;
    tokenizedDocuments.forEach(word => {
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