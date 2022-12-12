import React, { useState, useRef, useEffect } from "react";
import useTranslation from "next-translate/useTranslation";
import {
  WalletDepositApiAction,
  WalletWithdrawApiAction,
} from "state/actions/wallet";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import {
  pageAvailabilityCheck,
  SSRAuthCheck,
} from "middlewares/ssr-authentication-check";
import { parseCookies } from "nookies";
import { GetUserInfoByTokenServer } from "service/user";
import Link from "next/link";
import DepositFaq from "components/deposit/DepositFaq";
import {
  FAQ_TYPE_DEPOSIT,
  FAQ_TYPE_WITHDRAWN,
  MY_WALLET_DEPOSIT_TYPE,
  MY_WALLET_WITHDRAW_TYPE,
} from "helpers/core-constants";
import { DipositComponent } from "components/MyWallet/diposit";
import { WithdrawComponent } from "components/MyWallet/withdraw";
import { getFaqList } from "service/faq";
import FAQ from "components/FAQ";
import Footer from "components/common/footer";
import { customPage, landingPage } from "service/landing-page";
import { RootState } from "state/store";
import { useSelector } from "react-redux";
import Wallethistory from "components/wallet/wallet-history";

const DeposiAndWithdraw = ({
  withdrawFaq,
  depositFaq,
  customPageData,
  socialData,
  copyright_text,
}: any) => {
  const router = useRouter();
  const [fullPage, setFullPage] = useState(false);
  const { settings } = useSelector((state: RootState) => state.common);
  const { t } = useTranslation("common");
  const [faqs, setFaqs] = useState<any>([]);

  const [responseData, setResponseData]: any = useState();
  const [dependecy, setDependecy] = useState(0);
  const handleWithdrawAndDeposit = async (actionType: string, id: number) => {
    if (actionType === MY_WALLET_DEPOSIT_TYPE) {
      const response = await WalletDepositApiAction(
        Number(router.query.coin_id)
      );
      if (response.success === true) {
        setResponseData({
          ...response,
          deposit: response.wallet,
          address: response.address ? response.address : null,
        });
      }
    } else {
      const response = await WalletWithdrawApiAction(
        Number(router.query.coin_id)
      );
      if (response.success === true) {
        setResponseData({
          ...response,
          withdraw: response.wallet,
          address: response.address,
        });
      }
    }
  };
  const checkFullPageStatus = () => {
    if (
      parseInt(settings.withdrawal_faq_status) !== 1 &&
      router.query.id === MY_WALLET_WITHDRAW_TYPE
    ) {
      setFullPage(true);
    } else if (
      parseInt(settings.coin_deposit_faq_status) !== 1 &&
      router.query.id === MY_WALLET_DEPOSIT_TYPE
    ) {
      setFullPage(true);
    } else if (!faqs?.length) {
      setFullPage(true);
    }
  };
  useEffect(() => {
    setFaqs(
      router.query.id === MY_WALLET_DEPOSIT_TYPE ? depositFaq : withdrawFaq
    );

    handleWithdrawAndDeposit(
      String(router.query.id),
      Number(router.query.coin_id)
    );
  }, [dependecy]);
  useEffect(() => {
    if (settings.withdrawal_faq_status && router.query.id) {
      checkFullPageStatus();
    }
  }, [settings.withdrawal_faq_status, router.query.id, faqs?.length]);
  return (
    <>
      <div className="page-wrap my-wallet-page">
        <div className="container">
          <div className={"row"}>
            {router.query.id === MY_WALLET_DEPOSIT_TYPE && (
              <DipositComponent
                responseData={responseData}
                router={router}
                setDependecy={setDependecy}
                fullPage={fullPage}
              />
            )}

            {router.query.id === MY_WALLET_WITHDRAW_TYPE && (
              <WithdrawComponent
                responseData={responseData}
                router={router}
                fullPage={fullPage}
              />
            )}
            <div className={`col-md-5 faq-wallet-section`}>
              {fullPage === false && (
                <div className={`box-one single-box visible`}>
                  <div className="section-wrapper boxShadow">
                    <FAQ faqs={faqs} type={router.query.id} />
                  </div>
                </div>
              )}
              <div className="mt-3">
                <h4>{t("How it works?")}</h4>
                <div className="flexItem">
                  <div>
                    <div className="timeLineLists">
                      <div className="timeLineIcon">
                        <i className="fa-sharp fa-solid fa-circle-check active"></i>
                      </div>
                      <div>
                        <h5>{t("This is a First step")}</h5>
                        <span>{t("You will do this")}</span>
                      </div>
                    </div>

                    <div className="timeLineLists">
                      <div className="timeLineIcon">
                        <i className="fa-sharp fa-solid fa-circle-check active"></i>
                      </div>
                      <div>
                        <h5>{t("This is a Second step")}</h5>
                        <span>{t("You will do this")}</span>
                      </div>
                    </div>

                    <div className="timeLineLists">
                      <div className="timeLineIcon">
                        <i className="fa-sharp fa-solid fa-circle-check active"></i>
                      </div>
                      <div>
                        <h5>{t("This is a Third step")}</h5>
                        <span>{t("You will do this")}</span>
                      </div>
                    </div>
                    <div className="timeLineLists">
                      <div className="">
                        <i className="fa-sharp fa-solid fa-circle-check active"></i>
                      </div>
                      <div>
                        <h5>{t("This is a Fourth step")}</h5>
                        <p>{t("do this")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {router.query.id && (
            <Wallethistory
              type={
                router.query.id === MY_WALLET_WITHDRAW_TYPE
                  ? "withdrawal"
                  : "deposit"
              }
            />
          )}
        </div>
      </div>
      <Footer
        customPageData={customPageData}
        socialData={socialData}
        copyright_text={copyright_text}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/user/my-wallet/deposit");
  const cookies = parseCookies(ctx);
  const response = await GetUserInfoByTokenServer(cookies.token);
  const commonRes = await pageAvailabilityCheck();
  const FAQ = await getFaqList();
  let withdrawFaq: any[] = [];
  let depositFaq: any[] = [];
  FAQ.data?.data?.map((faq: any) => {
    if (faq?.faq_type_id === FAQ_TYPE_DEPOSIT) {
      depositFaq.push(faq);
    } else if (faq?.faq_type_id === FAQ_TYPE_WITHDRAWN) {
      withdrawFaq.push(faq);
    }
  });

  const { data } = await landingPage();
  const { data: customPageData } = await customPage();

  if (parseInt(commonRes.currency_deposit_status) !== 1) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      user: response.user,
      withdrawFaq: withdrawFaq,
      depositFaq: depositFaq,
      socialData: data.media_list,
      copyright_text: data?.copyright_text,
      customPageData: customPageData.data,
    },
  };
};

export default DeposiAndWithdraw;
