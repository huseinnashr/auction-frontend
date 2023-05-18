
import "reflect-metadata";
import { Safe } from "../safecatch/safecatch.type";
import { safeCatch } from "../safecatch/safecatch.pkg";
import { AppError } from "../apperror/apperror.pkg";
import { plainToClass } from "class-transformer";

export type ClassConstructor<T> = {
  new(...args: any[]): T & Object;
};

export type JSONType = { [x: string]: any }

export function unmarshall<T>(src: JSONType, targetCls: ClassConstructor<T>): Safe<T> {
  return safeCatch(() => plainToClass(targetCls, src, { excludeExtraneousValues: true }))
}

export function unmarshallStr<T>(src: string, targetCls: ClassConstructor<T>): Safe<T> {
  const srcJson = safeCatch<JSONType>(() => JSON.parse(src))
  if (srcJson instanceof AppError) {
    return new AppError("Failed to parse data to json")
  }

  return safeCatch(() => plainToClass(targetCls, src))
}