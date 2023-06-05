import React, { useEffect, useState } from 'react';
import { ICashRecive, IVirtualAccout } from './Payment';
import './cj-payment.scss';
import { TranslatedString } from '../locale';
import VirtualAccountInput from './VirtualAccountInput';

interface VirtualProps {
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

interface VirtualInputTypes {
  title: string;
  inputID: string;
  inputValue: string;
  inputName: string;
  placeholder: string;
  validationType: boolean;
  validationString: string;
}

const VirtualBank: IVirtualAccout[] = [
  {
    id: 0,
    value: "003",
    bank: "기업"
  },
  {
    id: 1,
    value: "004",
    bank: "국민"
  },
  {
    id: 2,
    value: "007",
    bank: "수협"
  },
  {
    id: 3,
    value: "011",
    bank: "농협"
  },
  {
    id: 4,
    value: "020",
    bank: "우리"
  },
  {
    id: 5,
    value: "031",
    bank: "대구"
  },
  {
    id: 6,
    value: "032",
    bank: "부산"
  },
  {
    id: 7,
    value: "039",
    bank: "경남"
  },
  {
    id: 8,
    value: "071",
    bank: "우체국"
  },
  {
    id: 9,
    value: "081",
    bank: "하나"
  },
  {
    id: 10,
    value: "088",
    bank: "신한"
  },
]


const KoreaVirtualAccount = ({
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
  const [selected, setSelected] = useState<string>(VirtualBank[0].value);

  // Radio input state
  const [radio, setRadio] = useState<ICashRecive[]>(methodsCashRecive);

  const [isDimmed, setIsDimmed] = useState(false);

  // Input customer name , phonenumber states;
  const [textInput, setTextInput] = useState({
    CashReceiptInfo: '',
    AccountOwner: '',
    UserPhone: ''
  });

  const [validation, setValidation] = useState({
    AccountOwner: false,
    CashReceiptInfo: false,
    UserPhone: false,
  });


  const { CashReceiptInfo, AccountOwner, UserPhone } = textInput;
  const { AccountOwner: AccountOwnerValidation, CashReceiptInfo: CashReceiptInfoValidation, UserPhone: UserPhoneValidation } = validation;

  // Radio display state
  const [radioValue, setRadioValue] = useState(methodsCashRecive[0].value);


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

  // const { AccountOwner: validationAccountOwner, CashReceiptInfo: validationCashReceiptInfo, UserPhone: validationPhoneInfo } = validation;


  const radioOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = radio.map((item: ICashRecive) => {
      const { target: { value } } = e;
      if (item.value === value) {
        item.checked = true;
        setRadioValue(value);
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
    let openCJpopup: any;
    const VIRTUAL_ACCOUNT_URL = `https://payment.madive.co.kr/openPayment?id=${customizeCheckoutProps}&cid=${customerIdProps}&payCd=${payName}&storeHash=${storeHashProps}&bankCd=${bankCd}&accountOwner=${accountOwner}&cashReceiptUse=${cashReceiptUse}&cashReceiptInfo=${cashReceiptInfo}&UserPhone=${UserPhone}`;
  
    openCJpopup = window.open("", "CJVirtualAccountPopUP", spec);
    openCJpopup && (openCJpopup.location.href = VIRTUAL_ACCOUNT_URL);

    setIsDimmed(true);

    const checkPopupClosed = () => {
      if (openCJpopup && openCJpopup.closed) {
        setIsDimmed(false);
      } else {
        setTimeout(checkPopupClosed, 100); // 일정 간격으로 팝업 창이 닫히는지 확인
      }
    };
    checkPopupClosed();
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

  const virtualInputInfo: VirtualInputTypes[] = [
    { title: '가상계좌 입금자성명 :', inputID: 'AccountOwner', inputValue: AccountOwner, inputName: 'AccountOwner', placeholder: 'ex:홍길동', validationType: AccountOwnerValidation, validationString: '* 이름을 제대로 입력해주세요.' },
    { title: '현금영수증 발급 번호 :', inputID: 'CashReceiptInfo', inputValue: CashReceiptInfo, inputName: 'CashReceiptInfo', placeholder: '"-" 를 제외 하고 입력해주세요!!.', validationType: CashReceiptInfoValidation, validationString: '* "-"를 제외하고 번호만 입력해주세요.' },
    { title: '현금연영수증 발급 받을 번호:', inputID: 'UserPhone', inputValue: UserPhone, inputName: 'UserPhone', placeholder: '"-" 를 제외 하고 입력해주세요.', validationType: UserPhoneValidation, validationString: '* "-"를 제외하고 번호만 입력해주세요.' }
  ]

  return (
    <>
      {isDimmed && <div className='cjpayment-dimmed'></div>}
      <form onSubmit={handleSubmit} className='virtual-method-form checkout-form'>
        <label className="col-sm-2 control-label" htmlFor='BankCd'>
          <TranslatedString id="payment.cj_payment.virtual_account_bank" />
        </label>
        {/* Select options */}
        <select id="selBankCode" className="form-control" name="BankCd" value={selected} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setSelected(e.target.value as any) }}>
          {VirtualBank.map((item: IVirtualAccout) => {
            return <option key={item.id} value={item.value}>{item.bank}</option>
          })}
        </select>

        {/* Name text input */}
        <div className="form-text-wrap">
          {virtualInputInfo.map(({ title, inputID, inputValue, inputName, placeholder, validationType, validationString }: VirtualInputTypes) => (
            <VirtualAccountInput
              title={title}
              inputID={inputID}
              inputValue={inputValue}
              inputName={inputName}
              onChangeP={onChange2}
              placeholder={placeholder}
              validationType={validationType}
              validationString={validationString}
              key={title}
            />
          ))}
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
    </>
  );
};

export default KoreaVirtualAccount;