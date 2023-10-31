import { exec } from "child_process";

let init = "cd ~/go/src/github.com/raika/fabric-samples/test-network";
init += " && export PATH=${PWD}/../bin:$PATH";
init += " && export FABRIC_CFG_PATH=$PWD/../config/";
init += " && export CORE_PEER_TLS_ENABLED=true";
init += ' && export CORE_PEER_LOCALMSPID="Org1MSP"';
init +=
  " && export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt";
init +=
  " && export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp";
init += " && export CORE_PEER_ADDRESS=localhost:7051 && ";

let query = "peer chaincode query -C mychannel -n basic -c ";
let invoke =
  'peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c ';

function execShellCommand(cmd: string) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

export default {
  CreateAccount: async (id: string) => {
    let cmd =
      init + invoke + `\'{"function":"CreateAcounnt","Args":["${id}"]}\'`;
    const res = await execShellCommand(cmd);
    console.log(res);
  },
  CreateClaim: async (
    id: string,
    weather: string,
    weatherEventID: string,
    clientID: string,
    date: string
  ) => {
    let cmd =
      init +
      invoke +
      `\'{"function":"CreateClaim","Args":["${id}","${weather}","${weatherEventID}","${clientID}","${date}"]}\'`;
    const res = await execShellCommand(cmd);
    console.log(res);
  },
  CreateEvent: async (
    id: string,
    weather: string,
    city: string,
    date: string,
    raised: number
  ) => {
    let cmd =
      init +
      invoke +
      `\'{"function":"CreateEvent","Args":["${id}","${weather}","${city}","${date}","${raised}"]}\'`;
    const res = await execShellCommand(cmd);
    console.log(res);
  },
  GetAllAccounts: async () => {
    let cmd = init + query + '\'{"Args":["GetAllAccounts"]}\'';
    const res: any = await execShellCommand(cmd);
    return JSON.parse(res);
  },
  GetAllEvents: async (active = "false") => {
    let cmd = init + query + `\'{"Args":["GetAllEvents", "${active}"]}\'`;
    const res: any = await execShellCommand(cmd);
    return JSON.parse(res);
  },
  GetTransactions: async (id = "") => {
    let cmd = init + query + `\'{"Args":["GetTransactions", "${id}"]}\'`;
    const res: any = await execShellCommand(cmd);
    return JSON.parse(res);
  },
  ReadAsset: async (id: string) => {
    let cmd = init + query + `\'{"Args":["ReadAsset", "${id}"]}\'`;
    const res: any = await execShellCommand(cmd);
    return JSON.parse(res);
  },
  ConfirmDamage: async (id: string) => {
    let cmd =
      init + invoke + `\'{"function":"ConfirmDamage","Args":["${id}"]}\'`;
    const res = await execShellCommand(cmd);
    console.log(res);
  },
  EndEvents: async () => {
    let cmd = init + invoke + `\'{"function":"EndEvents","Args":[]}\'`;
    const res = await execShellCommand(cmd);
    console.log(res);
  },
  TransferAsset: async (id: string, amount: number, date: string) => {
    let cmd =
      init +
      invoke +
      `\'{"function":"TransferAsset","Args":["${id}","${amount}", "${date}"]}\'`;
    const res = await execShellCommand(cmd);
    console.log(res);
  },
};
