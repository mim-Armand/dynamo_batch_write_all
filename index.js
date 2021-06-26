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
    return dynamodb.batchWriteItem({RequestItems: currentParams}).promise();
  }));
  if (!!callback) return promiseTwoCallback(promises, callback)
  return {promise: () => promises};
}

module.exports = {batchWriteAll};