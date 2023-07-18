

class ApiFeatures {
  constructor(mongooseQuery, requestQuery) {

    this.mongooseQuery = mongooseQuery 
    this.requestQuery = requestQuery


  }

  pagination(allResults) {
    const page = this.requestQuery.page * 1 || 1 
    const limit = this.requestQuery.limit * 1 || 200
    const skip = (page - 1) * limit
  
    this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip) 

    const paginationObject = {}
    paginationObject.limit = limit * 1 
    if (skip > 0) { 
      paginationObject.previousPage = page - 1 
    }
    paginationObject.currentPage = page
    if ( page * limit < allResults) { 
      paginationObject.nextPage = page + 1
    }
    paginationObject.totalPages = Math.ceil(allResults / limit) || 1
    paginationObject.totalResults = allResults

    this.paginationData = paginationObject

    return this 
  }

  filteration() {
    const splitQuery = {... this.requestQuery}
    const constwords = ["page", "limit", "sort", "fields", "keyword"] 
    constwords.map(item => delete splitQuery[item])
    let splitQueryString = JSON.stringify(splitQuery)
    splitQueryString = splitQueryString.replace(/\bgt|gte|lt|lte\b/g, match => `$${match}`)
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(splitQueryString)) 

    return this
  }

  sorting() {
    if (this.requestQuery.sort ) { 
      const sortQuery = this.requestQuery.sort.split(",").join(" ")
      this.mongooseQuery = this.mongooseQuery.sort(sortQuery)
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt")
    }

    return this
  }

  fieldsLimitation() {
    if (this.requestQuery.fields) {
      const fieldsQuery = this.requestQuery.fields.split(',').join(' ')
      this.mongooseQuery = this.mongooseQuery.select(fieldsQuery)
    }

    return this
  }

  searching(modelName) { 
    if (this.requestQuery.keyword) {
      let keywordQuery = {} 
      if (modelName === "productModel") {
        keywordQuery.$or = [ 
          {title: {$regex: this.requestQuery.keyword, $options: "i"}}, 
          {description: {$regex: this.requestQuery.keyword, $options: "i"}}
        ]
      } else {
        keywordQuery = {name: {$regex: this.requestQuery.keyword, $options: "i"}} 
      }
      
      this.mongooseQuery = this.mongooseQuery.find(keywordQuery)
    }

    return this
  }
}

module.exports = ApiFeatures