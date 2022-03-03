import { MsgExecuteContract, isTxError } from "@terra-money/terra.js";
import moment from "moment";
import * as fs from "fs";
import _ from "lodash";
import { wallet, lcd } from "./wallet";

//https://docs.terraswap.io/docs/contract_resources/contract_addresses/
const run = async (): Promise<void> => {
  try {
    const factoryContract = "terra18qpjm4zkvqnpjpw0zn0tdr8gdzvt8au35v45xf"; // Terraswap TokenFactory
    const tokenContract = "terra14zr9v29f6hgh0v6yn2zeynacq8wsq9nyzqutde";

    const msg = new MsgExecuteContract(
      wallet.key.accAddress,
      factoryContract,
      {
        create_pair: {
          asset_infos: [
            {
              token: {
                contract_addr: tokenContract,
              },
            },
            {
              native_token: {
                denom: "uusd",
              },
            },
          ],
        },
      }, // Msg
      {} // coins
    );

    const msgTx = await wallet.createAndSignTx({
      msgs: [msg],
    });
    const txResult = await lcd.tx.broadcast(msgTx);

    console.log(txResult);

    if (isTxError(txResult)) {
      throw new Error(
        `instantiate failed. code: ${txResult.code}, codespace: ${txResult.codespace}, raw_log: ${txResult.raw_log}`
      );
    }

    const {
      instantiate_contract: { contract_address },
    } = txResult.logs[0].eventsByType;

    console.log(contract_address);

    const now = moment().format("YYYY-MM-DD_HH:mm:ss");
    fs.writeFileSync(
      `./src/result/create_pair_${now}.json`,
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
