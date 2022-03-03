import { LCDClient, MnemonicKey } from "@terra-money/terra.js";

// test1 key from localterra accounts
const mk = new MnemonicKey({
  mnemonic:
    "notice oak worry limit wrap speak medal online prefer cluster roof addict wrist behave treat actual wasp year salad speed social layer crew genius",
});

// connect to localterra
export const lcd = new LCDClient({
  URL: "https://bombay-lcd.terra.dev",
  chainID: "bombay-12",
});

export const wallet = lcd.wallet(mk);
