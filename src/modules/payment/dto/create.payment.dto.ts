import { IsNotEmpty, IsOptional } from "class-validator";
import { AvalaibleMethod } from "src/modules/avalaiblesMethod/entity/avalaiblesmethod.entity";
import { PaymentStatus } from "src/modules/paymentStatus/entity/paymentStatus.entity";

export class CreatePaymentDto{

    @IsNotEmpty()
    status: PaymentStatus;

    @IsOptional()
    method: AvalaibleMethod;

    @IsOptional()
    response: string;
}