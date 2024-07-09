class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  /** 1. Filtragem: */
  filter() {
    // Construção da query a partir dos parâmetros de consulta (query parameters) recebidos
    const queryObj = { ...this.queryString };

    // Campos que serão excluídos da query, pois não são usados para filtragem de dados
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Converte queryObj em string para aplicar substituição
    let queryStr = JSON.stringify(queryObj);

    // Aplica operadores de comparação do MongoDB convertendo-os para a sintaxe correta
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // Usa o método find para buscar todos os documentos na coleção 'tours' com base nos parâmetros de filtragem
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  /** 2. Ordenação: */
  sort() {
    // Verifica se o parâmetro de ordenação (sort) foi fornecido na query
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  /** 3. Limitação de Campos: */
  limitFields() {
    // Verifica se o parâmetro 'fields' foi fornecido na query string
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  /** 4. Paginação: */
  paginate() {
    // Define a página atual e o limite de itens por página a partir dos parâmetros da query
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    // Aplica o método skip() para pular documentos e limit() para limitar o número de documentos retornados
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
