# dynamo_batch_write_all
a simple drop-in replacement for dynamodb.batchwrite without 25 item limitation
The only change you need to make is to pass a reference to dynamodb as the first parameter and like that you wouldn't need to change anything else!

# Why? ( motivation ):
> This was created because in most of the cases the developer uses `batchWrite` without knowing the limitation or not expecting to pass the 25 item limitation, but ( and when ) they need to solve it they'd need to make additional changes and pottentially introducing new bugs to their work.. this module is attempting to be as close to a drop-in replacement as possible with only one change in the code ( which would be to pass an instance to dynamodb ).
> This is the initial and first release so use it cautiously, I hope you enjoy it and let me know if you see any issues and also feel free to contribute to the project 

# Usage:
- Promisified: `batchWriteAll(dynamodb, params).promise();`
- With Callback: `batchWriteAll(dynamodb, params, callbackFunction)`

# example: 
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
    [TableName]: items
  }
};


batchWriteAll(dynamodb, params).promise()// <-- this is with using promise()
    .then( res => console.log('results  are', res))
    .catch( err => console.log('Error  are', err))


```


# Running the test:
> This project comes with a E2E test that's used during development, which you can also use to try out the package and test its functionality, to run the test as is you need to have your local AWS credentials set up, by default it uses the `default` profile but you can easily change the value of the constant if you have multiple AWS accounts set-up.  