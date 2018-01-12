'use strict'
const ActionHero = require('actionhero')

module.exports = class MyAction extends ActionHero.Action {
  constructor () {
    super()
    this.name = 'generateIPList'
    this.description = 'an actionhero action'
    this.outputExample = {}
    this.inputs = {
      filepath: {
        required: true
      }
    }
  }

  async run (data) {
    const text = fs.readFileSync(data.params.filepath, 'utf8');
    const lst = [];
    text.split(/\r?\n/).forEach((line) => {
        if (line.includes('Invalid')) {
            var match = line.match(/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/g);
            if (!lst.includes(match[0])){
                lst.push(match[0]);
            }
        }
    });
    return data.response.IPList
  }
}
