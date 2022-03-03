import {
  isTxError,
  MsgExecuteContract,
  MsgSend,
  Coins,
  Coin,
} from "@terra-money/terra.js";
import moment from "moment";
import * as fs from "fs";
import _ from "lodash";
import { wallet, lcd } from "./wallet";

//https://docs.terraswap.io/docs/contract_resources/contract_addresses/
const run = async (): Promise<void> => {
  const recipient = "terra18gh3sdqsqqp2w5qu3geyw8ym2hd739q0yqdl99";
  const tokenContract = "terra15zlu75uckmzwpjuzeluxmdzqy9qx9t6alw0kh5";

  try {
    const sendUstMsg = new MsgSend(
      wallet.key.accAddress,
      recipient,
      new Coins([new Coin("uusd", 1_000_000)])
    );
    const sendTokenMsg = new MsgExecuteContract(
      wallet.key.accAddress,
      tokenContract,
      {
        transfer: {
          amount: Number(100_000_000).toString(),
          recipient,
        },
      }, // Msg
      {} // coins
    );

    const msgTx = await wallet.createAndSignTx({
      msgs: [sendUstMsg, sendTokenMsg],
    });
    const txResult = await lcd.tx.broadcast(msgTx);

    console.log(txResult);

    if (isTxError(txResult)) {
      throw new Error(
        `instantiate failed. code: ${txResult.code}, codespace: ${txResult.codespace}, raw_log: ${txResult.raw_log}`
      );
    }

    console.log(txResult.txhash);

    const now = moment().format("YYYY-MM-DD_HH:mm:ss");
    fs.writeFileSync(
      `./src/result/send_token_${now}.json`,
      JSON.stringify({
        date: now,
        hash: txResult.txhash,
      })
    );
  } catch (error) {
    console.log("error : ", error);
  }
};
run();
