export const getDynamoDbConfig = () => {
  return process.env.LOCAL === "true"
    ? { endpoint: "http://localhost:8000", region: "eu-west-1" }
    : {};
};
