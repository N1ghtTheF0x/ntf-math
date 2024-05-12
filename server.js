const express = require("express")
const path = require("node:path")

const app = express()

app.use(express.static(path.join(process.cwd())))

app.listen(43434)