import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useRef } from "react";
import { ChefHat } from "lucide-react";

export const meta: MetaFunction = () => [
  { title: "Company Signup" },
  { name: "description", content: "Sign up your company to initialize the BoQ system." },
];

type ActionData = {
  formError?: string;
  fieldErrors?: {
    companyName?: string;
    companyEmail?: string;
    companyAddress?: string;
    companyLogo?: string;
  };
  fields?: {
    companyName: string;
    companyEmail: string;
    companyAddress: string;
  };
};

export const loader: LoaderFunction = async () => {
  // Optionally, redirect if a company is already registered
  return json({});
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const companyName = formData.get("companyName");
  const companyEmail = formData.get("companyEmail");
  const companyAddress = formData.get("companyAddress");
  const companyLogo = formData.get("companyLogo"); // This will be a File
  const businessType = formData.get("businessType");
  const yearsInBusiness = formData.get("yearsInBusiness");
  const cuisineType = formData.get("cuisineType");
  const maxEventCapacity = formData.get("maxEventCapacity");
  const businessDescription = formData.get("businessDescription");

  // TODO: Validate fields, store company in DB, handle logo upload, send OTP

  // For now, just redirect to dashboard
  return redirect("/dashboard");
};

export default function CompanySignup() {
  const actionData = useActionData<ActionData>();
  const logoRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 relative overflow-hidden">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <ChefHat className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tightest text-gray-800">
              Company Registration
            </h1>
            <p className="text-sm text-gray-600">
              Bill of Quantity Management System
            </p>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-lg mt-10 shadow-lg p-10 bg-white rounded-2xl border border-orange-200">
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Register Your Company</h2>
          <p className="text-center text-gray-500 mb-6">
            Please provide your company details to initialize your BoQ system.
          </p>
          {actionData?.formError && (
            <div className="p-3 mb-4 text-white bg-red-500 rounded">
              {actionData.formError}
            </div>
          )}
          <Form method="post" encType="multipart/form-data">
            <div className="flex flex-col mt-4">
              <label htmlFor="companyName" className="text-gray-500 font-medium">
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>
            <div className="flex flex-col mt-4">
              <label htmlFor="companyEmail" className="text-gray-500 font-medium">
                Company Email
              </label>
              <input
                type="email"
                id="companyEmail"
                name="companyEmail"
                className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>
            <div className="flex flex-col mt-4">
              <label htmlFor="companyLogo" className="text-gray-500 font-medium">
                Company Logo
              </label>
              <input
                ref={logoRef}
                type="file"
                id="companyLogo"
                name="companyLogo"
                className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-400"
                accept="image/*"
                required
              />
            </div>
            <div className="flex flex-col mt-4">
              <label htmlFor="companyAddress" className="text-gray-500 font-medium">
                Company Address
              </label>
              <input
                type="text"
                id="companyAddress"
                name="companyAddress"
                className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>
            <div className="flex flex-col mt-4">
              <label htmlFor="businessType" className="text-gray-500 font-medium">
                Business Type
              </label>
              <input
                type="text"
                id="businessType"
                name="businessType"
                className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>
            <div className="flex flex-col mt-4">
              <label htmlFor="yearsInBusiness" className="text-gray-500 font-medium">
                Years in Business
              </label>
              <input
                type="number"
                id="yearsInBusiness"
                name="yearsInBusiness"
                min="0"
                className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>
            <div className="flex flex-col mt-4">
              <label htmlFor="cuisineType" className="text-gray-500 font-medium">
                Cuisine Type
              </label>
              <input
                type="text"
                id="cuisineType"
                name="cuisineType"
                className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>
            <div className="flex flex-col mt-4">
              <label htmlFor="maxEventCapacity" className="text-gray-500 font-medium">
                Maximum Event Capacity
              </label>
              <input
                type="number"
                id="maxEventCapacity"
                name="maxEventCapacity"
                min="1"
                className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>
            <div className="flex flex-col mt-4">
              <label htmlFor="businessDescription" className="text-gray-500 font-medium">
                Business Description
              </label>
              <textarea
                id="businessDescription"
                name="businessDescription"
                className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-400"
                rows={3}
                required
              />
            </div>
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="px-8 py-2 text-white font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-full shadow-lg transition-all duration-200"
              >
                Register Company
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
