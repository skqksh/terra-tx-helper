import {
  isTxError,
  MsgExecuteContract,
  Coins,
  Coin,
} from "@terra-money/terra.js";
import moment from "moment";
import * as fs from "fs";
import _ from "lodash";
import { wallet, lcd } from "./wallet";

//https://docs.terraswap.io/docs/contract_resources/contract_addresses/
const run = async (): Promise<void> => {
  const tokenContract = "terra14zr9v29f6hgh0v6yn2zeynacq8wsq9nyzqutde";
  const pairContract = "terra1xajwm4nhgt2c5h2kt3slp7vyt62t3ylndepsh5";
  const amount = Number(1_000_000_000).toString();

  try {
    const increaseAllowance = new MsgExecuteContract(
      wallet.key.accAddress,
      tokenContract,
      {
        increase_allowance: {
          amount,
          expires: {
            never: {},
          },
          spender: pairContract,
        },
      }, // Msg
      {} // coins
    );
    const provideLiquidity = new MsgExecuteContract(
      wallet.key.accAddress,
      pairContract,
      {
        provide_liquidity: {
          assets: [
            {
              info: {
                token: {
                  contract_addr: tokenContract,
                },
              },
              amount,
            },
            {
              info: {
                native_token: {
                  denom: "uusd",
                },
              },
              amount,
            },
          ],
        },
      }, // Msg
      new Coins([new Coin("uusd", amount)]) // coins
    );

    const msgTx = await wallet.createAndSignTx({
      msgs: [increaseAllowance, provideLiquidity],
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
      `./src/result/providePool${now}.json`,
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
