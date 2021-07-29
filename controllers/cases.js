const casesRouter = require('express').Router()
const axios = require('axios')

casesRouter.get('/test', (_req, res) => {
  res.send('Cases endpoint is running!')
})

//Getting the COVID infection data and parsing it into something more useful
casesRouter.get('/', (_req, res) => {
  axios
    .get(
      'https://sampo.thl.fi/pivot/prod/en/epirapo/covid19case/fact_epirapo_covid19case.json?row=hcdmunicipality2020-445197.445282.445223.444996.445193.445222.&column=dateweek20200101-509096.509115.509159.509087.509065.508494.508853.508675.508844.508834.508921.509080.508857.508850.509252.508767.508673.509267.509062.509092.508704.508529.509173.509324.508924.509281.508745.508737.508657.508782.#'
    )
    .then((res) => res.data.dataset)
    .then((data) => {
      const indexes = data.dimension.hcdmunicipality2020.category.index
      const labels = data.dimension.hcdmunicipality2020.category.label
      const dates = data.dimension.dateweek20200101
      const numOfColumns = data.dimension.size[1]

      const entries = Object.entries(indexes)
      const values = entries.map((i) => {
        const id = i[0]
        const name = labels[id]
        const startingIndex = i[1] * numOfColumns
        const endIndex = startingIndex + numOfColumns
        let array = []
        for (i = startingIndex; i < endIndex; i++) {
          array.push(data.value[i])
        }

        return { name, id, array }
      })
      res.json(values)
    })
})

module.exports = casesRouter
