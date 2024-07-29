import { useEffect } from "react";
import { TopBar } from "../components/shared/TopBar";

enum ClassName {
  Page = "grid mx-20 px-20 my-20 gap-1 overflow-x-hidden",
  Title = "text-lg py-6 mt-6 font-bold",
}

export function EmailDisclaimer() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div>
      <TopBar />
      <section className={ClassName.Page}>
        <h3 className="text-5xl text-secondary font-semibold py-10">
          EMAIL DISCLAIMER: LIQUID BRIDGE FUND
        </h3>
        <p>
          These terms and conditions apply to the e-mail communication,
          attachments and all subsequent communications and attachments Liquid
          Bridge Fund (registration number 2021/359597/07) or any of its
          subsidiaries ("we"/"us"/ "LBF") may send you (collectively referred to
          as "the communication"). The information contained in this
          communication is confidential and may be legally privileged. It is
          intended solely for the use of the individual or entity to whom we
          have addressed the communication and others authorised by us to
          receive it. If you are not the intended recipient you are hereby
          notified that any disclosure, copying, distribution or taking action
          in reliance of the contents of this information is strictly prohibited
          and may be unlawful. If you are not the intended recipient of this
          e-mail (or such person's authorised representative), then: 1. Please
          notify the sender of this e-mail immediately by return e-mail,
          facsimile or telephone and delete this message from your system; 2.
          You may not print, store, forward or copy this message or any part
          thereof or disclose or cause information in this message to be
          disclosed to any other person. We are not liable for the improper or
          incomplete transmission of the information contained in this
          communication, or for any delay in its receipt. We are not liable for
          any harm or loss resulting from malicious software code or viruses in
          this e-mail or its attachments, including data corruption resulting
          there from. Any advice or information contained in this e-mail is
          subject also to any governing agreement between us. Only duly
          authorised staff acting within the scope of their authority are able
          to bind us contractually. Unless expressly indicated as such, nothing
          in this e-mail constitutes an offer, warranty or representation from
          us. E-mails sent to us will only be regarded as having been received
          by us once we expressly acknowledged receipt thereof. We will be
          deemed to have sent an e-mail once reflected as sent on our e-mail
          server. If this communication contains offensive, derogatory or
          defamatory statements or materials, it means the message has been sent
          outside the sender's scope of employment with us and only the sender
          can be held liable in his/her personal capacity.
        </p>
      </section>
    </div>
  );
}
