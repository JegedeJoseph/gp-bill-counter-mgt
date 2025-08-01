import { json } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/react";
import { customersData } from "./customers";

export const action: ActionFunction = async ({ request, params }) => {
  const method = request.method.toLowerCase();
  const mobile = params.mobile;

  if (!mobile) {
    return json({ error: "Mobile number is required" }, { status: 400 });
  }

  // Handle DELETE request
  if (method === "delete") {
    const customerIndex = customersData.findIndex(c => c.mobile === mobile);
    
    if (customerIndex === -1) {
      return json({ error: "Customer not found" }, { status: 404 });
    }
    
    // Remove the customer from the array
    const deletedCustomer = customersData.splice(customerIndex, 1)[0];
    
    return json(deletedCustomer);
  }

  return json({ error: "Method not allowed" }, { status: 405 });
};

// GET a specific customer
export const loader: LoaderFunction = async ({ params }) => {
  const mobile = params.mobile;
  
  if (!mobile) {
    return json({ error: "Mobile number is required" }, { status: 400 });
  }
  
  const customer = customersData.find(c => c.mobile === mobile);
  
  if (!customer) {
    return json({ error: "Customer not found" }, { status: 404 });
  }
  
  return json(customer);
};