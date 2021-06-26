# dynamo_batch_write_all
a simple drop-in replacement for dynamodb.batchwrite without 25 item limitation



```js
const { batchWriteAll } = require ("batch-write-all");
const AWS = require("aws-sdk");

AWS.config.update({region: "us-east-1"});
const credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;
const dynamodb = new AWS.DynamoDB();

const TableName = 'test_db';


let items = arr.map( (a, id) => ({
  PutRequest: {
    Item: {
      "title": {
        S: `test ${id}`
      },
      "year": {
        N: `${id}`
      }
    }
  }
}));

var params = {
  RequestItems: {
    [TableName]: items,
    [TableName2]: [...items2, ...deleteItems]
  }
};

```