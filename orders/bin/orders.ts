#!/usr/bin/env node

import "source-map-support/register";

import * as cdk from "@aws-cdk/core";

import { OrdersStack } from "../lib/orders-stack";

const app = new cdk.App();
new OrdersStack(app, "OrdersStack", {});
