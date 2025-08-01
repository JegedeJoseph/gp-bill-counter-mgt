import { useLoaderData, Form } from "@remix-run/react";
import {
  LoaderFunction,
  ActionFunction,
  json,
  redirect,
} from "@remix-run/node";
import { connectToDatabase } from "~/utils/db.server";
import { Customer } from "~/models/Customer";
import { requireRole } from "~/utils/session.server";
import { useState, useEffect } from "react";

export const loader: LoaderFunction = async ({ params }) => {
  await connectToDatabase();
  const customer = await Customer.findOne({ mobile: params.mobile });

  if (!customer) {
    throw new Response("Customer not found", { status: 404 });
  }

  return json({ customer });
};

export const action: ActionFunction = async ({ request, params }) => {
  await requireRole(request, ["admin"]);
  const form = await request.formData();
  const mobile = params.mobile;

  await connectToDatabase();
  const customer = await Customer.findOneAndUpdate(
    { mobile },
    {
      companyName: form.get("companyName"),
      contactPerson: form.get("contactPerson"),
      address: form.get("address"),
      email: form.get("email"),
      twitter: form.get("Twitter"),
      instagram: form.get("Instagram"),
      facebook: form.get("Facebook"),
      discord: form.get("Discord"),
      linkedin: form.get("Linkedin"),
      cateringType: form.get("cateringType"),
    },
    { new: true }
  );

  if (!customer) {
    return json({ error: "Customer not found" }, { status: 404 });
  }

  return redirect("/dashboard/customers");
};

export default function EditCustomer() {
  const { customer } = useLoaderData<typeof loader>();
  const [cateringType, setCateringType] = useState(
    customer.cateringType.toLowerCase()
  );

  useEffect(() => {
    setCateringType(customer.cateringType.toLowerCase());
  }, [customer.cateringType]);

  return (
    <section className="container h-[100%] justify-items-center">
      <div className="ml-5 mt-5">
        <h1 className="text-4xl">Edit Customer</h1>
      </div>
      <div className="w-[30%] ml-5 mt-5 shadow-lg p-5 bg-slate-100">
        <Form method="post">
          <div className="flex flex-col mt-4">
            <label htmlFor="companyName" className="text-gray-500">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              className="px-4 py-2 border"
              defaultValue={customer.companyName}
            />
          </div>

          <div className="flex flex-col mt-4">
            <label htmlFor="contactPerson" className="text-gray-500">
              Contact Person
            </label>
            <input
              type="text"
              id="contactPerson"
              name="contactPerson"
              className="px-4 py-2 border"
              defaultValue={customer.contactPerson}
            />
          </div>

          <div className="flex flex-col mt-4">
            <label htmlFor="mobile" className="text-gray-500">
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              className="px-4 py-2 border"
              defaultValue={customer.mobile}
              disabled
            />
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
              defaultValue={customer.address}
            />
          </div>

          <div className="flex flex-col mt-4">
            <label htmlFor="email" className="text-gray-500">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="px-4 py-2 border"
              defaultValue={customer.email}
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
              defaultValue={customer.twitter}
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
              defaultValue={customer.instagram}
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
              defaultValue={customer.facebook}
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
              defaultValue={customer.discord}
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
              placeholder="@username"
              defaultValue={customer.linkedin}
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

          <div className="flex justify-center mt-4">
            <input
              type="submit"
              value="Update"
              className="border bg-lime-600 p-2 text-white w-20 hover:bg-lime-700 active:bg-lime-900 rounded-full"
            />
          </div>
        </Form>
      </div>
    </section>
  );
}
