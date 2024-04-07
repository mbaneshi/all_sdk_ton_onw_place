import TonWeb from "tonweb";
import { DeDustClient } from "@dedust/sdk";
import { TonClient, WalletContractV4, internal } from "@ton/ton";
import { mnemonicNew, mnemonicToPrivateKey } from "@ton/crypto";

// Create Client
const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC",
});

const tonweb = new TonWeb();
// Generate new key
let mnemonics = await mnemonicNew();
let keyPair = await mnemonicToPrivateKey(mnemonics);

// Create wallet contract
let workchain = 0; // Usually you need a workchain 0
let wallet = WalletContractV4.create({
  workchain,
  publicKey: keyPair.publicKey,
});
let contract = client.open(wallet);

// Get balance
let balance: bigint = await contract.getBalance();

// Create a transfer
let seqno: number = await contract.getSeqno();
let transfer = await contract.createTransfer({
  seqno,
  secretKey: keyPair.secretKey,
  messages: [
    internal({
      value: "1.5",
      to: "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N",
      body: "Hello world",
    }),
  ],
});

// Tonweb samples code:
const tonweb = new TonWeb();

const wallet = tonweb.wallet.create({ publicKey });

const address = await wallet.getAddress();

const nonBounceableAddress = address.toString(true, true, false);

const seqno = await wallet.methods.seqno().call();

await wallet.deploy(secretKey).send(); // deploy wallet to blockchain

const fee = await wallet.methods
  .transfer({
    secretKey,
    toAddress: "EQDjVXa_oltdBP64Nc__p397xLCvGm2IcZ1ba7anSW0NAkeP",
    amount: TonWeb.utils.toNano(0.01), // 0.01 TON
    seqno: seqno,
    payload: "Hello",
    sendMode: 3,
  })
  .estimateFee();

const Cell = TonWeb.boc.Cell;
const cell = new Cell();
cell.bits.writeUint(0, 32);
cell.bits.writeAddress(address);
cell.bits.writeGrams(1);
console.log(cell.print()); // print cell data like Fift
const bocBytes = cell.toBoc();

const history = await tonweb.getTransactions(address);

const balance = await tonweb.getBalance(address);

tonweb.sendBoc(bocBytes);
