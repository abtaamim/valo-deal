import React from "react";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";

const Contact = () => {
  return (
    <div title={"Contact us"} style={{ color: "white" }}>
      <div className="row contactus">
        <div className="col-md-6 ">
          {/* <img
            src="/images/contactus.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          /> */}
        </div>
        <div className="col-md-4">
          <h1 className="bg-dark p-2 text-center">CONTACT US</h1>
          <p className="text-justify mt-2">
            Any query and info about the product, feel free to call anytime. We are available 24x7.
          </p>
          <p className="mt-3">
            <BiMailSend /> : www.help@valodeal.com
          </p>
          <p className="mt-3">
            <BiPhoneCall /> : 012-3456789
          </p>
          <p className="mt-3">
            <BiSupport /> : 1800-0000-0000 (toll free)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
