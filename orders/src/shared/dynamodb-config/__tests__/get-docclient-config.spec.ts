import { getDynamoDbConfig } from "../get-docclient-config";

describe("get-docclient-config", () => {
  it("should return the correct values when not local", () => {
    process.env.LOCAL = "false";

    expect(getDynamoDbConfig()).toEqual({});
  });

  it("should return the correct values when local", () => {
    process.env.LOCAL = "true";

    expect(getDynamoDbConfig()).toMatchInlineSnapshot(`
      Object {
        "endpoint": "http://localhost:8000",
        "region": "eu-west-1",
      }
    `);
  });
});
