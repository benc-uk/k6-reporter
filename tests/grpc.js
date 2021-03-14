import grpc from "k6/net/grpc";
import { check, sleep } from "k6";
import { htmlReport } from "./html-report.js";

const client = new grpc.Client();
client.load(["."], "hello.proto");

export function handleSummary(data) {
  return htmlReport(data, { filename: "grpcrep.html" });
}

export default () => {
  client.connect("localhost:50051", {
    plaintext: true,
  });
  const data = { name: "Bert" };
  const response = client.invoke("Hello/SayHello", data);
  check(response, {
    "status is OK": (r) => r && r.status === grpc.StatusOK,
  });
  console.log(JSON.stringify(response.message));
  client.close();
};
