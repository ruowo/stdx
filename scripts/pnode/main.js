var Module = require('module')
let entrypoint = process.argv[2]
if (entrypoint) {
  Module._load(entrypoint, null, true)
  process._tickCallback() 
}
