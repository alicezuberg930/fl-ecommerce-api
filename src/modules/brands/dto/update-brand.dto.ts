import { PartialType } from "@nestjs/mapped-types";
import { BrandData } from "./create-brand.dto";

export class UpdateBrandData extends PartialType(BrandData) { }
