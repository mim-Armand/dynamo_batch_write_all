const promiseTwoCallback = (promise, callback) => {
  promise
    .then(res => callback(res, null))
    .catch(err => callback(null, err));
}

const batchWriteAll = (dynamodb, params, callback) => {
  const batchSize = 15;
  let rawItems = []
  Object.entries(params.RequestItems).forEach(([t, tv]) => {
    tv.forEach(o => {
      const operation = Object.keys(o)[0];
      const itemKey = operation === 'DeleteRequest' ? 'Key' : 'Item'
      rawItems.push({
        TableName: t,
        operation,
        [itemKey]: o[operation][itemKey]
      })
    })
  })

  const batchesArray = rawItems.reduce((acc, curr, i) => {
    if (!(i % batchSize)) {
      acc.push(rawItems.slice(i, i + batchSize));
    }
    return acc;
  }, []);

  const promises = Promise.all(batchesArray.map(b => {
    let currentParams = {};
    b.forEach(i => {
      const itemKey = i.operation === 'DeleteRequest' ? 'Key' : 'Item'
      if (!currentParams[i.TableName]) currentParams[i.TableName] = [];
      currentParams[i.TableName].push({[i.operation]: {[itemKey]: i[itemKey]}});
    });
    if( typeof dynamodb.batchWriteItem !== 'undefined') {
      return dynamodb.batchWriteItem({RequestItems: currentParams}).promise();
    }else if( typeof dynamodb.batchWrite !== 'undefined') {
      return dynamodb.batchWrite({RequestItems: currentParams}).promise();
    }else{
      throw new Error('The first argument passed to `batchWriteAll` should be an instance of dynamoDb or dynamoDB document client.');
    }
  }));
  if (!!callback) return promiseTwoCallback(promises, callback)
  return {promise: () => promises};
}

module.exports = {batchWriteAll};