import React, { useEffect, useState } from 'react';
import CJPaymentValidation from './CJpaymentValidation';
import { ICashRecive, IVirtualAccout } from './Payment';
import './cj-payment.scss';
import { TranslatedString } from '../locale';

interface VirtualProps {
  virtualAccoutValues: IVirtualAccout[];
  methodsCashRecive: ICashRecive[];
  customizeCheckout: string;
  customerId: string;
  storeHash: string;
  krPaymentMethods(payName: string, ...rest: string[]): void;
}

interface VirtualOpenParamsProps {
  payName: string,
  bankCd: string,
  accountOwner: string,
  cashReceiptUse: string,
  cashReceiptInfo: string,
}

const KoreaVirtualAccount = ({
  virtualAccoutValues,
  customizeCheckout,
  customerId,
  storeHash,
  methodsCashRecive
}: VirtualProps) => {

  // This variables are for prevent to confuse with function(virtualOpenLink) parameter.
  const customizeCheckoutProps = customizeCheckout;
  const customerIdProps = customerId;
  const storeHashProps = storeHash;

  // Select options state
  const [selected, setSelected] = useState(virtualAccoutValues[0].value);

  // Radio input state
  const [radio, setRadio] = useState<ICashRecive[]>(methodsCashRecive);

  // Input customer name , phonenumber states;
  const [textInput, setTextInput] = useState({
    CashReceiptInfo: '',
    AccountOwner: '',
    UserPhone: ''
  });

  const { CashReceiptInfo, AccountOwner, UserPhone } = textInput;


  // Radio display state
  const [radioValue, setRadioValue] = useState(methodsCashRecive[0].value);

  const [validation, setValidation] = useState({
    AccountOwner: false,
    CashReceiptInfo: false,
    UserPhone: false,
  });

  const onChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { name, value } } = e;
    setTextInput({
      ...textInput,
      [name]: value
    });
    const nameRegex = /^[가-힣]{2,4}$/;
    const numberRegex = /^[0-9]{2,3}[0-9]{3,4}[0-9]{4}$/;

    setValidation({
      ...validation,
      AccountOwner: !nameRegex.test(value) && name === "AccountOwner",
      CashReceiptInfo: !numberRegex.test(value) && name === "CashReceiptInfo",
      UserPhone: !numberRegex.test(value) && name === "UserPhone",
    })
  }

  const { AccountOwner: validationAccountOwner, CashReceiptInfo: validationCashReceiptInfo, UserPhone: validationPhoneInfo } = validation;


  const radioOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = radio.map((item: ICashRecive) => {
      const {target:{value}} = e;
      if (item.value === value) {
        item.checked = true;
        setRadioValue(e.target.value);
        localStorage.setItem('selectdRadio', value);
      } else {
        item.checked = false;
      }
      return item;
    })
    setRadio(newValue);
  }

  // When chekced radio button , get localstorage value.
  useEffect(() => {
    const storedValue = localStorage.getItem('selectdRadio');
    if (storedValue) {
      setRadioValue(storedValue);
    }
  }, []);

  // When browers reload , remove raidovalue localstorage.
  useEffect(() => {
    window.onbeforeunload = () => {
      localStorage.removeItem('selectdRadio');
    }
  }, [])


  const virtualOpenLink = (params: VirtualOpenParamsProps) => {

    const { payName, bankCd, accountOwner, cashReceiptUse, cashReceiptInfo } = params;

    let width = 600;
    let height = 700;
    let top = (window.innerHeight - height) / 2 + screenY;
    let left = (window.innerWidth - width) / 2 + screenX;
    let spec = 'status=no, menubar=no, toolbar=no, resizable=no';
    spec += ', width=' + width + ', height=' + height;
    spec += ', top=' + top + ', left=' + left;

    const confirmAlert = window.confirm('확인 -> localhost:\n취소 -> payment.madive.co.kr');

    if (confirmAlert) {
      window.open(`http://localhost/openPayment?id=${customizeCheckoutProps}&cid=${customerIdProps}&payCd=${payName}&storeHash=${storeHashProps}&bankCd=${bankCd}&accountOwner=${accountOwner}&cashReceiptUse=${cashReceiptUse}&cashReceiptInfo=${cashReceiptInfo}&UserPhone=${UserPhone}`, 'popup', spec);
    } else {
      window.open(`https://payment.madive.co.kr/openPayment?id=${customizeCheckoutProps}&cid=${customerIdProps}&payCd=${payName}&storeHash=${storeHashProps}&bankCd=${bankCd}&accountOwner=${accountOwner}&cashReceiptUse=${cashReceiptUse}&cashReceiptInfo=${cashReceiptInfo}&UserPhone=${UserPhone}`, 'popup', spec);
    }
  }


  // Form event handler.
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = {
      payName: 'VirtualAccount',
      bankCd: selected,
      accountOwner: AccountOwner,
      cashReceiptUse: radioValue,
      cashReceiptInfo: CashReceiptInfo,
    }
    virtualOpenLink(params);
  }

  return (
    <form onSubmit={handleSubmit} className='virtual-method-form checkout-form'>
      <label className="col-sm-2 control-label" htmlFor='BankCd'>
        <TranslatedString id="payment.cj_payment.virtual_account_bank" />
      </label>
      {/* Select options */}
      <select id="selBankCode" className="form-control" name="BankCd" value={selected} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setSelected(e.target.value) }}>
        {virtualAccoutValues.map((item: IVirtualAccout) => {
          return <option key={item.id} value={item.value}>{item.bank}</option>
        })}
      </select>

      {/* Name text input */}
      <div className="form-text-wrap">
        <div className="form-group">
          <label className="col-sm-2 control-label" htmlFor="AccountOwner">
            <TranslatedString id="payment.cj_payment.virtual_account_owner" />
          </label>
          <input
            id="AccountOwner"
            className="form-control"
            type="text"
            name="AccountOwner"
            placeholder='ex:홍길동'
            value={AccountOwner}
            onChange={onChange2}
            minLength={2}
            required
          />
          {validationAccountOwner && <CJPaymentValidation validation={<TranslatedString id="payment.cj_payment.virtual_name_validation_msg" />} />}
        </div>

        {/* Customer PhoneNubmer Text Inputs */}
        <div className="form-group">
          <label className="col-sm-2 control-label" htmlFor="CashReceiptInfo">
            <TranslatedString id="payment.cj_payment.virtual_cashReceipt_info" />
          </label>
          <input
            id="CashReceiptInfo"
            className="form-control"
            type="text"
            name="CashReceiptInfo"
            placeholder='ex:01012341234'
            value={CashReceiptInfo}
            onChange={onChange2}
            minLength={11}
            required
          />
          {validationCashReceiptInfo && <CJPaymentValidation validation="* '-'를 제외하고 입력해주세요." />}
        </div>

        {/* Customer PhoneNumber that recieve information of using virtual account */}
        <div className="form-group">
          <label className="col-sm-2 control-label" htmlFor="UserPhone">
            현금영수증 안내 받을 전화번호
          </label>
          <input
            id="UserPhone"
            className="form-control"
            type="text"
            name="UserPhone"
            placeholder='ex:01012341234'
            value={UserPhone}
            onChange={onChange2}
            minLength={11}
            required
          />
          {validationPhoneInfo && <CJPaymentValidation validation="* '-'를 제외하고 입력해주세요." />}
        </div>
      </div>

      <div id="cashreceiptDiv">
        <div className="form-group">
          {/* Radio Inputs */}
          <label className="col-sm-2 control-label" htmlFor="CashReceiptUse">
            <TranslatedString id="payment.cj_payment.virtual_cashReceipt_useInfo" />
          </label>
          <div className="col-sm-10">
            {radio.map((item: ICashRecive) => {
              return (
                <React.Fragment key={item.id}>
                  <input
                    type="radio"
                    name="CashReceiptUse"
                    id={item.tagId}
                    value={item.value}
                    checked={item.checked}
                    onChange={radioOnchange}
                    required
                  />
                  <label htmlFor={item.tagId}>{item.method}</label>
                </React.Fragment>
              )
            })}
          </div>
        </div>
      </div>
      <button className='go-to-submit'>
        <TranslatedString id="payment.cj_payment.virtual_pay_button_text" />
      </button>
    </form>
  );
};

export default KoreaVirtualAccount;