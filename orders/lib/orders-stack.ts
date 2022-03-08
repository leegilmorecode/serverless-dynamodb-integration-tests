import * as apigw from "@aws-cdk/aws-apigateway";
import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";
import * as nodeLambda from "@aws-cdk/aws-lambda-nodejs";

import path from "path";

export class OrdersStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dynamoDBTableName = "Orders";

    // create the get orders handler
    const getOrderHandler: nodeLambda.NodejsFunction =
      new nodeLambda.NodejsFunction(this, "get-order", {
        functionName: "get-order",
        runtime: lambda.Runtime.NODEJS_14_X,
        entry: path.join(__dirname, "../src/get-order/get-order.handler.ts"),
        memorySize: 512,
        handler: "getOrderHandler",
        bundling: {
          minify: true,
          externalModules: ["aws-sdk"],
        },
      });

    // create the orders dynamodb table
    const orderTable = new dynamodb.Table(this, dynamoDBTableName, {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      pointInTimeRecovery: false,
      tableName: dynamoDBTableName,
      contributorInsightsEnabled: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: {
        name: "orderId",
        type: dynamodb.AttributeType.STRING,
      },
    });

    // give read access to the order handler
    orderTable.grantReadData(getOrderHandler);

    // create the rest API for accessing our lambdas
    const api: apigw.RestApi = new apigw.RestApi(this, "orders-api", {
      description: "orders api gateway",
      deploy: true,
      deployOptions: {
        cachingEnabled: false,
        stageName: "prod",
        dataTraceEnabled: true,
        loggingLevel: apigw.MethodLoggingLevel.INFO,
        tracingEnabled: true,
        metricsEnabled: true,
      },
    });

    // add an /orders resource
    const orders: apigw.Resource = api.root.addResource("orders");

    // integrate the lambda to the method - GET /orders/{id}
    const order: apigw.Resource = orders.addResource("{id}");
    order.addMethod(
      "GET",
      new apigw.LambdaIntegration(getOrderHandler, {
        proxy: true,
        allowTestInvoke: true,
      }),
      {
        requestParameters: {
          "method.request.path.id": true,
        },
      }
    );
  }
}
