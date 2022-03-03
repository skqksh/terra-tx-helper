import { MsgInstantiateContract, isTxError } from "@terra-money/terra.js";
import moment from "moment";
import * as fs from "fs";
import _ from "lodash";
import { wallet, lcd } from "./wallet";

import * as uploadCodeJson from "./result/upload_code.json";

const run = async (): Promise<void> => {
  try {
    const codeId = uploadCodeJson.codeId[0];
    const instantiate = new MsgInstantiateContract(
      wallet.key.accAddress,
      wallet.key.accAddress,
      _.toNumber(codeId), // code ID
      {
        message_per_fee_amount: "1000000",
        message_per_reward_amount: "100000",
        miaw: "terra1qu5fractk8lgq23gh8efvlywal6rsd9ds8r73l",
      }, // InitMsg
      {} // init coins
    );

    const instantiateTx = await wallet.createAndSignTx({
      msgs: [instantiate],
    });
    const instantiateTxResult = await lcd.tx.broadcast(instantiateTx);

    console.log(instantiateTxResult);

    if (isTxError(instantiateTxResult)) {
      throw new Error(
        `instantiate failed. code: ${instantiateTxResult.code}, codespace: ${instantiateTxResult.codespace}, raw_log: ${instantiateTxResult.raw_log}`
      );
    }

    const {
      instantiate_contract: { contract_address },
    } = instantiateTxResult.logs[0].eventsByType;

    console.log(contract_address);

    const now = moment().format("YYYY-MM-DD_HH:mm:ss");
    fs.writeFileSync(
      `./src/result/createContract_${now}.json`,
      JSON.stringify({
        date: now,
        codeId: contract_address,
      })
    );
  } catch (error) {
    console.log("error : ", error);
  }
};
run();
