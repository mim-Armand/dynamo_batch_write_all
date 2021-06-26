const { batchWriteAll } = require("./index");

const AWS = require("aws-sdk");

AWS.config.update({region: "us-east-1"});

const credentials = new AWS.SharedIniFileCredentials({profile: 'fff'});
AWS.config.credentials = credentials;

const dynamodb = new AWS.DynamoDB();

const TableName = 'test_db';
const TableName2 = 'test_db2';

// Please Note: This is an E2E test and will creates actual side-effects!

const createTable = () => {
  var params = {
    TableName ,
    KeySchema: [
      { AttributeName: "year", KeyType: "HASH"},
      { AttributeName: "title", KeyType: "RANGE" }
    ],
    AttributeDefinitions: [
      { AttributeName: "year", AttributeType: "N" },
      { AttributeName: "title", AttributeType: "S" }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  };

  dynamodb.createTable(params, function(err, data) {
    if (err) {
      console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
  });
}


let arr = new Array(26);
arr.fill('')

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
}))

items2 = [11,12,13,14,15].map( d => ({
  PutRequest: {
    Item: {
      "title": {
        S: `test ${d}`
      },
      "year": {
        N: `${d}`
      }
    }
  }
}))

deleteItems = [1,3,5].map( d => ({
  DeleteRequest: {
    Key: {
      "title": {
        S: `test ${d}`
      },
      "year": {
        N: `${d}`
      }
    }
  }
}))

var params = {
  RequestItems: {
    [TableName]: items,
    [TableName2]: [...items2, ...deleteItems]
  }
};

const callback = (res, ...rest) => {
  console.log('>>> >>> >>> ', res, rest)
}

const batchWrite = async () => {
  // batchWriteAll(dynamodb, params, callback); // <-- this is with using callback

  batchWriteAll(dynamodb, params).promise()// <-- this is with using promise()
    .then( res => console.log('results  are', res))
    .catch( err => console.log('Error  are', err))
}

batchWrite();