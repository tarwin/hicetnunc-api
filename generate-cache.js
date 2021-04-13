const conseilUtil = require('./conseilUtil')
const axios = require('axios')
const fs = require('fs')

const generateAll = async function() {
  const universe = await conseilUtil.getArtisticUniverse(0, 100000)
  for (const o of universe) {
    if (!fs.existsSync(`./cache/objkts/objkt_${o.objectId}.json`)) {
      o.token_id = o.objectId
      const res = await axios.get('https://cloudflare-ipfs.com/ipfs/' + o.ipfsHash)
      o.token_info = res.data
      fs.writeFileSync(`./cache/objkts/objkt_${o.token_id}.json`, JSON.stringify(o));
      console.log('DONE', o.token_id)
    } else {
      console.log('SKIP', o.objectId)
    }
  }
}

const writeMissing = async function(start, end) {
  for (let i=start; i<=end; i++) {
    if (!fs.existsSync(`./cache/objkts/objkt_${i}.json`)) {
      // console.log('Missing: ', i)
      const res = await axios.post(`https://51rknuvw76.execute-api.us-east-1.amazonaws.com/dev/objkt`, {
        objkt_id: i
      })
      fs.writeFileSync(`./cache/objkts/objkt_${i}.json`, JSON.stringify(res.data))
      console.log(i)
    }
  }
}

const getObj = async function(id) {
  const res = await axios.post(`https://51rknuvw76.execute-api.us-east-1.amazonaws.com/dev/objkt`, {
    objkt_id: id
  })
  console.log(res.data)
}

const combine = async function(start, end, num) {
  let all = []
  for (let i=start; i<=end; i++) {
    try {
      const data = fs.readFileSync(`./cache/objkts/objkt_${i}.json`)
      const json = JSON.parse(data)
      all.push(json.result || json)
    } catch(e){}
    if (i % num === 0) {
      console.log(`${i-(num-1)}-${i}`)
      fs.writeFileSync(`./cache/${num}s/${i-(num-1)}-${i}.json`, JSON.stringify(all))
      all = []
    }
  }
}

const makeLatest = async function(end) {
  const start = end - 50
  let all = []
  for (let i=start; i<=end; i++) {
    try {
      const data = fs.readFileSync(`./cache/objkts/objkt_${i}.json`)
      const json = JSON.parse(data)
      all.push(json.result || json)
    } catch(e){}
  }
  fs.writeFileSync(`./cache/latest.json`, JSON.stringify(all))
}

// generateAll()
// writeMissing(23582, 31351)
// getObj(17123)
combine(1, 31351, 20)
// makeLatest(31351)