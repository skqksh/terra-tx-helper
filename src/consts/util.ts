import BigNumber from "bignumber.js";
import _ from "lodash";
import moment, { Moment } from "moment";

import currency from "./currency";

const truncate = (text: string = "", [h, t]: number[] = [8, 6]): string => {
  const head = text.slice(0, h);
  const tail = text.slice(-1 * t, text.length);
  return text.length > h + t ? [head, tail].join("...") : text;
};

const jsonTryParse = <T>(value: string): T | undefined => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
};

const setComma = (str: string | number): string => {
  const parts = _.toString(str).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

const delComma = (str: string | number): string => {
  return _.toString(str).replace(/,/g, "");
};

const extractNumber = (str: string): string => str.replace(/\D+/g, "");

const isNativeTerra = (str: string): boolean =>
  str.startsWith("u") &&
  currency.currencies.includes(str.slice(1).toUpperCase());

const isNativeDenom = (str: string): boolean =>
  str === "uluna" || isNativeTerra(str);

const isNumberString = (value: number | string): boolean =>
  false === new BigNumber(value || "").isNaN();

const toBn = (value?: number | string): BigNumber => new BigNumber(value || 0);

const isEven = (value: number): boolean => value % 2 === 0;

const isOdd = (value: number): boolean => !isEven(value);

const toBase64 = (value: string): string =>
  Buffer.from(value).toString("base64");

const fromBase64 = (value: string): string =>
  Buffer.from(value, "base64").toString();

const now = (): Moment => moment();

const isURL = (value: string): boolean => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export default {
  truncate,
  jsonTryParse,
  setComma,
  delComma,
  extractNumber,
  isNativeTerra,
  isNativeDenom,
  isNumberString,
  toBn,
  isEven,
  isOdd,
  toBase64,
  fromBase64,
  now,
  isURL,
};
