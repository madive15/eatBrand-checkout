import React from 'react';
import { TranslatedString } from '../locale';
import { Button, ButtonSize, ButtonVariant } from '../ui/button';

interface KoreaPaymentProps {
  params: string,
  imgName:string,
  url?:string | undefined,
  krPaymentMethods(payName: string , url:string|undefined): void
}

const KoreaPayment = ({
  params,
  imgName,
  url,
  krPaymentMethods
}: KoreaPaymentProps) => {
  return (
    <Button
      className={`button--slab korea-btn ${imgName}`}
      size={ButtonSize.Large}
      variant={ButtonVariant.Primary}
      onClick={() => { krPaymentMethods(params,url) }}
    >
      <TranslatedString
        id={`payment.cj_payment.korea_payment_${params}`}
      />
    </Button>
  );
};

export default KoreaPayment;