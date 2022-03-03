import { MsgStoreCode, isTxError } from "@terra-money/terra.js";
import * as fs from "fs";
import moment from "moment";
import { wallet, lcd } from "./wallet";

const run = async (): Promise<void> => {
  try {
    const storeCode = new MsgStoreCode(
      wallet.key.accAddress,
      fs
        .readFileSync("./some_contract/artifacts/some_contract.wasm")
        .toString("base64")
    );
    const storeCodeTx = await wallet.createAndSignTx({
      msgs: [storeCode],
    });
    const storeCodeTxResult = await lcd.tx.broadcast(storeCodeTx);

    console.log(storeCodeTxResult);

    if (isTxError(storeCodeTxResult)) {
      throw new Error(
        `store code failed. code: ${storeCodeTxResult.code}, codespace: ${storeCodeTxResult.codespace}, raw_log: ${storeCodeTxResult.raw_log}`
      );
    }

    const {
      store_code: { code_id },
    } = storeCodeTxResult.logs[0].eventsByType;

    console.log(code_id);

    const now = moment().format("YYYY-MM-DD_HH:mm:ss");
    // this file name is for 2.createContract.ts
    fs.writeFileSync(
      `./src/result/upload_code.json`,
      JSON.stringify({
        date: now,
        codeId: code_id,
      })
    );
  } catch (error) {
    console.log("error : ", error);
  }
};

run();
