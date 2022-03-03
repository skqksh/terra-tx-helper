import { MsgInstantiateContract, isTxError } from "@terra-money/terra.js";
import moment from "moment";
import * as fs from "fs";
import _ from "lodash";
import { wallet, lcd } from "./wallet";

//https://docs.terraswap.io/docs/contract_resources/contract_addresses/
const run = async (): Promise<void> => {
  try {
    const instantiate = new MsgInstantiateContract(
      wallet.key.accAddress,
      wallet.key.accAddress,
      148, // code ID
      {
        name: "test_token",
        symbol: "TTNa",
        decimals: 6,
        initial_balances: [
          {
            address: "terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v",
            amount: Number(100_000_000_000).toString(),
          },
        ],
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
      `./src/result/create_token_${now}.json`,
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
