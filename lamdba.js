const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };

  const getUserAsync = (email) => dynamo
    .get({
      TableName: "Marv1",
      Key: {
        email
      }
    })
    .promise();

  const addUserAsync = (email) => dynamo
    .put({
      TableName: "Marv1",
      Item: {
        email
      }
    })
    .promise();

  try {
    switch (event.routeKey) {
      case "GET /items/{id}":
        body = await getUserAsync(event.pathParameters)
        break;
      case "GET /items":
        body = await dynamo.scan({ TableName: "Marv1" }).promise();
        break;
      case "PUT /items":
        let requestJSON = JSON.parse(event.body);
        await addUserAsync(requestJSON)
        body = `Put item ${requestJSON.email}`;
        break;
      default:
        //body = await dynamo.scan({ TableName: "Marv1" }).promise();
        //throw new Error(JSON.stringify(body))
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers
  };
};
