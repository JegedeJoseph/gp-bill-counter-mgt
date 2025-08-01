import { useState } from "react";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { ActionFunction, json, redirect } from "@remix-run/node";
// import removed: now using API POST

type ActionData = {
  formError?: string;
  fieldErrors?: {
    companyName?: string;
    contactPerson?: string;
    mobile?: string;
  };
  fields?: {
    companyName: string;
    contactPerson: string;
    address: string;
    email: string;
    //socials
    twitter?: string;
    instagram?: string;
    facebook?: string;
    discord?: string;
    linkedin?: string;
    cateringType: string;
    mobile: string;
  };
};

export const action: ActionFunction = async ({
  request,
}: {
  request: Request;
}) => {
  const formData = await request.formData();

  const companyName = formData.get("companyName") as string;
  const contactPerson = formData.get("contactPerson") as string;
  const address = formData.get("address") as string;
  const email = formData.get("email") as string;
  const twitter = formData.get("Twitter")?.toString() || "";
  const instagram = formData.get("Instagram")?.toString() || "";
  const facebook = formData.get("Facebook")?.toString() || "";
  const discord = formData.get("Discord")?.toString() || "";
  const linkedin = formData.get("Linkedin")?.toString() || "";
  const cateringType = formData.get("cateringType") as string;
  const mobile = formData.get("mobile") as string;

  // Basic validation
  const fieldErrors = {
    companyName: companyName ? undefined : "Company name is required",
    contactPerson: contactPerson ? undefined : "Contact person is required",
    mobile: mobile ? undefined : "Mobile number is required",
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return json(
      {
        fieldErrors,
        fields: {
          companyName,
          contactPerson,
          address,
          email,
          twitter,
          instagram,
          facebook,
          discord,
          linkedin,
          cateringType,
          mobile,
        },
      },
      { status: 400 }
    );
  }

  // Directly create the customer in the database (no fetch)
  try {
    const { connectToDatabase } = await import("~/utils/db.server");
    const { Customer } = await import("~/models/Customer");

    await connectToDatabase();

    await Customer.create({
      companyName,
      contactPerson,
      address,
      email,
      twitter,
      instagram,
      facebook,
      discord,
      linkedin,
      cateringType,
      mobile,
      dateJoined: new Date().toISOString().split("T")[0],
    });
  } catch (err) {
    console.error("❌ Customer creation failed:", err); // <--- ADD THIS
    return json({ formError: "Failed to create customer." }, { status: 500 });
  }

  // Redirect to the customers list page
  return redirect("/dashboard/customers");
};

export default function NewCustomer() {
  const actionData = useActionData<ActionData>();
  const [cateringType, setCateringType] = useState("foreign");
  const navigate = useNavigate();

  return (
    <section className="container h-[100%] justify-items-center">
      <div className="ml-5 mt-5">
        <h1 className="text-4xl tracking-tighter">Create New Customer</h1>
      </div>
      <div className="w-[30%] ml-5 mt-5 shadow-lg p-5 bg-slate-100">
        <Form method="post">
          {actionData?.formError && (
            <div className="p-3 mb-4 text-white bg-red-500 rounded">
              {actionData.formError}
            </div>
          )}
          <div className="flex flex-col mt-4">
            <label htmlFor="companyName" className="text-gray-500">
              Company Name*
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              className={`px-4 py-2 border ${
                actionData?.fieldErrors?.companyName ? "border-red-500" : ""
              }`}
              placeholder="Joe Don's Enterprises"
              defaultValue={actionData?.fields?.companyName}
            />
            {actionData?.fieldErrors?.companyName && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.fieldErrors.companyName}
              </p>
            )}
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="contactPerson" className="text-gray-500">
              Contact Person*
            </label>
            <input
              type="text"
              id="contactPerson"
              name="contactPerson"
              className={`px-4 py-2 border ${
                actionData?.fieldErrors?.contactPerson ? "border-red-500" : ""
              }`}
              placeholder="Contact Person"
              defaultValue={actionData?.fields?.contactPerson}
            />
            {actionData?.fieldErrors?.contactPerson && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.fieldErrors.contactPerson}
              </p>
            )}
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="mobile" className="text-gray-500">
              Mobile Number*
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              className={`px-4 py-2 border ${
                actionData?.fieldErrors?.mobile ? "border-red-500" : ""
              }`}
              placeholder="Mobile Number"
              defaultValue={actionData?.fields?.mobile}
            />
            {actionData?.fieldErrors?.mobile && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.fieldErrors.mobile}
              </p>
            )}
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="address" className="text-gray-500">
              Company Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              className="px-4 py-2 border"
              placeholder="Company Address"
              defaultValue={actionData?.fields?.address}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="email" className="text-gray-500">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="px-4 py-2 border"
              placeholder="abc@example.com"
              defaultValue={actionData?.fields?.email}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="twitter" className="text-gray-500">
              Twitter
            </label>
            <input
              type="text"
              id="twitter"
              name="twitter"
              className="px-4 py-2 border"
              placeholder="@Twitter"
              defaultValue={actionData?.fields?.twitter}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="instagram" className="text-gray-500">
              Instagram
            </label>
            <input
              type="text"
              id="instagram"
              name="instagram"
              className="px-4 py-2 border"
              placeholder="@Instagram"
              defaultValue={actionData?.fields?.instagram}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="facebook" className="text-gray-500">
              Facebook
            </label>
            <input
              type="text"
              id="facebook"
              name="facebook"
              className="px-4 py-2 border"
              placeholder="@Facebook"
              defaultValue={actionData?.fields?.facebook}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="discord" className="text-gray-500">
              Discord
            </label>
            <input
              type="text"
              id="discord"
              name="discord"
              className="px-4 py-2 border"
              placeholder="@Discord"
              defaultValue={actionData?.fields?.discord}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="linkedin" className="text-gray-500">
              Linkedin
            </label>
            <input
              type="text"
              id="linkedin"
              name="linkedin"
              className="px-4 py-2 border"
              placeholder="@Linkedin"
              defaultValue={actionData?.fields?.linkedin}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="cateringType" className="text-gray-500">
              Catering Service Type
            </label>
            <select
              id="cateringType"
              name="cateringType"
              className="px-4 py-2 border"
              value={cateringType}
              onChange={(e) => setCateringType(e.target.value)}
            >
              <option value="foreign">Foreign</option>
              <option value="local">Local</option>
              <option value="corporate">Corporate</option>
              <option value="informal">Informal</option>
            </select>
          </div>
          {/*
          <div className="flex flex-col mt-4">
            <label htmlFor="password" className="text-gray-500">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 border"
              defaultValue={actionData?.fields?.password}
            />
          </div>
          */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="border bg-lime-600 p-2 text-white w-20 hover:bg-lime-700 active:bg-lime-900 rounded-full"
            >
              Create
            </button>
          </div>
        </Form>
      </div>
    </section>
  );
}
