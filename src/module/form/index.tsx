import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { checkNumberCard, createAttendance } from "./api";

const AttendanceForm = () => {
  const { mutate } = createAttendance();
  const { mutate: checkNumber } = checkNumberCard();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: "",
      numberCard: 0,
      address: "",
      purpose: "",
      meetWith: "",
      gender: "",
      identity: "",
      signature: "",
      checkIn: new Date(),
    },
  });

  const signatureRef = useRef<SignatureCanvas>(null);

  const handleFormSubmit = (values: any) => {
    if (
      !values.fullName ||
      !values.address ||
      !values.purpose ||
      !values.identity ||
      !values.numberCard ||
      !values.meetWith ||
      !values.gender ||
      !values.checkIn ||
      !values.signature
    ) {
      toast.error("Please fill in all required fields.");
    } else {
      mutate(values, {
        onSuccess() {
          toast.success("sukses attend");
          const pdfUrl = `http://localhost:4000/public/pdfAttendance-${values?.fullName}.pdf`;
          window.open(pdfUrl, "_blank");
        },
        onError() {
          toast.error("Number card is currently in use");
        },
      });
    }
  };

  const handleCheckNumberCard = (values: any) => {
    if (!values.numberCard) {
      toast.error("Please fill number card");
    } else {
      const payload = {
        numberCard: values.numberCard,
      };

      checkNumber(payload as any, {
        onSuccess(res) {
          if (res.message == "Number card is currently in use.") {
            toast.error(res.message);
          } else {
            toast.success(res.message);
          }
        },
        onError() {
          toast.error("error");
        },
      });
    }
  };

  const handleSignatureEnd = () => {
    if (signatureRef.current) {
      const dataURL = signatureRef.current.getTrimmedCanvas().toDataURL();
      setValue("signature", dataURL);
    }
  };

  return (
    <div className="flex justify-center">
      <section className="bg-white lg:w-2/4 md:w-3/4 w-10/12 my-5 rounded-[20px] shadow-gray-50">
        <h1 className="p-10 text-center text-[20px] font-bold capitalize">
          Attendance Ungaran Sari Garment (USG)
        </h1>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="px-10">
          {/* Full Name Section */}
          <div className="md:flex gap-10">
            <section className="flex flex-col w-full gap-y-2 mb-4">
              <label className="text-md font-bold">Full Name</label>
              <input
                type="text"
                placeholder="Noor Yulita Apsari"
                value={watch("fullName")}
                onChange={(e) => setValue("fullName", e.target.value)}
                className="border-b-[0.5px] focus:border-[#498AD4] px-2 text-sm py-1.5 outline-none border-slate-200 transition-colors ease-in-out w-full text-black placeholder:text-black/70"
              />
              {errors.fullName && (
                <div className="text-red-500 text-sm">
                  {errors.fullName.message}
                </div>
              )}
            </section>

            {/* Number Card Section */}
            <section className="flex flex-col w-full gap-y-2 mb-4">
              <label className="text-md font-bold">Number Card</label>
              <div className="flex items-center gap-x-4">
                <input
                  type="number"
                  placeholder="50"
                  value={watch("numberCard") || ""}
                  onChange={(e) =>
                    setValue("numberCard", parseInt(e.target.value, 10) || 0)
                  } // Konversi ke number
                  className="border-b-[0.5px] focus:border-[#498AD4] px-2 text-sm py-1.5 outline-none border-slate-200 transition-colors ease-in-out w-full text-black placeholder:text-black/70"
                />

                <button
                  type="button"
                  className="py-1 bg-[#498AD4] px-3 rounded-md text-sm hover:bg-[#899fb8]"
                  onClick={handleSubmit(handleCheckNumberCard)}
                >
                  Check
                </button>
              </div>
              {errors.numberCard && (
                <div className="text-red-500 text-sm">
                  {errors.numberCard.message}
                </div>
              )}
            </section>
          </div>

          {/* Address Section */}
          <div className="md:flex gap-10">
            <section className="flex flex-col w-full gap-y-2 mb-6">
              <label htmlFor="address" className="text-md font-bold">
                Address
              </label>
              <input
                placeholder="Ungaran Raya II"
                value={watch("address")}
                onChange={(e) => setValue("address", e.target.value)}
                className="border-b-[0.5px] focus:border-[#498AD4] px-2 text-sm py-1.5 outline-none border-slate-200 transition-colors ease-in-out w-full text-black placeholder:text-black/70"
              />
              {errors.address && (
                <div className="text-red-500 text-sm">
                  {errors.address.message}
                </div>
              )}
            </section>
          </div>
          {/* Purpose & Meet With Section */}
          <div className="md:flex gap-10">
            {/* Purpose Section */}
            <section className="flex flex-col w-full gap-y-2 mb-6">
              <label htmlFor="purpose" className="text-md font-bold">
                Purpose
              </label>
              <div className="md:grid flex items-center gap-x-4">
                <label className="text-sm">
                  <input
                    type="radio"
                    value="interview"
                    checked={watch("purpose") === "interview"}
                    onChange={() => setValue("purpose", "interview")}
                    className="mr-2"
                  />
                  Interview
                </label>
                <label className="text-sm">
                  <input
                    type="radio"
                    value="tamu-undangan"
                    checked={watch("purpose") === "tamu-undangan"}
                    onChange={() => setValue("purpose", "tamu-undangan")}
                    className="mr-2"
                  />
                  Tamu Undangan
                </label>
                <label className="text-sm">
                  <input
                    type="radio"
                    value="send-barang"
                    checked={watch("purpose") === "send-barang"}
                    onChange={() => setValue("purpose", "send-barang")}
                    className="mr-2"
                  />
                  Send Barang
                </label>
              </div>
              {errors.purpose && (
                <div className="text-red-500 text-sm">
                  {errors.purpose.message}
                </div>
              )}
            </section>

            {/* Meet With Section */}
            <section className="flex flex-col w-full gap-y-2 mb-6">
              <label className="text-md font-bold">Meet With</label>
              <div className="flex items-center gap-x-4">
                <input
                  type="text"
                  placeholder="Bu Fatimah"
                  value={watch("meetWith")}
                  onChange={(e) => setValue("meetWith", e.target.value)}
                  className="border-b-[0.5px] focus:border-[#498AD4] px-2 text-sm py-1.5 outline-none border-slate-200 transition-colors ease-in-out w-full text-black placeholder:text-black/70"
                />
              </div>
              {errors.meetWith && (
                <div className="text-red-500 text-sm">
                  {errors.meetWith.message}
                </div>
              )}
            </section>
          </div>

          {/* Gender & Identity Section */}
          <div className="md:flex gap-10">
            {/* Gender Section */}
            <section className="flex flex-col w-full gap-y-2 mb-6">
              <label className="text-md font-bold">Jenis Kelamin</label>
              <div className="flex items-center gap-x-4">
                <label className="text-sm">
                  <input
                    type="radio"
                    value="male"
                    checked={watch("gender") === "male"}
                    onChange={() => setValue("gender", "male")}
                    className="mr-2"
                  />
                  Laki-laki
                </label>
                <label className="text-sm">
                  <input
                    type="radio"
                    value="female"
                    checked={watch("gender") === "female"}
                    onChange={() => setValue("gender", "female")}
                    className="mr-2"
                  />
                  Perempuan
                </label>
              </div>
              {errors.gender && (
                <div className="text-red-500 text-sm">
                  {errors.gender.message}
                </div>
              )}
            </section>

            {/* Identity Section */}
            <section className="flex flex-col w-full gap-y-2 mb-6">
              <label className="text-md font-bold">Identity</label>
              <div className="flex items-center gap-x-4">
                <label className="text-sm">
                  <input
                    type="radio"
                    value="ktp"
                    checked={watch("identity") === "ktp"}
                    onChange={() => setValue("identity", "ktp")}
                    className="mr-2"
                  />
                  KTP
                </label>
                <label className="text-sm">
                  <input
                    type="radio"
                    value="sim"
                    checked={watch("identity") === "sim"}
                    onChange={() => setValue("identity", "sim")}
                    className="mr-2"
                  />
                  SIM
                </label>
              </div>
              {errors.identity && (
                <div className="text-red-500 text-sm">
                  {errors.identity.message}
                </div>
              )}
            </section>
          </div>

          {/* Signature Section */}
          <section className="flex flex-col w-full">
            <label htmlFor="signature" className="text-md font-bold mb-3">
              Tanda Tangan
            </label>
            <SignatureCanvas
              ref={signatureRef}
              penColor="black"
              canvasProps={{ height: 300, className: "sigCanvas w-full" }}
              onEnd={handleSignatureEnd}
            />
            {errors.signature && (
              <div className="text-red-500 text-sm">
                {errors.signature.message}
              </div>
            )}
          </section>

          {/* Submit Button */}
          <button
            type="submit"
            className={`bg-[#6ca4d5] py-2 rounded-lg w-full text-white font-bold transition-all ease-in-out mb-10 ${
              isSubmitting ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default AttendanceForm;
